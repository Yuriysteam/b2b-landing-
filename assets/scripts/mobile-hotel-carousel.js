// Мобильная карусель отелей на карте
(function () {
  var isMobile = window.matchMedia('(max-width: 760px)');
  if (!isMobile.matches) return;

  var carousel = document.getElementById('mapCarousel');
  if (!carousel) return;

  var currentCity = 'moscow';
  var activeCardIndex = -1;
  var scrollTimeout = null;
  var prevOverlayEl = null;
  var prevOverlayZIndex = '';

  function formatPrice(price) {
    return String(price).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0');
  }

  function getHotelName(hotel) {
    return hotel.balloonTitle || hotel.hint || hotel.name || '';
  }

  function renderCarousel(city) {
    var hotels = window.savingsHotels && window.savingsHotels[city];
    if (!hotels || !hotels.length) {
      carousel.innerHTML = '';
      return;
    }

    currentCity = city;
    activeCardIndex = -1;

    carousel.innerHTML = hotels.map(function (hotel, i) {
      var name = getHotelName(hotel);
      var price = hotel.price ? 'от\u00A0' + formatPrice(hotel.price) + '\u00A0₽/ночь' : '';
      var discount = hotel.discount ? '−' + hotel.discount + '%' : '';
      return (
        '<div class="map-carousel__card" data-index="' + i + '">' +
          '<div class="map-carousel__name">' + name + '</div>' +
          '<div class="map-carousel__row">' +
            (price ? '<span class="map-carousel__price">' + price + '</span>' : '') +
            (discount ? '<span class="map-carousel__discount">' + discount + '</span>' : '') +
          '</div>' +
        '</div>'
      );
    }).join('');

    // Скролим к началу
    carousel.scrollLeft = 0;

    // Определяем и подсвечиваем видимую карточку
    requestAnimationFrame(function () {
      var idx = getCurrentCardIndex();
      activeCardIndex = idx;
      applyActiveState(idx);
    });

    // Привязываем клики на пины
    bindPinClicks(city);
  }

  // Определяем текущую карточку: какая ближе всего к центру видимой области
  function getCurrentCardIndex() {
    var cards = carousel.querySelectorAll('.map-carousel__card');
    if (!cards.length) return 0;

    var rect = carousel.getBoundingClientRect();
    var centerX = rect.left + rect.width / 2;
    var closest = 0;
    var closestDist = Infinity;

    for (var i = 0; i < cards.length; i++) {
      var cardRect = cards[i].getBoundingClientRect();
      var cardCenterX = cardRect.left + cardRect.width / 2;
      var dist = Math.abs(centerX - cardCenterX);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    }
    return closest;
  }

  // Применяем активное состояние к карточке и пину
  function applyActiveState(index) {
    // Карточки
    var cards = carousel.querySelectorAll('.map-carousel__card');
    cards.forEach(function (card, i) {
      card.classList.toggle('map-carousel__card--active', i === index);
    });

    // Пины
    highlightPin(index);
  }

  // Получаем DOM-элемент оверлея ymaps для плейсмарка
  function getOverlayElement(pm) {
    try {
      var overlay = pm.getOverlaySync && pm.getOverlaySync();
      if (!overlay) return null;
      // Пробуем получить корневой элемент оверлея
      if (overlay.getElement) return overlay.getElement();
      var layout = overlay.getLayoutSync && overlay.getLayoutSync();
      if (!layout) return null;
      if (layout.getParentElement) return layout.getParentElement();
      if (layout.getElement) return layout.getElement();
    } catch (e) {}
    return null;
  }

  // Находим .custom-hotel-pin внутри оверлея
  function getPinNode(overlayEl) {
    if (!overlayEl) return null;
    var pin = overlayEl.querySelector && overlayEl.querySelector('.custom-hotel-pin');
    if (!pin && overlayEl.classList && overlayEl.classList.contains('custom-hotel-pin')) pin = overlayEl;
    return pin;
  }

  // Подсветка пина на карте
  function highlightPin(index) {
    var refs = window.savingsPlacemarkRefs && window.savingsPlacemarkRefs[currentCity];
    if (!refs) return;

    // Восстанавливаем z-index предыдущего активного пина
    if (prevOverlayEl) {
      prevOverlayEl.style.zIndex = prevOverlayZIndex;
      var prevPin = getPinNode(prevOverlayEl);
      if (prevPin) prevPin.classList.remove('custom-hotel-pin--active');
      prevOverlayEl = null;
      prevOverlayZIndex = '';
    }

    // Убираем класс со всех (на всякий случай)
    refs.forEach(function (pm) {
      var el = getOverlayElement(pm);
      var pin = getPinNode(el);
      if (pin) pin.classList.remove('custom-hotel-pin--active');
    });

    // Подсвечиваем нужный пин и поднимаем z-index оверлея
    if (refs[index]) {
      var el = getOverlayElement(refs[index]);
      if (el) {
        prevOverlayZIndex = el.style.zIndex || '';
        el.style.zIndex = '9999';
        prevOverlayEl = el;

        var pin = getPinNode(el);
        if (pin) pin.classList.add('custom-hotel-pin--active');
      }
    }
  }

  // Обработка скролла карусели
  carousel.addEventListener('scroll', function () {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function () {
      var newIndex = getCurrentCardIndex();
      if (newIndex !== activeCardIndex) {
        activeCardIndex = newIndex;
        applyActiveState(newIndex);
      }
    }, 80);
  }, { passive: true });

  // Скролл карусели к карточке по индексу
  function scrollToCard(index) {
    var cards = carousel.querySelectorAll('.map-carousel__card');
    if (!cards[index]) return;

    var card = cards[index];
    var scrollLeft = card.offsetLeft - (carousel.offsetWidth - card.offsetWidth) / 2;
    carousel.scrollTo({ left: scrollLeft, behavior: 'smooth' });
  }

  // Привязываем клики на пины → скролл к карточке
  function bindPinClicks(city) {
    var refs = window.savingsPlacemarkRefs && window.savingsPlacemarkRefs[city];
    if (!refs) return;

    refs.forEach(function (pm, index) {
      pm.events.add('click', function (e) {
        e.preventDefault();
        scrollToCard(index);
      });
    });
  }

  // Подписка на переключение табов
  var savingsTabs = document.querySelectorAll('.map-tab[data-section="savings"]');
  savingsTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var city = tab.getAttribute('data-city');
      if (city === 'russia') {
        carousel.innerHTML = '';
      } else {
        setTimeout(function () {
          renderCarousel(city);
        }, 200);
      }
    });
  });

  // Фиксируем позицию карты: если что-то сдвинуло — возвращаем
  function lockMapPosition(city) {
    var map = window.savingsMaps && window.savingsMaps[city];
    if (!map) return;
    var lockedCenter = map.getCenter();
    var lockedZoom = map.getZoom();
    map.events.add('boundschange', function () {
      var curCenter = map.getCenter();
      var curZoom = map.getZoom();
      if (curCenter[0] !== lockedCenter[0] || curCenter[1] !== lockedCenter[1] || curZoom !== lockedZoom) {
        map.setCenter(lockedCenter, lockedZoom, { duration: 0 });
      }
    });
  }

  // Инициализация: ждём загрузки данных карты
  function tryInit() {
    if (window.savingsHotels && window.savingsPlacemarkRefs) {
      renderCarousel('moscow');
      ['moscow', 'spb', 'kazan'].forEach(lockMapPosition);
    } else {
      setTimeout(tryInit, 300);
    }
  }
  tryInit();
})();
