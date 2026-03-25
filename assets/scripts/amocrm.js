// ============================================
//  AmoCRM — отправка лида после формы консультации
//
//  Заполните AMO_FORM_ID и AMO_FORM_HASH:
//  AmoCRM → Настройки → Интеграции → Веб-формы
//  → нужная форма → «Получить код»
//  В коде будет строка вида:
//  var amo_forms_params = { id: "123456", hash: "abc...def", locale: "ru" };
// ============================================
(function () {
  'use strict';

  var AMO_FORM_ID   = '1687954';
  var AMO_FORM_HASH = '4868e5e00c42e9a3e4c15d58398140ff';

  // Используем hidden iframe + form — нет CORS-ограничений,
  // страница не перезагружается, ответ уходит в скрытый фрейм.
  function sendLeadToAmoCRM(phone) {
    if (!AMO_FORM_ID || !AMO_FORM_HASH) {
      console.warn('[AmoCRM] Заполните AMO_FORM_ID и AMO_FORM_HASH в assets/scripts/amocrm.js');
      return;
    }

    // Создаём скрытый iframe-приёмник (один раз)
    var frameName = 'amo_hidden_frame';
    if (!document.getElementById(frameName)) {
      var iframe = document.createElement('iframe');
      iframe.id   = frameName;
      iframe.name = frameName;
      iframe.style.cssText = 'display:none;width:0;height:0;border:0;';
      document.body.appendChild(iframe);
    }

    // Создаём временную форму и отправляем
    var form = document.createElement('form');
    form.method  = 'POST';
    form.action  = 'https://forms.amocrm.ru/queue/add';
    form.target  = frameName;
    form.style.display = 'none';

    // Поля берутся из реальной формы AmoCRM (form_1687950_daaa0...html)
    var fields = {
      'form_id':                  AMO_FORM_ID,
      'hash':                     AMO_FORM_HASH,
      'fields[1147529_1][634523]': phone,
      'user_origin':              window.location.href,
    };

    Object.keys(fields).forEach(function (key) {
      var input   = document.createElement('input');
      input.type  = 'hidden';
      input.name  = key;
      input.value = fields[key];
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();

    // Удаляем форму после отправки
    setTimeout(function () {
      if (form.parentNode) form.parentNode.removeChild(form);
    }, 500);
  }

  window.sendLeadToAmoCRM = sendLeadToAmoCRM;
})();
