// ============================================
//  AmoCRM — отправка лида из формы подключения организации
// ============================================
(function () {
  'use strict';

  var AMO_FORM_ID = '1737582';
  var AMO_FORM_HASH = '29b27afed6c21469e76fb2d717d28608';
  var lastSubmissionKey = '';
  var lastSubmittedAt = 0;
  var inFlightSubmissionKey = '';
  var DUPLICATE_WINDOW_MS = 10000;
  var RESPONSE_TIMEOUT_MS = 15000;

  function sendConnectOrgLeadToAmoCRM(payload) {
    payload = payload || {};
    var name = String(payload.name || '').trim();
    var phone = String(payload.phone || '').trim();
    var messenger = String(payload.messenger || '').trim();
    var submissionKey = [name, phone, messenger].join('|');
    var now = Date.now();
    if (submissionKey === inFlightSubmissionKey ||
        (submissionKey === lastSubmissionKey && now - lastSubmittedAt < DUPLICATE_WINDOW_MS)) {
      return false;
    }
    inFlightSubmissionKey = submissionKey;

    // В локальном предпросмотре не создаём тестовые лиды в рабочей amoCRM.
    var isLocalPreview = window.location.protocol === 'file:' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === 'localhost';
    if (isLocalPreview) {
      console.info('[AmoCRM] connect-org lead skipped in local preview');
      return Promise.resolve().then(function () {
        inFlightSubmissionKey = '';
        lastSubmissionKey = submissionKey;
        lastSubmittedAt = Date.now();
        return { formId: AMO_FORM_ID, status: 'local_preview', transport: 'disabled' };
      });
    }

    var frameName = 'amo_connect_org_hidden_frame_' + now;
    var iframe = document.createElement('iframe');
    iframe.id = frameName;
    iframe.name = frameName;
    iframe.style.cssText = 'display:none;width:0;height:0;border:0;';

    var form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://forms.amocrm.ru/queue/add';
    form.target = frameName;
    form.style.display = 'none';

    var fields = {
      'form_id': AMO_FORM_ID,
      'hash': AMO_FORM_HASH,
      'fields[name_1]': name,
      'fields[1147529_1][634523]': phone,
      'fields[note_2]': messenger ? 'Telegram / MAX: ' + messenger : 'Мессенджер не указан',
      'user_origin': window.location.href
    };

    Object.keys(fields).forEach(function (key) {
      var input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = fields[key];
      form.appendChild(input);
    });

    return new Promise(function (resolve, reject) {
      var submissionStarted = false;
      var settled = false;
      var initialLoadFallback;
      var responseTimeout;

      function removeTransport() {
        if (form.parentNode) form.parentNode.removeChild(form);
        if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
      }

      function finishWithError(message) {
        if (settled) return;
        settled = true;
        inFlightSubmissionKey = '';
        clearTimeout(initialLoadFallback);
        clearTimeout(responseTimeout);
        removeTransport();
        reject(new Error(message));
      }

      function handleResponse() {
        if (!submissionStarted || settled) return;
        settled = true;
        inFlightSubmissionKey = '';
        lastSubmissionKey = submissionKey;
        lastSubmittedAt = Date.now();
        clearTimeout(responseTimeout);

        var eventDetail = {
          formId: AMO_FORM_ID,
          status: 'success',
          transport: 'iframe'
        };
        document.dispatchEvent(new CustomEvent('b2b:connectOrgLeadSubmitted', {
          detail: eventDetail
        }));
        console.info('[AmoCRM] connect-org lead response received', eventDetail);

        setTimeout(removeTransport, 500);
        resolve(eventDetail);
      }

      function startSubmission() {
        if (submissionStarted || settled) return;
        submissionStarted = true;
        clearTimeout(initialLoadFallback);
        iframe.addEventListener('load', handleResponse, { once: true });
        iframe.addEventListener('error', function () {
          finishWithError('AmoCRM response failed');
        }, { once: true });
        responseTimeout = setTimeout(function () {
          finishWithError('AmoCRM response timeout');
        }, RESPONSE_TIMEOUT_MS);
        form.submit();
      }

      // Сначала ждём загрузку пустого iframe, чтобы не принять её за ответ сервера.
      iframe.addEventListener('load', startSubmission, { once: true });
      document.body.appendChild(iframe);
      document.body.appendChild(form);
      initialLoadFallback = setTimeout(function () {
        finishWithError('AmoCRM transport initialization timeout');
      }, 3000);
    });
  }

  window.sendConnectOrgLeadToAmoCRM = sendConnectOrgLeadToAmoCRM;
})();
