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
  var isAnimating = false;

  var resultData = [
    {
      diagnosis: 'Малый бизнес — вы бронируете сами, поездок немного.',
      insight: 'Даже при 2–3 поездках в год вы можете возвращать до 40% стоимости жилья — без договоров и минимального оборота.',
      benefits: [
        'Скидки до 40% на жильё — подключаете компанию и бронируете как обычно.',
        'Закрывающие документы по ЭДО: не копите чеки и не собирайте бумажки для бухгалтерии.',
        'Цена со скидкой видна сразу — не нужно сравнивать десяток сайтов.'
      ],
      socialProof: 'Более 5 000 небольших компаний уже экономят на командировках с нами.',
      cta: [
        { text: 'Подключить бизнес', href: '#', cls: 'btn btn-primary' },
        { text: 'Получить консультацию', href: '#', cls: 'btn btn-secondary', drawer: 'consultation' }
      ]
    },
    {
      diagnosis: 'Средний бизнес — регулярные поездки, координатор на связи.',
      insight: 'Компании вашего размера экономят в среднем 120 000 ₽ в квартал, переводя бронирования в единый сервис.',
      benefits: [
        'Все бронирования в одном месте — кто куда едет, на какую сумму.',
        'Сводка для руководства без сбора данных из почты и Excel.',
        'Скидки до 40% и прозрачный контроль лимитов.'
      ],
      socialProof: 'Среди наших клиентов — компании от 50 до 500 сотрудников по всей России.',
      cta: [
        { text: 'Подключить бизнес', href: '#', cls: 'btn btn-primary' },
        { text: 'Получить консультацию', href: '#', cls: 'btn btn-secondary', drawer: 'consultation' }
      ]
    },
    {
      diagnosis: 'Крупный бизнес — десятки поездок, тревел-политика, согласования.',
      insight: 'Крупные клиенты снижают расходы на командировки на 25–40% и сокращают время обработки заявок вдвое.',
      benefits: [
        'При выборе отеля сразу видно — в лимите или нужна заявка на согласование.',
        'Отчёты по подразделениям и направлениям — без выгрузок из разных систем.',
        'Корпоративные скидки до 40%, интеграции с T&E-системами.'
      ],
      socialProof: 'Нам доверяют компании с тысячами командировок в год.',
      cta: [
        { text: 'Подключить бизнес', href: '#', cls: 'btn btn-primary' },
        { text: 'Получить консультацию', href: '#', cls: 'btn btn-secondary', drawer: 'consultation' }
      ]
    }
  ];

  function getScreenEl(index) {
    return document.getElementById(screenOrder[index]);
  }

  function updateContainerHeight(targetScreen) {
    targetScreen.style.position = 'relative';
    targetScreen.style.visibility = 'hidden';
    targetScreen.style.display = 'block';
    targetScreen.style.opacity = '0';
    var h = targetScreen.scrollHeight;
    targetScreen.style.position = '';
    targetScreen.style.visibility = '';
    targetScreen.style.display = '';
    targetScreen.style.opacity = '';
    screensContainer.style.height = h + 'px';
  }

  function goTo(newIndex, direction) {
    if (isAnimating || newIndex === currentIndex) return;
    if (newIndex < 0 || newIndex >= screenOrder.length) return;
    isAnimating = true;

    var oldScreen = getScreenEl(currentIndex);
    var newScreen = getScreenEl(newIndex);
    var forward = direction !== 'back';

    // Prepare new screen
    updateContainerHeight(newScreen);

    // Set entry position for new screen
    newScreen.classList.remove('active', 'exit-left', 'exit-right', 'enter-left');
    if (forward) {
      // new screen enters from right (default translateX(30px))
      newScreen.style.transform = 'translateX(30px)';
    } else {
      // new screen enters from left
      newScreen.style.transform = 'translateX(-30px)';
    }
    newScreen.style.opacity = '0';
    newScreen.classList.add('active');

    // Force reflow
    void newScreen.offsetWidth;

    // Animate new screen in
    newScreen.style.transform = '';
    newScreen.style.opacity = '';

    // Animate old screen out
    if (forward) {
      oldScreen.classList.add('exit-left');
    } else {
      oldScreen.classList.add('exit-right');
    }

    var cleanup = function() {
      oldScreen.classList.remove('active', 'exit-left', 'exit-right');
      oldScreen.removeEventListener('transitionend', onEnd);
      currentIndex = newIndex;
      isAnimating = false;

      // Auto-advance on transition screen
      if (screenOrder[currentIndex] === 'quiz-transition') {
        setTimeout(function() {
          var resultIdx = screenOrder.indexOf('quiz-result');
          finishQuiz();
          goTo(resultIdx, 'forward');
        }, 1500);
      }
    };

    var onEnd = function(e) {
      if (e.propertyName === 'opacity') cleanup();
    };

    oldScreen.addEventListener('transitionend', onEnd);

    // Fallback if transitionend doesn't fire
    setTimeout(cleanup, 400);
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

    document.getElementById('result-diagnosis').textContent = r.diagnosis;
    document.getElementById('result-insight').textContent = r.insight;

    var listEl = document.getElementById('result-benefits');
    listEl.innerHTML = '';
    r.benefits.forEach(function(text) {
      var li = document.createElement('li');
      li.textContent = text;
      listEl.appendChild(li);
    });

    document.getElementById('result-social-proof').textContent = r.socialProof;

    var ctaBlock = document.getElementById('result-cta');
    ctaBlock.innerHTML = '';
    r.cta.forEach(function(item) {
      var a = document.createElement('a');
      a.href = item.href;
      a.className = item.cls;
      a.textContent = item.text;
      if (item.drawer) {
        a.setAttribute('data-drawer', item.drawer);
      }
      ctaBlock.appendChild(a);
    });
  }

  // Map step IDs to answer indices
  var stepAnswerMap = {
    'quiz-step1': 0,
    'quiz-step2': 1,
    'quiz-step3': 2
  };

  // Previous ASK screen for back navigation (skipping GIVE screens)
  var backMap = {
    'quiz-step1': 'quiz-hook',
    'quiz-step2': 'quiz-step1',
    'quiz-step3': 'quiz-step2'
  };

  // Next screen after answering an ASK
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

  // Restart
  var restartBtn = stepsSection.querySelector('.restart-quiz');
  if (restartBtn) {
    restartBtn.addEventListener('click', function() {
      answers = [];
      goTo(0, 'back');
    });
  }

  // Set initial container height
  var firstScreen = getScreenEl(0);
  if (firstScreen) {
    screensContainer.style.height = firstScreen.scrollHeight + 'px';
  }
})();
