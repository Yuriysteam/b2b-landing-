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
      budget: { value: '~6–12%', detail: 'на\u00A0поездках за\u00A0счёт корпоративных скидок и\u00A0спецтарифов', note: 'При 5–10 поездках в\u00A0месяц и\u00A0среднем чеке 40–80\u00A0тыс\u00A0₽ это ≈\u00A012–96\u00A0тыс\u00A0₽ в\u00A0месяц.' },
      time: { value: '~4–6 часов в\u00A0месяц', detail: 'за\u00A0счёт единого поиска, бронирования и\u00A0документов в\u00A0одном месте', note: 'Чеки не\u00A0нужно собирать вручную — закрывающие формируются автоматически.' },
      docs: { title: 'Документы', note: 'Закрывающие в\u00A0одном месте, чеки не\u00A0нужно собирать вручную.' },
      cta: { text: 'Запустить бесплатно', href: 'https://passport.yandex.ru/auth/reg/org?origin=travel_unmanaged&retpath=https://travel.yandex.ru/business/workspace/', cls: 'btn btn-primary' }
    },
    {
      budget: { value: '~8–15%', detail: 'за\u00A0счёт единого потока и\u00A0контроля до\u00A0бронирования', note: 'При 10–50 поездках в\u00A0месяц это обычно ≈\u00A050–450\u00A0тыс\u00A0₽ в\u00A0месяц.' },
      time: { value: 'до\u00A08 часов/нед.', detail: 'на\u00A0координации и\u00A0отчётности', note: 'Заявки, брони и\u00A0отчёты в\u00A0одном контуре — без\u00A0сборки «по\u00A0кускам».' },
      docs: { title: 'Документы', note: 'Заявки, брони и\u00A0отчёты в\u00A0одном контуре, без\u00A0сборки «по\u00A0кускам».' },
      cta: { text: 'Подключить команду', href: 'https://passport.yandex.ru/auth/reg/org?origin=travel_unmanaged&retpath=https://travel.yandex.ru/business/workspace/', cls: 'btn btn-primary' }
    },
    {
      budget: { value: '~10–18%', detail: 'за\u00A0счёт автополитик, лимитов и\u00A0маршрутов согласования', note: 'При 50+ поездках в\u00A0месяц это обычно ≈\u00A0350\u00A0тыс–1,4\u00A0млн\u00A0₽ в\u00A0месяц.' },
      time: { value: 'значимая часть', detail: 'ручного контроля и\u00A0выгрузок снимается автоматически', note: 'Политика проверяется при\u00A0бронировании, данные уходят в\u00A0системы без\u00A0ручной сверки.' },
      docs: { title: 'Документы и\u00A0контроль', note: 'Политика проверяется при\u00A0бронировании, данные уходят в\u00A0системы без\u00A0ручной сверки.' },
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
    document.getElementById('result-docs-title').textContent = r.docs.title;
    document.getElementById('result-docs-note').textContent = r.docs.note;

    var ctaBlock = document.getElementById('result-cta');
    ctaBlock.innerHTML = '';
    var a = document.createElement('a');
    a.href = r.cta.href;
    a.className = r.cta.cls;
    a.id = 'connectOrgQuiz';
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
