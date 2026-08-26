// ============================================
//  AmoCRM — отправка лида из формы подключения организации
// ============================================
(function () {
  'use strict';

  var AMO_FORM_ID = '1737582';
  var AMO_FORM_HASH = '29b27afed6c21469e76fb2d717d28608';
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

    var frameName = 'amo_connect_org_hidden_frame';
    if (!document.getElementById(frameName)) {
      var iframe = document.createElement('iframe');
      iframe.id = frameName;
      iframe.name = frameName;
      iframe.style.cssText = 'display:none;width:0;height:0;border:0;';
      document.body.appendChild(iframe);
    }

    var form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://forms.amocrm.ru/queue/add';
    form.target = frameName;
    form.style.display = 'none';

    var fields = {
      'form_id': AMO_FORM_ID,
      'hash': AMO_FORM_HASH,
      'fields[1147529_1][634523]': phone,
      'user_origin': window.location.href
    };

    Object.keys(fields).forEach(function (key) {
      var input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = fields[key];
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();

    var eventDetail = {
      formId: AMO_FORM_ID,
      status: 'submitted',
      transport: 'iframe'
    };
    document.dispatchEvent(new CustomEvent('b2b:connectOrgLeadSubmitted', {
      detail: eventDetail
    }));
    console.info('[AmoCRM] connect-org lead submitted', eventDetail);

    setTimeout(function () {
      if (form.parentNode) form.parentNode.removeChild(form);
    }, 500);
    return true;
  }

  window.sendConnectOrgLeadToAmoCRM = sendConnectOrgLeadToAmoCRM;
})();
