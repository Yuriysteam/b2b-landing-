(function() {
  var stepsSection = document.getElementById('steps');
  if (!stepsSection) return;

  var answers = [];
  var screenOrder = [
    'quiz-hook',
    'quiz-step1',
    'quiz-delight',
    'quiz-step2',
    'quiz-step3',
    'quiz-transition',
    'quiz-result'
  ];
  var currentIndex = 0;
  var screensContainer = stepsSection.querySelector('.quiz-screens');

  var resultData = [
    {
      benefits: [
        'Экономия бюджета: ~6–12% на поездках. При 5–10 поездках в месяц и среднем чеке 40–80 тыс ₽ это ≈ 12–96 тыс ₽/мес.',
        'Экономия времени: ~4–6 часов/мес.',
        'Документы: закрывающие в одном месте, чеки не нужно собирать вручную.'
      ],
      cta: { text: 'Посмотреть, как это работает', href: '#', cls: 'btn btn-primary' }
    },
    {
      benefits: [
        'Экономия бюджета: ~8–15% за счёт единого потока и контроля до бронирования. При 10–50 поездках в месяц это обычно ≈ 50–450 тыс ₽/мес.',
        'Экономия времени: до 8 часов в неделю на координации и отчётности.',
        'Документы: заявки, брони и отчёты в одном контуре, без сборки «по кускам».'
      ],
      cta: { text: 'Подключить команду', href: '#', cls: 'btn btn-primary' }
    },
    {
      benefits: [
        'Экономия бюджета: ~10–18% за счёт автополитик, лимитов и маршрутов согласования. При 50+ поездках в месяц это обычно ≈ 350 тыс–1,4 млн ₽/мес.',
        'Экономия времени: снимается значимая часть ручного контроля и выгрузок.',
        'Документы и контроль: политика проверяется при бронировании, данные уходят в системы без ручной сверки. А у координатора всегда есть кнопка отмены.'
      ],
      cta: { text: 'Запросить презентацию', href: '#', cls: 'btn btn-primary' }
    }
  ];

  function getScreenEl(index) {
    return document.getElementById(screenOrder[index]);
  }

  function setFixedHeight() {
    var screens = screensContainer.querySelectorAll('.screen');
    var maxH = 0;
    screens.forEach(function(s) {
      s.classList.add('quiz-screen--measuring');
      var h = s.offsetHeight;
      if (h > maxH) maxH = h;
      s.classList.remove('quiz-screen--measuring');
    });
    if (maxH > 0) {
      screensContainer.style.height = maxH + 'px';
    }
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

    var cardsEl = document.getElementById('result-benefits');
    cardsEl.innerHTML = '';
    r.benefits.forEach(function(text) {
      var card = document.createElement('div');
      card.className = 'benefit-card';
      card.textContent = text;
      cardsEl.appendChild(card);
    });

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
    'quiz-step1': 'quiz-delight',
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

  setFixedHeight();

  var resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setFixedHeight, 150);
  });
})();
