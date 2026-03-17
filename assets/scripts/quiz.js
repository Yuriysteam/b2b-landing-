(function() {
  var stepsSection = document.getElementById('steps');
  if (!stepsSection) return;

  var answers = [];
  var screenOrder = [
    'quiz-hook',
    'quiz-step1',
    'quiz-step2',
    'quiz-step3',
    'quiz-transition',
    'quiz-result'
  ];
  var currentIndex = 0;
  var screensContainer = stepsSection.querySelector('.quiz-screens');

  var resultData = [
    {
      budget: { value: '~6–12%', detail: 'на поездках за счёт корпоративных скидок и спецтарифов', note: 'При 5–10 поездках в месяц и среднем чеке 40–80 тыс ₽ это ≈ 12–96 тыс ₽/мес.' },
      time: { value: '~4–6 часов/мес.', detail: 'за счёт единого поиска, бронирования и документов в одном месте', note: 'Чеки не нужно собирать вручную — закрывающие формируются автоматически.' },
      cta: { text: 'Запустить бесплатно', href: 'https://passport.yandex.ru/auth/reg/org?origin=travel_unmanaged&retpath=https://travel.yandex.ru/business/workspace/', cls: 'btn btn-primary' }
    },
    {
      budget: { value: '~8–15%', detail: 'за счёт единого потока и контроля до бронирования', note: 'При 10–50 поездках в месяц это обычно ≈ 50–450 тыс ₽/мес.' },
      time: { value: 'до 8 часов/нед.', detail: 'на координации и отчётности', note: 'Заявки, брони и отчёты в одном контуре — без сборки «по кускам».' },
      cta: { text: 'Подключить команду', href: 'https://passport.yandex.ru/auth/reg/org?origin=travel_unmanaged&retpath=https://travel.yandex.ru/business/workspace/', cls: 'btn btn-primary' }
    },
    {
      budget: { value: '~10–18%', detail: 'за счёт автополитик, лимитов и маршрутов согласования', note: 'При 50+ поездках в месяц это обычно ≈ 350 тыс–1,4 млн ₽/мес.' },
      time: { value: 'значимая часть', detail: 'ручного контроля и выгрузок снимается автоматически', note: 'Политика проверяется при бронировании, данные уходят в системы без ручной сверки.' },
      cta: { text: 'Запустить пилот', href: 'https://passport.yandex.ru/auth/reg/org?origin=travel_unmanaged&retpath=https://travel.yandex.ru/business/workspace/', cls: 'btn btn-primary' }
    }
  ];

  function getScreenEl(index) {
    return document.getElementById(screenOrder[index]);
  }

  function goTo(newIndex, direction) {
    if (newIndex === currentIndex) return;
    if (newIndex < 0 || newIndex >= screenOrder.length) return;

    var oldScreen = getScreenEl(currentIndex);
    var newScreen = getScreenEl(newIndex);

    oldScreen.classList.remove('active');
    newScreen.classList.add('active');
    currentIndex = newIndex;

    // Auto-advance on transition screen
    if (screenOrder[currentIndex] === 'quiz-transition') {
      setTimeout(function() {
        var resultIdx = screenOrder.indexOf('quiz-result');
        finishQuiz();
        goTo(resultIdx, 'forward');
      }, 2000);
    }
  }

  function getSegment() {
    var a0 = answers[0], a1 = answers[1], a2 = answers[2];
    if (a0 === 2 || a1 === 2 || a2 === 2) return 2;
    if (a0 === 1 || a1 === 1 || a2 === 1) return 1;
    return 0;
  }

  function finishQuiz() {
    var segment = getSegment();
    var r = resultData[segment];

    document.getElementById('result-budget-value').textContent = r.budget.value + ' ' + r.budget.detail;
    document.getElementById('result-budget-note').textContent = r.budget.note;
    document.getElementById('result-time-value').textContent = r.time.value + ' ' + r.time.detail;
    document.getElementById('result-time-note').textContent = r.time.note;

    var ctaBlock = document.getElementById('result-cta');
    ctaBlock.innerHTML = '';
    var a = document.createElement('a');
    a.href = r.cta.href;
    a.className = r.cta.cls;
    a.textContent = r.cta.text;
    ctaBlock.appendChild(a);
  }

  // Map step IDs to answer indices
  var stepAnswerMap = {
    'quiz-step1': 0,
    'quiz-step2': 1,
    'quiz-step3': 2
  };

  // Previous ASK screen for back navigation
  var backMap = {
    'quiz-step1': 'quiz-hook',
    'quiz-step2': 'quiz-step1',
    'quiz-step3': 'quiz-step2'
  };

  // Next screen after answering
  var nextAfterAnswer = {
    'quiz-step1': 'quiz-step2',
    'quiz-step2': 'quiz-step3',
    'quiz-step3': 'quiz-transition'
  };

  // GIVE buttons: data-quiz-next
  stepsSection.querySelectorAll('[data-quiz-next]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      goTo(currentIndex + 1, 'forward');
    });
  });

  // Quiz option clicks
  stepsSection.querySelectorAll('.quiz-option').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var screen = this.closest('.screen');
      var screenId = screen.id;
      var answerIndex = stepAnswerMap[screenId];
      if (answerIndex !== undefined) {
        answers[answerIndex] = parseInt(this.getAttribute('data-segment'), 10);
      }
      var nextId = nextAfterAnswer[screenId];
      if (nextId) {
        goTo(screenOrder.indexOf(nextId), 'forward');
      }
    });
  });

  // Back buttons
  stepsSection.querySelectorAll('.quiz-prev').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var screen = this.closest('.screen');
      var targetId = backMap[screen.id];
      if (targetId) {
        goTo(screenOrder.indexOf(targetId), 'back');
      }
    });
  });

})();
