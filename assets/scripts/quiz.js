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
      diagnosis: 'У вас сценарий «решаю сам»: вы ведёте поездку от поиска вариантов до документов после возвращения.',
      insight: 'Считаем эффект на ваших вводных: объём, средний чек, частота поездок. Без «средней температуры по рынку».',
      benefits: [
        'Экономия бюджета: ~6–12% на поездках. При 5–10 поездках в месяц и среднем чеке 40–80 тыс ₽ это ≈ 12–96 тыс ₽/мес.',
        'Экономия времени: ~4–6 часов/мес.',
        'Документы: закрывающие в одном месте, чеки не нужно собирать вручную.'
      ],
      socialProof: '',
      cta: [
        { text: '🔥 Запустить бесплатно →', href: '#', cls: 'btn btn-primary' },
        { text: '📅 Получить подборку под мой объём →', href: '#', cls: 'btn btn-secondary', drawer: 'consultation' },
        { text: '🔭 Посмотреть, как это работает →', href: '#', cls: 'btn btn-secondary' }
      ]
    },
    {
      diagnosis: 'У вас сценарий «координирую команду»: заявки, бронирование и документы сходятся в одной роли.',
      insight: 'На демо показываем ваш реальный маршрут: заявка → бронь → документы → отчёт.',
      benefits: [
        'Экономия бюджета: ~8–15% за счёт единого потока и контроля до бронирования. При 10–50 поездках в месяц это обычно ≈ 50–450 тыс ₽/мес.',
        'Экономия времени: до 8 часов в неделю на координации и отчётности.',
        'Документы: заявки, брони и отчёты в одном контуре, без сборки «по кускам».'
      ],
      socialProof: '',
      cta: [
        { text: '🔥 Запустить бесплатно →', href: '#', cls: 'btn btn-primary' },
        { text: '📅 Получить демо под мой формат →', href: '#', cls: 'btn btn-secondary', drawer: 'consultation' },
        { text: '🔭 Посмотреть, как это работает →', href: '#', cls: 'btn btn-secondary' }
      ]
    },
    {
      diagnosis: 'У вас корпоративный сценарий: заявки проходят согласования, лимиты и проверку по тревел-политике.',
      insight: 'Перед пилотом фиксируем KPI (бюджет, скорость, доля ручных операций) и сверяем план/факт на ваших данных.',
      benefits: [
        'Экономия бюджета: ~10–18% за счёт автополитик, лимитов и маршрутов согласования. При 50+ поездках в месяц это обычно ≈ 350 тыс–1,4 млн ₽/мес.',
        'Экономия времени: снимается значимая часть ручного контроля и выгрузок.',
        'Документы и контроль: политика проверяется при бронировании, данные уходят в системы без ручной сверки. А у координатора всегда есть кнопка отмены.'
      ],
      socialProof: '',
      cta: [
        { text: '🔥 Запустить пилот →', href: '#', cls: 'btn btn-primary' },
        { text: '📅 Получить коммерческое предложение →', href: '#', cls: 'btn btn-secondary', drawer: 'consultation' },
        { text: '🔭 Запросить презентацию →', href: '#', cls: 'btn btn-secondary' }
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
        }, 2000);
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

  // Section title (hide when quiz starts)
  var sectionTitle = stepsSection.querySelector('h2');

  // GIVE buttons: data-quiz-next
  stepsSection.querySelectorAll('[data-quiz-next]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      if (sectionTitle) sectionTitle.style.display = 'none';
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

  // Set initial container height
  var firstScreen = getScreenEl(0);
  if (firstScreen) {
    screensContainer.style.height = firstScreen.scrollHeight + 'px';
  }
})();
