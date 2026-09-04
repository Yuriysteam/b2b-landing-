// Плавный скролл к якорям (кнопки с data-drawer не скроллят, а открывают drawer)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    if (this.getAttribute('data-drawer') === 'consultation') {
      e.preventDefault();
      return;
    }
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
window.addEventListener('error', function(e) {
  console.error('[B2B landing error]', e.message, e.filename, e.lineno, e.colno, e.error);
});

window.addEventListener('unhandledrejection', function(e) {
  console.error('[B2B landing unhandled rejection]', e.reason);
});

function getScrollbarWidth() {
  return window.innerWidth - document.documentElement.clientWidth;
}

var drawerFocusOrigins = {};

function getDrawerFocusableElements(drawer) {
  return Array.prototype.filter.call(
    drawer.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'),
    function(el) { return el.offsetParent !== null; }
  );
}

function focusDrawer(drawer, trigger) {
  drawerFocusOrigins[drawer.id] = trigger || document.activeElement;
  window.requestAnimationFrame(function() {
    var focusable = getDrawerFocusableElements(drawer);
    if (focusable.length) focusable[0].focus();
  });
}

function restoreDrawerFocus(drawer) {
  var trigger = drawerFocusOrigins[drawer.id];
  delete drawerFocusOrigins[drawer.id];
  if (trigger && document.contains(trigger)) trigger.focus();
}

