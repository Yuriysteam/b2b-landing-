// Плавный скролл к якорям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      const headerHeight = document.querySelector('.header').offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      // Сбросить чекбокс мобильного меню если открыт
      const menuToggle = document.getElementById('menu-toggle');
      if (menuToggle) menuToggle.checked = false;
    }
  });
});

// Прозрачность header при скролле
window.addEventListener('scroll', function() {
  const header = document.querySelector('.header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Мобильное меню
// Табы для секции команды
function showTab(tabId) {
  // Скрыть все табы
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Закрыть все тултипы при переключении табов
  document.querySelectorAll('.documents-tooltip').forEach(tooltip => {
    tooltip.classList.remove('active');
  });
  
  // Показать выбранный таб
  document.getElementById(tabId).classList.add('active');
  event.target.classList.add('active');
}

// Интерактивные шаги (только для десктопа)
(function() {
  const steps = document.querySelectorAll('.step');
  const stepButtons = document.querySelectorAll('.steps-nav__button');
  const stepImages = document.querySelectorAll('.steps-screenshot img');
  let currentStep = 0;

  function isMobile() {
    return window.innerWidth <= 840;
  }

  function showStep(stepIndex) {
    // На мобильных устройствах не переключаем, все шаги видны
    if (isMobile()) return;

    // Убрать активное состояние у всех шагов
    steps.forEach(step => step.classList.remove('active'));
    stepButtons.forEach(btn => btn.classList.remove('active'));
    stepImages.forEach(img => img.classList.remove('active'));

    // Добавить активное состояние выбранному шагу
    if (steps[stepIndex]) {
      steps[stepIndex].classList.add('active');
    }
    if (stepButtons[stepIndex]) {
      stepButtons[stepIndex].classList.add('active');
    }
    if (stepImages[stepIndex]) {
      stepImages[stepIndex].classList.add('active');
    }

    currentStep = stepIndex;
  }

  // Обработчики для кнопок навигации
  stepButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      showStep(index);
    });
  });

  // Обработчики для клика по шагам (десктоп)
  steps.forEach((step, index) => {
    step.addEventListener('click', () => {
      showStep(index);
    });
  });

  // Инициализация - показать первый шаг (только десктоп)
  if (steps.length > 0 && !isMobile()) {
    showStep(0);
  }

  // При изменении размера окна обновляем состояние
  window.addEventListener('resize', function() {
    if (!isMobile() && steps.length > 0) {
      // На десктопе показываем активный шаг
      let hasActive = false;
      steps.forEach(step => {
        if (step.classList.contains('active')) hasActive = true;
      });
      if (!hasActive) {
        showStep(0);
      }
    }
  });
})();

// Инициализация Яндекс.Карты удалена - карта больше не используется

// Функции для шаринга текста с руководителем
function copyShareText() {
  const shareText = 'Готовый текст, который можно переслать ЛПР: коротко про экономию, документы и простое подключение.';
  navigator.clipboard.writeText(shareText).then(() => {
    alert('Текст скопирован в буфер обмена');
  }).catch(err => {
    console.error('Ошибка копирования:', err);
  });
}

function openEmail() {
  const subject = encodeURIComponent('Предложение по корпоративным тарифам');
  const body = encodeURIComponent('Готовый текст, который можно переслать ЛПР: коротко про экономию, документы и простое подключение.');
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

// Tooltip/Drawer для документов
function toggleDocumentsTooltip(event, tooltipId = 'documentsTooltip') {
  if (event) {
    event.preventDefault();
  }
  
  const isMobile = window.innerWidth <= 840;
  
  if (isMobile) {
    // На мобилке открываем drawer
    const drawer = document.getElementById('documentsDrawer');
    if (drawer) {
      drawer.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  } else {
    // На десктопе открываем тултип
    const tooltip = document.getElementById(tooltipId);
    if (tooltip) {
      const isActive = tooltip.classList.contains('active');
      if (isActive) {
        tooltip.classList.remove('active');
      } else {
        // Закрываем другие тултипы если есть
        document.querySelectorAll('.documents-tooltip.active').forEach(t => {
          t.classList.remove('active');
        });
        tooltip.classList.add('active');
      }
    }
  }
}

function closeDocumentsDrawer() {
  const drawer = document.getElementById('documentsDrawer');
  if (drawer) {
    drawer.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Drawer консультации (телефон)
function openConsultationDrawer() {
  const drawer = document.getElementById('consultationDrawer');
  if (drawer) {
    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeConsultationDrawer() {
  const drawer = document.getElementById('consultationDrawer');
  if (drawer) {
    drawer.classList.remove('active');
    document.body.style.overflow = '';
  }
}

(function initConsultationDrawer() {
  const drawer = document.getElementById('consultationDrawer');
  if (!drawer) return;

  document.querySelectorAll('[data-drawer="consultation"], #openConsultationDrawer, #openConsultationDrawer2').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      openConsultationDrawer();
    });
  });

  const overlay = drawer.querySelector('.consultation-drawer__overlay');
  const closeBtn = drawer.querySelector('.consultation-drawer__close');
  if (overlay) overlay.addEventListener('click', closeConsultationDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeConsultationDrawer);

  const form = document.getElementById('consultationForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var input = form.querySelector('input[name="phone"]');
      if (input && input.value.trim()) {
        closeConsultationDrawer();
        input.value = '';
      }
    });
  }
})();

