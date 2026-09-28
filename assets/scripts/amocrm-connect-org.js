// ============================================
//  AmoCRM — отправка лида из формы подключения организации
// ============================================
(function () {
  'use strict';

  var AMO_FORM_ID = '1687954';
  var AMO_FORM_HASH = '4868e5e00c42e9a3e4c15d58398140ff';
  var lastSubmittedPhone = '';
  var lastSubmittedAt = 0;
  var DUPLICATE_WINDOW_MS = 10000;

  function sendConnectOrgLeadToAmoCRM(phone) {
    var now = Date.now();
    if (phone === lastSubmittedPhone && now - lastSubmittedAt < DUPLICATE_WINDOW_MS) {
      return false;
    }
    lastSubmittedPhone = phone;
    lastSubmittedAt = now;

    var queueUrl = 'https://forms.amocrm.ru/queue/add';
    var fields = {
      'form_id': AMO_FORM_ID,
      'hash': AMO_FORM_HASH,
      'fields[1147529_1][634523]': phone,
      'user_origin': window.location.href
    };

    var formData = new FormData();
    Object.keys(fields).forEach(function (key) {
      formData.append(key, fields[key]);
    });

    // Beacon продолжает отправку даже после перехода на регистрацию.
    var beaconQueued = typeof navigator.sendBeacon === 'function' &&
      navigator.sendBeacon(queueUrl, formData);
    var form = null;

    // Запасной вариант для браузеров без sendBeacon или при отказе очереди.
    if (!beaconQueued) {
      var frameName = 'amo_connect_org_hidden_frame';
      if (!document.getElementById(frameName)) {
        var iframe = document.createElement('iframe');
        iframe.id = frameName;
        iframe.name = frameName;
        iframe.style.cssText = 'display:none;width:0;height:0;border:0;';
        document.body.appendChild(iframe);
      }

      form = document.createElement('form');
      form.method = 'POST';
      form.action = queueUrl;
      form.target = frameName;
      form.style.display = 'none';

      Object.keys(fields).forEach(function (key) {
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = fields[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    }

    var eventDetail = {
      formId: AMO_FORM_ID,
      status: 'submitted',
      transport: beaconQueued ? 'beacon' : 'iframe'
    };
    document.dispatchEvent(new CustomEvent('b2b:connectOrgLeadSubmitted', {
      detail: eventDetail
    }));
    console.info('[AmoCRM] connect-org lead submitted', eventDetail);

    // Оставляем транспорт на странице дольше минимальной задержки редиректа,
    // чтобы медленный POST не оборвался преждевременной очисткой DOM.
    setTimeout(function () {
      if (form && form.parentNode) form.parentNode.removeChild(form);
    }, 10000);
    return true;
  }

  window.sendConnectOrgLeadToAmoCRM = sendConnectOrgLeadToAmoCRM;
})();