function trapDrawerFocus(event, drawer) {
  if (event.key !== 'Tab') return;
  var focusable = getDrawerFocusableElements(drawer);
  if (!focusable.length) {
    event.preventDefault();
    return;
  }
  var first = focusable[0];
  var last = focusable[focusable.length - 1];
  if (!drawer.contains(document.activeElement)) {
    event.preventDefault();
    first.focus();
  } else if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function formatPhone(value) {
  var raw = String(value || '');
  var digits = raw.replace(/\D/g, '');
  if (!digits) return raw.indexOf('+') !== -1 ? '+' : '';

  if (digits[0] === '7' || digits[0] === '8') {
    digits = digits.slice(1);
  }
  if (!digits) return '+7';
  if (digits.length > 10) digits = digits.slice(0, 10);
  var result = '+7';
  if (digits.length > 0) result += ' (' + digits.slice(0, 3);
  if (digits.length >= 3) result += ') ';
  if (digits.length > 3) result += digits.slice(3, 6);
  if (digits.length > 6) result += '-' + digits.slice(6, 8);
  if (digits.length > 8) result += '-' + digits.slice(8, 10);
  return result;
}

function isValidPhone(value) {
  var digits = value.replace(/\D/g, '');
  return digits.length === 11 && (digits[0] === '7' || digits[0] === '8');
}

function getNormalizedPhone(value) {
  var digits = value.replace(/\D/g, '');
  if (digits.length === 11 && (digits[0] === '7' || digits[0] === '8')) digits = digits.slice(1);
  return '+7' + digits;
}

function pastePhone(event, input, error, errorClass) {
  var clipboard = event.clipboardData || window.clipboardData;
  if (!clipboard) return;
  var pastedValue = clipboard.getData('text');
  if (!/\d/.test(pastedValue)) return;

  event.preventDefault();
  input.value = formatPhone(pastedValue);
  input.classList.remove(errorClass);
  if (error) {
    error.textContent = '';
    error.style.display = 'none';
  }
}

var consultationDrawerDefaultContent = {
  title: 'Получить бесплатную консультацию',
  text: 'Оставьте номер телефона, мы свяжемся с\u00A0вами и\u00A0ответим на\u00A0вопросы',
  button: 'Оставить номер'
};

var connectOrgDrawerContent = {
  title: 'Сделайте рабочие поездки выгоднее',
  text: 'Поможем подключить корпоративные тарифы, настроить оплату и\u00A0документы, чтобы рабочие поездки были без\u00A0лишних расходов',
  button: 'Подключить организацию'
};

var consultationDrawerMode = 'consultation';
var pendingConnectOrgHref = '';

function setConsultationDrawerContent(content) {
  var drawer = document.getElementById('consultationDrawer');
  if (!drawer) return;
  var title = drawer.querySelector('.consultation-drawer__title');
  var text = drawer.querySelector('.consultation-drawer__text');
  var submit = document.getElementById('submitPhoneBtn');
  if (title) title.textContent = content.title;
  if (text) text.textContent = content.text;
  if (submit) {
    submit.textContent = content.button;
    submit.disabled = false;
  }
}

function getConnectOrgButtonPosition(el) {
  if (el.closest('.hero__cta') || el.closest('.hero')) return 'head';
  if (el.closest('.cta-section')) return 'bottom';
  if (el.closest('#fixedCta') || el.closest('.hero__cta-fixed')) return 'scroll';
  return 'scroll';
}

function openConsultationDrawer(options) {
  options = options || {};
  consultationDrawerMode = options.mode || 'consultation';
  window._consultationMode = consultationDrawerMode;
  pendingConnectOrgHref = options.href || '';

  var drawer = document.getElementById('consultationDrawer');
  if (!drawer) return;
  var form = document.getElementById('consultationForm');
  var success = document.getElementById('consultationSuccess');
  var input = document.getElementById('consultationPhone');
  var error = document.getElementById('consultationError');
  var top = drawer.querySelector('.consultation-drawer__top');
  var benefits = drawer.querySelector('.consultation-drawer__benefits');
  setConsultationDrawerContent(consultationDrawerMode === 'connectOrg'
    ? connectOrgDrawerContent
    : consultationDrawerDefaultContent);
  // Сброс к форме при открытии
  var header = drawer.querySelector('.consultation-drawer__header-content');
  if (top) top.style.display = '';
  if (header) header.style.display = '';
  if (benefits) benefits.style.display = '';
  if (form) {
    form.style.display = '';
    form.removeAttribute('data-submitting');
  }
  if (success) success.style.display = 'none';
  if (input) { input.value = ''; input.classList.remove('consultation-drawer__input--error'); }
  if (error) { error.textContent = ''; error.style.display = 'none'; }

  var scrollY = window.scrollY || window.pageYOffset;
  var sb = getScrollbarWidth();
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = window.innerWidth > 760 && sb > 0 ? sb + 'px' : '';
  document.body.setAttribute('data-drawer-scroll-y', scrollY);
  drawer.classList.add('active');
  focusDrawer(drawer, options.trigger);
}

function openConnectOrgDrawer(href, position, trigger) {
  window._consultationOpenedFrom = position || 'head';
  window._consultationMode = 'connectOrg';
  pendingConnectOrgHref = href || '';
  var drawer = document.getElementById('connectOrgDrawer');
  if (!drawer) return;
  var form = document.getElementById('connectOrgForm');
  var input = document.getElementById('connectOrgPhone');
  var error = document.getElementById('connectOrgError');
  var submit = document.getElementById('connectOrgSubmitBtn');
  if (form) {
    form.style.display = '';
    form.removeAttribute('data-submitting');
  }
  if (input) { input.value = ''; input.classList.remove('connect-org-drawer__input--error'); }
  if (error) { error.textContent = ''; error.style.display = 'none'; }
  if (submit) { submit.disabled = false; submit.textContent = 'Подключить организацию'; }

  var scrollY = window.scrollY || window.pageYOffset;
  var sb = getScrollbarWidth();
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = window.innerWidth > 760 && sb > 0 ? sb + 'px' : '';
  document.body.setAttribute('data-drawer-scroll-y', scrollY);
  drawer.classList.add('active');
  focusDrawer(drawer, trigger);
  document.dispatchEvent(new CustomEvent('b2b:connectPhoneDrawerShow', {
    detail: { position: window._consultationOpenedFrom }
  }));
}

function closeConnectOrgDrawer() {
  var drawer = document.getElementById('connectOrgDrawer');
  if (!drawer) return;
  drawer.classList.remove('active');
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
  var scrollY = document.body.getAttribute('data-drawer-scroll-y');
  if (scrollY !== null && scrollY !== '') window.scrollTo(0, parseInt(scrollY, 10));
  document.body.removeAttribute('data-drawer-scroll-y');
  restoreDrawerFocus(drawer);
}

function closeConsultationDrawer() {
  var drawer = document.getElementById('consultationDrawer');
  if (!drawer) return;
  drawer.classList.remove('active');
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
  var scrollY = document.body.getAttribute('data-drawer-scroll-y');
  if (scrollY !== null && scrollY !== '') window.scrollTo(0, parseInt(scrollY, 10));
  document.body.removeAttribute('data-drawer-scroll-y');
  restoreDrawerFocus(drawer);
}

(function initConsultationDrawer() {
  var drawer = document.getElementById('consultationDrawer');
  if (!drawer) return;

  document.querySelectorAll('[data-drawer="consultation"], #openConsultationDrawer, #openConsultationDrawer2').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      openConsultationDrawer({ trigger: btn });
    });
  });

  document.querySelectorAll('a[href*="passport.yandex.ru/auth/reg/org"]').forEach(function(btn) {
    if (btn.closest('#quiz-result') || btn.closest('#result-cta')) return;
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      openConnectOrgDrawer(btn.href, getConnectOrgButtonPosition(btn), btn);
    });
  });

  var overlay = drawer.querySelector('.consultation-drawer__overlay');
  var closeBtn = drawer.querySelector('.consultation-drawer__close');
  if (overlay) overlay.addEventListener('click', closeConsultationDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeConsultationDrawer);

  // Закрытие по Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeConsultationDrawer();
      return;
    }
    if (drawer.classList.contains('active')) trapDrawerFocus(e, drawer);
  });

  // Кнопка «Отлично» закрывает попап
  var successCloseBtn = document.getElementById('consultationSuccessClose');
  if (successCloseBtn) successCloseBtn.addEventListener('click', closeConsultationDrawer);

  var input = document.getElementById('consultationPhone');
  var error = document.getElementById('consultationError');

  // Маска ввода
  if (input) {
    input.addEventListener('paste', function(e) {
      pastePhone(e, input, error, 'consultation-drawer__input--error');
    });

    input.addEventListener('beforeinput', function(e) {
      if (e.inputType !== 'deleteContentBackward' && e.inputType !== 'deleteContentForward') return;
      if (input.selectionStart !== input.selectionEnd) return;

      var value = input.value;
      var pos = input.selectionStart;
      var digits = value.replace(/\D/g, '');

      // Удаляем цифру кода города, а не служебные символы маски: скобку и пробел.
      if (e.inputType === 'deleteContentBackward' && pos === value.length && /^\+7\s\(\d{3}\)\s?$/.test(value)) {
        e.preventDefault();
        input.value = formatPhone(digits.slice(0, -1));
        input.setSelectionRange(input.value.length, input.value.length);
      }
    });

    input.addEventListener('input', function() {
      try {
        var rawValue = input.value;
        var formatted = formatPhone(rawValue);
        input.value = formatted;

        // Не двигаем курсор вручную: на tel-полях это часто ломает удаление маски.
        input.classList.remove('consultation-drawer__input--error');
        if (error) { error.textContent = ''; error.style.display = 'none'; }
      } catch (err) {
        console.error('[phone mask error]', err);
      }
    });
    input.addEventListener('focus', function() {
      if (!input.value) input.value = '+7';
    });
    input.addEventListener('blur', function() {
      if (input.value === '+' || input.value === '+7') input.value = '';
    });
  }

  var form = document.getElementById('consultationForm');
  var success = document.getElementById('consultationSuccess');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      if (!input) return;
      if (form.getAttribute('data-submitting') === 'true') {
        e.stopImmediatePropagation();
        return;
      }
      if (!isValidPhone(input.value)) {
        input.classList.add('consultation-drawer__input--error');
        if (error) {
          error.textContent = 'Введите корректный номер телефона';
          error.style.display = 'block';
        }
        return;
      }
      form.setAttribute('data-submitting', 'true');
      // Успешная отправка
      form.style.display = 'none';
      var top = drawer.querySelector('.consultation-drawer__top');
      var header = drawer.querySelector('.consultation-drawer__header-content');
      var benefits = drawer.querySelector('.consultation-drawer__benefits');
      if (top) top.style.display = 'none';
      if (header) header.style.display = 'none';
      if (benefits) benefits.style.display = 'none';
      if (success) success.style.display = 'flex';

      // Отправка лида в AmoCRM
      if (typeof window.sendLeadToAmoCRM === 'function') {
        window.sendLeadToAmoCRM(getNormalizedPhone(input.value));
      }
    });
  }
})();