// Закрытие тултипа при клике вне его
document.addEventListener('click', function(e) {
  const tooltips = document.querySelectorAll('.documents-tooltip');
  const links = document.querySelectorAll('.feature-card__link');
  
  // Проверяем, был ли клик внутри тултипа (включая его содержимое) или на ссылке
  let clickedInsideTooltipOrLink = false;
  
  // Проверяем клик на ссылке
  links.forEach(link => {
    if (link.contains(e.target) || link === e.target) {
      clickedInsideTooltipOrLink = true;
    }
  });
  
  // Проверяем клик внутри тултипа (включая кнопки и другой контент)
  tooltips.forEach(tooltip => {
    if (tooltip.contains(e.target) || tooltip === e.target) {
      clickedInsideTooltipOrLink = true;
    }
  });
  
  // Если клик был вне тултипа и ссылки, закрываем все тултипы
  if (!clickedInsideTooltipOrLink) {
    tooltips.forEach(tooltip => {
      tooltip.classList.remove('active');
    });
  }
});

// Закрытие drawer по ESC
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeDocumentsDrawer();
    // Закрываем все тултипы
    document.querySelectorAll('.documents-tooltip').forEach(tooltip => {
      tooltip.classList.remove('active');
    });
  }
});

// Калькулятор экономии для владельца бизнеса (бюджет → выгода)
(function () {
  const widgets = document.querySelectorAll('.owner-savings');
  if (!widgets.length) return;

  const BASE_DISCOUNT = 0.4; // "до 40%" из копирайта

  function parseMoney(value) {
    const digits = String(value || '').replace(/[^\d]/g, '');
    return digits ? Number(digits) : 0;
  }

  function formatNumberRu(n) {
    return (n || 0).toLocaleString('ru-RU').replace(/\s/g, '\u00A0');
  }

  function formatInput(value) {
    const digits = String(value || '').replace(/[^\d]/g, '');
    if (!digits) return '';
    const num = Number(digits);
    // Используем обычные пробелы для input (не неразрывные)
    return num.toLocaleString('ru-RU');
  }

  widgets.forEach((widget) => {
    const input = widget.querySelector('.owner-savings__input');
    const slider = widget.querySelector('.owner-savings__slider');
    const out = widget.querySelector('.owner-savings__result');
    if (!input || !out) return;

    // Форматируем предустановленное значение
    if (input.value) {
      input.value = formatInput(input.value);
    }

    // Синхронизация ползунка с полем ввода
    function syncSlider() {
      if (!slider) return;
      const budget = parseMoney(input.value);
      if (budget >= 100000 && budget <= 5000000) {
        slider.value = budget;
      }
    }

    // Синхронизация поля ввода с ползунком
    function syncInput() {
      const value = parseInt(slider.value);
      input.value = formatInput(value);
    }

    const update = () => {
      const budget = parseMoney(input.value);
      if (!budget) {
        out.innerHTML = 'Потенциальная экономия';
        return;
      }

      const savings = Math.round(budget * BASE_DISCOUNT);
      out.innerHTML = `Потенциальная экономия: <strong>до\u00A0${formatNumberRu(savings)}\u00A0₽/мес</strong>`;
    };

    // Форматируем ввод при наборе
    input.addEventListener('input', function(e) {
      const cursorPosition = this.selectionStart;
      const oldValue = this.value;
      const newValue = formatInput(this.value);
      
      this.value = newValue;
      
      // Восстанавливаем позицию курсора
      const diff = newValue.length - oldValue.length;
      const newPosition = cursorPosition + diff;
      this.setSelectionRange(newPosition, newPosition);
      
      syncSlider();
      update();
    });

    input.addEventListener('change', function() {
      this.value = formatInput(this.value);
      syncSlider();
      update();
    });

    // Обработка ползунка
    if (slider) {
      slider.addEventListener('input', function() {
        syncInput();
        update();
      });
    }

    // Инициализация при загрузке - сразу показываем результат
    syncSlider();
    update();
  });
})();

// Текущий год в футере (статичный HTML → динамическая подстановка)
(function () {
  const year = String(new Date().getFullYear());
  document.querySelectorAll('.js-current-year').forEach((el) => {
    el.textContent = year;
  });
})();

