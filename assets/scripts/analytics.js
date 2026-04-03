// Аналитика — события Яндекс.Метрики для B2B-лендинга
(function () {
  var COUNTERS = [108202214, 50912507];

  function track(goal, params) {
    if (typeof ym !== 'function') return;
    COUNTERS.forEach(function (id) {
      if (params) {
        ym(id, 'reachGoal', goal, params);
      } else {
        ym(id, 'reachGoal', goal);
      }
    });
  }

  // --- Определение позиции кнопки ---
  function getButtonPosition(el) {
    // Кнопка внутри quiz-result
    if (el.closest('#quiz-result') || el.closest('#result-cta')) return 'quiz';
    // Кнопка в hero секции
    if (el.closest('.hero__cta') || el.closest('.hero')) return 'head';
    // Кнопка в cta-section (перед футером)
    if (el.closest('.cta-section')) return 'bottom';
    // Floating CTA (появляется при скролле)
    if (el.closest('#fixedCta') || el.closest('.hero__cta-fixed')) return 'scroll';
    return 'scroll';
  }

  // --- «Подключить организацию» ---
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('a[href*="passport.yandex.ru/auth/reg/org"]');
    if (!btn) return;
    track('b2b_landing_connect_organization_button_click', {
      position: getButtonPosition(btn)
    });
  });

  // --- «Получить консультацию» ---
  document.querySelectorAll(
    '[data-drawer="consultation"], #openConsultationDrawer, #openConsultationDrawer2'
  ).forEach(function (btn) {
    btn.addEventListener('click', function () {
      track('b2b_landing_get_consultation_button_click', {
        position: getButtonPosition(btn)
      });
    });
  });

  // --- «Оставить номер» (submit формы консультации) ---
  var consultationForm = document.getElementById('consultationForm');
  if (consultationForm) {
    consultationForm.addEventListener('submit', function () {
      var phoneInput = document.getElementById('consultationPhone');
      if (!phoneInput) return;
      // Отправляем только если номер валиден (11 цифр)
      var digits = phoneInput.value.replace(/\D/g, '');
      if (digits.length !== 11) return;

      // Определяем позицию по кнопке, которая открыла drawer
      track('b2b_landing_submit_phone_number_button_click', {
        position: window._consultationOpenedFrom || 'head'
      });
    });
  }

  // Сохраняем позицию кнопки, которая открыла drawer консультации
  document.querySelectorAll(
    '[data-drawer="consultation"], #openConsultationDrawer, #openConsultationDrawer2'
  ).forEach(function (btn) {
    btn.addEventListener('click', function () {
      window._consultationOpenedFrom = getButtonPosition(btn);
    });
  });

  // --- Показ блока с квизом (IntersectionObserver) ---
  var stepsSection = document.getElementById('steps');
  if (stepsSection) {
    var quizShown = false;
    var quizObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !quizShown) {
        quizShown = true;
        track('b2b_landing_quiz_block_show');
        quizObserver.disconnect();
      }
    }, { threshold: 0.3 });
    quizObserver.observe(stepsSection);
  }

  // --- «Показать выгоду» ---
  document.querySelectorAll('[data-quiz-next]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      // Только кнопка на первом экране (quiz-hook)
      if (btn.closest('#quiz-hook')) {
        track('b2b_landing_quiz_start_click');
      }
    });
  });

  // --- Клик по варианту квиза ---
  var stepNumberMap = {
    'quiz-step1': 1,
    'quiz-step2': 2,
    'quiz-step3': 3
  };

  document.querySelectorAll('.quiz-option').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var screen = btn.closest('.screen');
      if (!screen) return;
      var step = stepNumberMap[screen.id];
      if (!step) return;
      track('b2b_landing_quiz_answer_click', {
        step: step,
        answer: btn.textContent.trim()
      });
    });
  });

  // --- Показ результата квиза ---
  // Наблюдаем за появлением экрана quiz-result
  var quizResult = document.getElementById('quiz-result');
  if (quizResult) {
    var resultObserver = new MutationObserver(function () {
      if (quizResult.classList.contains('active')) {
        // Собираем данные о результатах
        var budgetValue = document.getElementById('result-budget-value');
        var timeValue = document.getElementById('result-time-value');
        var ctaBtn = document.querySelector('#result-cta a');
        track('b2b_landing_quiz_result_show', {
          budget: budgetValue ? budgetValue.textContent.trim() : '',
          time: timeValue ? timeValue.textContent.trim() : '',
          cta_text: ctaBtn ? ctaBtn.textContent.trim() : ''
        });
        resultObserver.disconnect();
      }
    });
    resultObserver.observe(quizResult, { attributes: true, attributeFilter: ['class'] });
  }

  // --- «Скопировать сообщение» ---
  var copyBtn = document.getElementById('copyShareBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      track('b2b_landing_copy_message_click');
    });
  }

  // --- Клик по пунктам меню ---
  var menuNameMap = {
    '#savings': 'Преимущества',
    '#about': 'О сервисе',
    '#steps': 'Узнать выгоду'
  };

  document.querySelectorAll('.header__nav-link, .header__mobile-nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      var href = link.getAttribute('href');
      var name = menuNameMap[href];
      if (name) {
        track('b2b_landing_menu_button_click', { button_name: name });
      }
    });
  });

  // --- Клик по бургеру (мобилка) ---
  var burgerLabel = document.querySelector('.header__burger');
  if (burgerLabel) {
    burgerLabel.addEventListener('click', function () {
      track('b2b_landing_burger_menu_click');
    });
  }
})();