(function initConnectOrgDrawer() {
  var drawer = document.getElementById('connectOrgDrawer');
  if (!drawer) return;

  var overlay = drawer.querySelector('.connect-org-drawer__overlay');
  var closeBtn = drawer.querySelector('.connect-org-drawer__close');
  if (overlay) overlay.addEventListener('click', closeConnectOrgDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeConnectOrgDrawer);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeConnectOrgDrawer();
      return;
    }
    if (drawer.classList.contains('active')) trapDrawerFocus(e, drawer);
  });

  var input = document.getElementById('connectOrgPhone');
  var error = document.getElementById('connectOrgError');
  var form = document.getElementById('connectOrgForm');

  if (input) {
    input.addEventListener('paste', function(e) {
      pastePhone(e, input, error, 'connect-org-drawer__input--error');
    });

    input.addEventListener('beforeinput', function(e) {
      if (e.inputType !== 'deleteContentBackward' && e.inputType !== 'deleteContentForward') return;
      if (input.selectionStart !== input.selectionEnd) return;
      var value = input.value;
      var digits = value.replace(/\D/g, '');
      if (e.inputType === 'deleteContentBackward' && input.selectionStart === value.length && /^\+7\s\(\d{3}\)\s?$/.test(value)) {
        e.preventDefault();
        input.value = formatPhone(digits.slice(0, -1));
        input.setSelectionRange(input.value.length, input.value.length);
      }
    });

    input.addEventListener('input', function() {
      input.value = formatPhone(input.value);
      input.classList.remove('connect-org-drawer__input--error');
      if (error) { error.textContent = ''; error.style.display = 'none'; }
    });
    input.addEventListener('focus', function() {
      if (!input.value) input.value = '+7';
    });
    input.addEventListener('blur', function() {
      if (input.value === '+' || input.value === '+7') input.value = '';
    });
  }

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      if (!input) return;
      if (form.getAttribute('data-submitting') === 'true') {
        e.stopImmediatePropagation();
        return;
      }
      if (!isValidPhone(input.value)) {
        input.classList.add('connect-org-drawer__input--error');
        if (error) {
          error.textContent = input.value.trim()
            ? 'Введите корректный номер телефона'
            : 'Укажите номер телефона, чтобы зарегистрировать организацию';
          error.style.display = 'block';
        }
        return;
      }

      var submit = document.getElementById('connectOrgSubmitBtn');
      form.setAttribute('data-submitting', 'true');
      if (submit) {
        submit.disabled = true;
        submit.textContent = 'Переходим…';
      }

      if (typeof window.sendConnectOrgLeadToAmoCRM === 'function') {
        window.sendConnectOrgLeadToAmoCRM(getNormalizedPhone(input.value));
      }

      var redirected = false;
      var redirectAllowedAt = Date.now() + 1500;
      function redirectToConnectOrg() {
        if (redirected) return;
        var redirectDelay = redirectAllowedAt - Date.now();
        if (redirectDelay > 0) {
          setTimeout(redirectToConnectOrg, redirectDelay);
          return;
        }
        redirected = true;
        window.location.href = pendingConnectOrgHref;
      }

      if (typeof window.trackB2BLandingGoal === 'function') {
        window.trackB2BLandingGoal('b2b_landing_connect_organization_after_phone_redirect', {
          position: window._consultationOpenedFrom || 'head'
        }, redirectToConnectOrg);
        setTimeout(redirectToConnectOrg, 800);
      } else {
        setTimeout(redirectToConnectOrg, 600);
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

// Documents drawer — overlay и кнопка закрытия
(function() {
  var overlay = document.querySelector('.documents-drawer__overlay');
  var closeBtn = document.querySelector('.documents-drawer__close');
  if (overlay) overlay.addEventListener('click', closeDocumentsDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDocumentsDrawer);
})();

// Fixed CTA — показываем когда hero и cta-section не видны
(function() {
  var hero = document.querySelector('.hero');
  var ctaSection = document.querySelector('.cta-section');
  var fixedCta = document.getElementById('fixedCta');
  if (!hero || !ctaSection || !fixedCta) return;

  var heroVisible = true;
  var ctaVisible = false;

  function update() {
    fixedCta.classList.toggle('hero__cta-fixed--visible', !heroVisible && !ctaVisible);
  }

  var heroObserver = new IntersectionObserver(function(entries) {
    heroVisible = entries[0].isIntersecting;
    update();
  }, { threshold: 0 });

  var ctaObserver = new IntersectionObserver(function(entries) {
    ctaVisible = entries[0].isIntersecting;
    update();
  }, { threshold: 0 });

  heroObserver.observe(hero);
  ctaObserver.observe(ctaSection);
})();

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
      out.innerHTML = `Потенциальная экономия: <strong>до\u00A0${formatNumberRu(savings)}\u00A0₽ в\u00A0месяц</strong>`;
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

// Яндекс.Метрика — цель landing_goal_achieved на клик по кнопкам «Подключить»
(function () {
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('a[href*="passport.yandex.ru/auth/reg/org"]');
    if (!btn) return;
    if (typeof ym === 'function') {
      ym(108202214, 'reachGoal', 'landing_goal_achieved');
      ym(50912507,  'reachGoal', 'landing_goal_achieved');
    }
  });
})();

// Детальная аналитика — см. assets/scripts/analytics.js
