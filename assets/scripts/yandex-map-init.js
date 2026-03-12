// Инициализация Яндекс Карт для секции savings: Москва, СПб, Казань, Россия
// Данные отелей загружаются из assets/data/hotels.json
// Lazy load: пины и точки рисуются только при открытии таба
(function() {
  var mapOptions = {
    controls: [],
    suppressMapOpenBlock: true,
    yandexMapDisablePoiInteractivity: true
  };

  var behaviors = [
    'drag', 'scrollZoom', 'dblClickZoom', 'multiTouch',
    'rightMouseButtonMagnifier', 'leftMouseButtonMagnifier'
  ];

  var MAP_CENTERS = {
    moscow: { center: [55.7558, 37.6173], zoom: 11.5 },
    spb: { center: [59.9343, 30.3351], zoom: 12.5 },
    kazan: { center: [55.7977, 49.1131], zoom: 13 },
    russia: { center: [60, 82], zoom: 4 }
  };

  var hotelsData = null;
  var loadedCities = {};

  function createPinLayout() {
    return ymaps.templateLayoutFactory.createClass(
      '<div class="custom-hotel-pin">' +
        '<div class="custom-hotel-pin__content">' +
          '<span class="custom-hotel-pin__discount">−{{ properties.discount }}%</span>' +
          '<img src="assets/images/BriefCaseB2B.svg" alt="" class="custom-hotel-pin__icon" width="14" height="14">' +
        '</div>' +
      '</div>'
    );
  }

  function createSmallBlackDotLayout() {
    return ymaps.templateLayoutFactory.createClass(
      '<div style="width:5px;height:5px;border-radius:50%;background:#000;"></div>'
    );
  }

  function createBalloonContentLayout() {
    return ymaps.templateLayoutFactory.createClass(
      '<div class="yandex-map-hotel-balloon">' +
        '<span class="yandex-map-hotel-balloon__title">{{ properties.balloonContentHeader }}</span>' +
        '<span class="yandex-map-hotel-balloon__discount">{{ properties.balloonContentBody }}</span>' +
      '</div>'
    );
  }

  function createMap(containerId, center, zoom) {
    var map = new ymaps.Map(containerId, {
      center: center,
      zoom: zoom,
      controls: mapOptions.controls
    }, mapOptions);
    map.behaviors.disable(behaviors);
    return map;
  }

  function addPins(map, pins) {
    var CustomPinLayout = createPinLayout();
    var HotelBalloonLayout = createBalloonContentLayout();
    var refs = [];

    pins.forEach(function(pin) {
      var placemark = new ymaps.Placemark(
        pin.c,
        {
          hintContent: pin.n,
          balloonContentHeader: pin.n,
          balloonContentBody: 'Скидка: −' + pin.d + '%',
          discount: pin.d
        },
        {
          iconLayout: CustomPinLayout,
          iconShape: { type: 'Rectangle', coordinates: [[-44, -18], [44, 18]] },
          balloonContentLayout: HotelBalloonLayout,
          hideIconOnBalloonOpen: false,
          openBalloonOnClick: false,
          zIndex: 100
        }
      );
      map.geoObjects.add(placemark);
      refs.push(placemark);
    });

    return refs;
  }

  function addDots(map, dots) {
    var SmallDotLayout = createSmallBlackDotLayout();
    var dotShape = { type: 'Rectangle', coordinates: [[-2.5, -2.5], [2.5, 2.5]] };

    dots.forEach(function(coords) {
      var placemark = new ymaps.Placemark(coords, {}, {
        iconLayout: SmallDotLayout,
        iconShape: dotShape,
        hasBalloon: false,
        hasHint: false,
        zIndex: 1
      });
      map.geoObjects.add(placemark);
    });
  }

  function loadCityData(cityKey) {
    if (loadedCities[cityKey]) return;
    loadedCities[cityKey] = true;

    var containerId = 'yandex-map-' + cityKey;
    var container = document.getElementById(containerId);
    if (!container) return;

    var cfg = MAP_CENTERS[cityKey];
    var map = createMap(containerId, cfg.center, cfg.zoom);

    if (!window.savingsMaps) window.savingsMaps = {};
    window.savingsMaps[cityKey] = map;

    if (cityKey === 'russia') {
      loadRussiaDots(map);
      return;
    }

    if (!hotelsData || !hotelsData[cityKey]) return;

    var cityData = hotelsData[cityKey];
    var placemarkRefs = addPins(map, cityData.pins);
    addDots(map, cityData.dots);

    if (!window.savingsHotels) window.savingsHotels = {};
    if (!window.savingsPlacemarkRefs) window.savingsPlacemarkRefs = {};

    window.savingsHotels[cityKey] = cityData.pins.map(function(p) {
      return {
        coords: p.c,
        hint: p.n,
        balloonTitle: p.n,
        balloonBody: 'Скидка: −' + p.d + '%',
        discount: p.d
      };
    });
    window.savingsPlacemarkRefs[cityKey] = placemarkRefs;
  }

  var RUSSIA_DOTS = [
    [54.7104, 20.4522], [68.9585, 33.0827], [64.5399, 40.5152], [59.2181, 39.8886],
    [57.6261, 39.8845], [56.8587, 35.9176], [56.1290, 40.4066], [56.9965, 40.9716],
    [56.3269, 43.9962], [53.1959, 50.1002], [51.5336, 46.0343], [48.7080, 44.5133],
    [54.3142, 48.4031], [47.2357, 39.7015], [45.0355, 38.9753], [43.5855, 39.7231],
    [44.2210, 43.1350], [43.3180, 45.6947], [56.8389, 60.6057], [55.1644, 61.4368],
    [58.0105, 56.2502], [57.1531, 65.5343], [54.7388, 55.9721], [51.7685, 55.0968],
    [53.4071, 59.0455], [55.0084, 82.9357], [54.9885, 73.3242], [56.4846, 84.9476],
    [56.0153, 92.8932], [52.2869, 104.3050], [53.3548, 83.7696], [55.3546, 86.0875],
    [53.7596, 87.1216], [53.7151, 91.4292], [43.1155, 131.8855], [48.4802, 135.0719],
    [62.0355, 129.6755], [50.2907, 127.5272], [53.0452, 158.6511], [46.9641, 142.7285],
    [42.8238, 132.8735], [50.5512, 137.0079], [55.4449, 65.3415], [54.7826, 32.0453],
    [54.1961, 37.6182], [54.6295, 39.7368], [57.7677, 40.9270], [52.6031, 39.5708],
    [51.6720, 39.1843], [52.7317, 41.4433], [53.1959, 45.0183], [54.1838, 45.1749],
    [56.1322, 47.2519], [56.6343, 47.8995], [56.8527, 53.2114], [51.9581, 85.9603],
    [51.8271, 107.5864], [52.0340, 113.5006], [66.5300, 66.6019], [66.0853, 76.6823],
    [61.2500, 73.3964], [60.9344, 76.5531], [58.5228, 31.2749], [57.8136, 28.3496],
    [61.7849, 34.3469], [53.2521, 34.3717], [52.9651, 36.0785], [51.7373, 36.1874],
    [50.5997, 36.5862], [54.5293, 36.2754], [44.0486, 43.0594], [43.9133, 42.7206],
    [44.0451, 42.8608], [45.0448, 41.9691], [42.9849, 47.5047], [43.0242, 44.6816],
    [43.4846, 43.6072], [46.3078, 44.2558], [46.3497, 48.0408]
  ];

  function loadRussiaDots(map) {
    var SmallDotLayout = createSmallBlackDotLayout();
    var dotShape = { type: 'Rectangle', coordinates: [[-2.5, -2.5], [2.5, 2.5]] };
    RUSSIA_DOTS.forEach(function(c) {
      var placemark = new ymaps.Placemark(c, {}, {
        iconLayout: SmallDotLayout,
        iconShape: dotShape,
        hasBalloon: false,
        hasHint: false
      });
      map.geoObjects.add(placemark);
    });
  }

  function initSavingsMaps() {
    if (typeof ymaps === 'undefined') return;

    ymaps.ready(function() {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'assets/data/hotels.json', true);
      xhr.onload = function() {
        if (xhr.status === 200) {
          hotelsData = JSON.parse(xhr.responseText);
          loadCityData('moscow');
        }
      };
      xhr.send();
    });
  }

  // Hook into savings tab switching for lazy load
  document.addEventListener('click', function(e) {
    var tab = e.target.closest('.map-tab[data-section="savings"]');
    if (!tab) return;
    var city = tab.getAttribute('data-city');
    if (city && typeof ymaps !== 'undefined') {
      ymaps.ready(function() {
        loadCityData(city);
      });
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSavingsMaps);
  } else {
    initSavingsMaps();
  }
})();
