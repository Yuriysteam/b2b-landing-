// Инициализация Яндекс Карт для секции savings: Москва, СПб, Казань, вся Россия
(function() {
  const mapStyles = typeof window.MAP_CUSTOMIZATION !== 'undefined' ? window.MAP_CUSTOMIZATION : [];

  var mapOptions = {
    controls: [],
    suppressMapOpenBlock: true,
    yandexMapDisablePoiInteractivity: true
  };

  var behaviors = [
    'drag', 'scrollZoom', 'dblClickZoom', 'multiTouch',
    'rightMouseButtonMagnifier', 'leftMouseButtonMagnifier'
  ];

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

  function createBlackDotLayout() {
    return ymaps.templateLayoutFactory.createClass(
      '<div style="width:8px;height:8px;border-radius:50%;background:#000;"></div>'
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

  function createMap(containerId, center, zoom, placemarks, options) {
    options = options || {};
    var map = new ymaps.Map(containerId, {
      center: center,
      zoom: zoom,
      controls: mapOptions.controls
    }, mapOptions);

    map.setType('yandex#map', { customization: mapStyles });
    map.behaviors.disable(behaviors);

    if (placemarks && placemarks.length) {
      if (options.dotsOnly) {
        var SmallBlackDotLayout = createSmallBlackDotLayout();
        var dotShape = { type: 'Rectangle', coordinates: [[-2.5, -2.5], [2.5, 2.5]] };
        placemarks.forEach(function(pm) {
          var coords = Array.isArray(pm) ? pm : pm.coords;
          var placemark = new ymaps.Placemark(coords, {}, {
            iconLayout: SmallBlackDotLayout,
            iconShape: dotShape,
            hasBalloon: false,
            hasHint: false
          });
          map.geoObjects.add(placemark);
        });
      } else {
        var CustomPinLayout = createPinLayout();
        var BlackDotLayout = createBlackDotLayout();
        var HotelBalloonLayout = createBalloonContentLayout();
        var placemarkRefs = [];
        placemarks.forEach(function(pm) {
          var placemark = new ymaps.Placemark(
            pm.coords,
            {
              hintContent: pm.hint || '',
              balloonContentHeader: pm.balloonTitle || '',
              balloonContentBody: pm.balloonBody || '',
              discount: pm.discount !== undefined ? pm.discount : 10
            },
            {
              iconLayout: CustomPinLayout,
              iconShape: { type: 'Rectangle', coordinates: [[-44, -18], [44, 18]] },
              balloonContentLayout: HotelBalloonLayout,
              hideIconOnBalloonOpen: false,
              openBalloonOnClick: false
            }
          );
          placemarkRefs.push(placemark);
          map.geoObjects.add(placemark);
        });
        var OVERLAP_PX = 20;
        function updateBlackDots() {
          var projection = map.options.get('projection');
          var zoomLevel = map.getZoom();
          var globalCenter = map.options.get('globalPixelCenter');
          var size = map.container.getSize();
          if (!projection || !globalCenter || !size) return;
          function coordToPixel(coord) {
            var g = projection.toGlobalPixels(coord, zoomLevel);
            return [g[0] - globalCenter[0] + size[0] / 2, g[1] - globalCenter[1] + size[1] / 2];
          }
          var pixels = [];
          for (var i = 0; i < placemarkRefs.length; i++) {
            pixels.push(coordToPixel(placemarks[i].coords));
          }
          var toBlack = {};
          for (var i = 0; i < placemarkRefs.length; i++) {
            for (var j = i + 1; j < placemarkRefs.length; j++) {
              var dx = pixels[i][0] - pixels[j][0];
              var dy = pixels[i][1] - pixels[j][1];
              if (Math.sqrt(dx * dx + dy * dy) < OVERLAP_PX) {
                var di = placemarks[i].discount !== undefined ? placemarks[i].discount : 10;
                var dj = placemarks[j].discount !== undefined ? placemarks[j].discount : 10;
                if (di <= dj) toBlack[i] = true; else toBlack[j] = true;
              }
            }
          }
          for (var k = 0; k < placemarkRefs.length; k++) {
            var pm = placemarkRefs[k];
            if (toBlack[k]) {
              pm.options.set('iconLayout', BlackDotLayout);
              pm.options.set('iconShape', { type: 'Rectangle', coordinates: [[-4, -4], [4, 4]] });
            } else {
              pm.options.set('iconLayout', CustomPinLayout);
              pm.options.set('iconShape', { type: 'Rectangle', coordinates: [[-44, -18], [44, 18]] });
            }
          }
        }
        var boundsTimer;
        map.events.add('boundschange', function() {
          if (boundsTimer) clearTimeout(boundsTimer);
          boundsTimer = setTimeout(function() { boundsTimer = null; updateBlackDots(); }, 150);
        });
        updateBlackDots();
      }
    }
    var mapEl = document.getElementById(containerId);
    if (mapEl && mapEl.previousElementSibling && mapEl.previousElementSibling.classList.contains('map-loading')) {
      mapEl.previousElementSibling.classList.add('map-loading--hidden');
    }
    return map;
  }

  // Москва: 31 отель с реальной привязкой (координаты)
  var MOSCOW_PLACEMARKS_REAL = [
    { coords: [55.758485, 37.620864], hint: 'Отель Метрополь', balloonTitle: 'Отель Метрополь', balloonBody: 'Скидка: −10%', discount: 10 },
    { coords: [55.682, 37.6176], hint: 'Palmira Business Club', balloonTitle: 'Palmira Business Club', balloonBody: 'Скидка: −20%', discount: 20 },
    { coords: [55.7477, 37.5835], hint: 'AZIMUT Сити Смоленская', balloonTitle: 'AZIMUT Сити Смоленская', balloonBody: 'Скидка: −15%', discount: 15 },
    { coords: [55.7439, 37.5652], hint: 'ibis Киевская', balloonTitle: 'ibis Москва Киевская', balloonBody: 'Скидка: −50%', discount: 50 },
    { coords: [55.782032, 37.601504], hint: 'AZIMUT Олимпик', balloonTitle: 'AZIMUT Отель Олимпик Москва', balloonBody: 'Скидка: −18%', discount: 18 },
    { coords: [55.764902, 37.604878], hint: 'Novotel Центр', balloonTitle: 'Novotel Москва Центр', balloonBody: 'Скидка: −22%', discount: 22 },
    { coords: [55.823051, 37.641144], hint: 'Космос', balloonTitle: 'Космос', balloonBody: 'Скидка: −12%', discount: 12 },
    { coords: [55.750446, 37.568341], hint: 'Украина', balloonTitle: 'Украина', balloonBody: 'Скидка: −20%', discount: 20 },
    { coords: [55.791489, 37.604878], hint: 'Холидей Инн Сущёвский', balloonTitle: 'Холидей Инн Сущёвский', balloonBody: 'Скидка: −15%', discount: 15 },
    { coords: [55.729542, 37.640654], hint: 'Ибис Павелецкая', balloonTitle: 'Ибис Павелецкая', balloonBody: 'Скидка: −10%', discount: 10 },
    { coords: [55.756993, 37.619024], hint: 'Мариотт Гранд', balloonTitle: 'Мариотт Гранд', balloonBody: 'Скидка: −28%', discount: 28 },
    { coords: [55.724, 37.624], hint: 'Park Inn Садовая', balloonTitle: 'Park Inn Садовая', balloonBody: 'Скидка: −14%', discount: 14 },
    { coords: [55.748, 37.626], hint: 'Балчуг Кемпински', balloonTitle: 'Балчуг Кемпински', balloonBody: 'Скидка: −18%', discount: 18 },
    { coords: [55.756, 37.616], hint: 'Националь', balloonTitle: 'Националь', balloonBody: 'Скидка: −22%', discount: 22 },
    { coords: [55.761, 37.576], hint: 'Золотое кольцо', balloonTitle: 'Золотое кольцо', balloonBody: 'Скидка: −12%', discount: 12 },
    { coords: [55.801, 37.532], hint: 'Аэростар', balloonTitle: 'Аэростар', balloonBody: 'Скидка: −16%', discount: 16 },
    { coords: [55.790, 37.795], hint: 'Вега Измайлово', balloonTitle: 'Вега Измайлово', balloonBody: 'Скидка: −14%', discount: 14 },
    { coords: [55.776, 37.652], hint: 'Hilton Ленинградская', balloonTitle: 'Hilton Ленинградская', balloonBody: 'Скидка: −20%', discount: 20 },
    { coords: [55.729, 37.565], hint: 'Radisson Славянская', balloonTitle: 'Radisson Славянская', balloonBody: 'Скидка: −17%', discount: 17 },
    { coords: [55.769, 37.588], hint: 'Пекин', balloonTitle: 'Пекин', balloonBody: 'Скидка: −13%', discount: 13 },
    { coords: [55.767, 37.579], hint: 'Lotte Hotel Moscow', balloonTitle: 'Lotte Hotel Moscow', balloonBody: 'Скидка: −24%', discount: 24 },
    { coords: [55.741, 37.628], hint: 'Crowne Plaza Москва', balloonTitle: 'Crowne Plaza Москва', balloonBody: 'Скидка: −15%', discount: 15 },
    { coords: [55.760, 37.605], hint: 'Шератон Палас', balloonTitle: 'Шератон Палас', balloonBody: 'Скидка: −19%', discount: 19 },
    { coords: [55.766, 37.605], hint: 'Марриотт Тверская', balloonTitle: 'Марриотт Тверская', balloonBody: 'Скидка: −21%', discount: 21 },
    { coords: [55.749, 37.541], hint: 'Novotel Москва Сити', balloonTitle: 'Novotel Москва Сити', balloonBody: 'Скидка: −18%', discount: 18 },
    { coords: [55.751, 37.534], hint: 'DoubleTree Москва Сити', balloonTitle: 'DoubleTree Москва Сити', balloonBody: 'Скидка: −16%', discount: 16 },
    { coords: [55.796, 37.508], hint: 'Ибис Бюджет Панфиловская', balloonTitle: 'Ибис Бюджет Панфиловская', balloonBody: 'Скидка: −11%', discount: 11 },
    { coords: [55.752, 37.591], hint: 'Арбат Хаятт', balloonTitle: 'Арбат Хаятт', balloonBody: 'Скидка: −23%', discount: 23 },
    { coords: [55.758, 37.615], hint: 'Савой', balloonTitle: 'Савой', balloonBody: 'Скидка: −20%', discount: 20 },
    { coords: [55.755, 37.619], hint: 'Four Seasons Москва', balloonTitle: 'Four Seasons Москва', balloonBody: 'Скидка: −28%', discount: 28 },
    { coords: [55.877, 37.425], hint: 'Холидей Инн Виноградово', balloonTitle: 'Холидей Инн Виноградово', balloonBody: 'Скидка: −12%', discount: 12 }
  ];

  // Названия для СПб/Казань (legacy)
  var MOSCOW_HOTELS = [
    'Отель Метрополь', 'Palmira Business Club', 'Four Seasons Hotel Moscow', 'The Carlton Moscow', 'Lotte Hotel Moscow',
    'Hyatt Moscow', 'St. Regis Moscow', 'Marriott Imperial Plaza', 'Рихтер', 'Mövenpick Москва', 'Page 20', 'Twelve Reasons',
    'Apeiron Space', 'Marco Polo', 'Garden Embassy', 'Arrat Park', 'DoubleTree Moscow', 'Chekhoff Moscow Curio by Hilton',
    'AZIMUT Сити Смоленская', 'ibis Москва Киевская', 'Националь', 'Балчуг', 'Савой', 'Гранд Мандарин', 'Гостиница Арбат',
    'Аквамарин', 'Амбассадори', 'Даймонд Москва-Сити', 'Ариум', 'Аэростар', 'Байкал City Hotel', 'Борис Годунов', 'Будапешт',
    'Дом на Маяковке', 'Елисеефф Арбат', 'Арбат Хаус', 'Аструс', 'Брайтон', 'Альянс Бородино', 'Апельсин',
    'Отель Пушкин', 'СтандАрт', 'Кортъярд Марриотт', 'Новотель Москва Сити', 'Холидей Инн Лесная', 'Ибис Павелецкая',
    'Парк Инн Садур', 'Азимут Отель Олимпик', 'Введенский', 'Золотой колос', 'Метрополь Панорама', 'Славянка', 'Арарат Парк Хаятт'
  ];

  // Санкт-Петербург: свои отели с привязкой к реальной геолокации (адреса в центре СПб)
  var SPB_HOTELS_GEO = [
    { name: 'Астория', coords: [59.9328, 30.3089], discount: 18 },
    { name: 'Гранд Отель Европа', coords: [59.9358, 30.3312], discount: 22 },
    { name: 'Невский Палас', coords: [59.9337, 30.3603], discount: 20 },
    { name: 'Рэдиссон Ройал', coords: [59.9340, 30.3555], discount: 25 },
    { name: 'Лотте Отель Санкт-Петербург', coords: [59.9286, 30.3102], discount: 15 },
    { name: 'Wawelberg', coords: [59.9345, 30.3505], discount: 12 },
    { name: 'AZIMUT Отель Санкт-Петербург', coords: [59.9248, 30.2922], discount: 28 },
    { name: 'Октябрьская', coords: [59.9282, 30.3608], discount: 14 },
    { name: 'Пулковская', coords: [59.8412, 30.3212], discount: 10 },
    { name: 'Хаятт Ридженси', coords: [59.9255, 30.3108], discount: 24 },
    { name: 'Ибис Центр', coords: [59.9278, 30.3585], discount: 16 },
    { name: 'Новотель Санкт-Петербург Центр', coords: [59.9325, 30.3145], discount: 19 },
    { name: 'Холидей Инн Невский', coords: [59.9348, 30.3512], discount: 21 },
    { name: 'Kravt Nevsky Hotel & Spa', coords: [59.9340, 30.3520], discount: 17 },
    { name: 'Kentron Boutique на Невском', coords: [59.9350, 30.3480], discount: 13 },
    { name: 'Бутик-отель Росси', coords: [59.9410, 30.3220], discount: 26 },
    { name: 'Отель Санкт-Петербург на Пироговской', coords: [59.9580, 30.3120], discount: 11 },
    { name: 'Мариотт Воронцовский', coords: [59.9230, 30.3180], discount: 23 },
    { name: 'Кемпински Мойка 22', coords: [59.9412, 30.3215], discount: 27 },
    { name: 'Гранд Отель Мойка 22', coords: [59.9410, 30.3220], discount: 20 },
    { name: 'Англетер', coords: [59.9340, 30.3085], discount: 18 },
    { name: 'Tsar Palace Luxury Hotel & SPA', coords: [59.9360, 30.3180], discount: 25 },
    { name: 'Ренартисс Исаакий', coords: [59.9330, 30.3080], discount: 14 },
    { name: 'Калейдоскоп GOLD на Малой Морской', coords: [59.9328, 30.3150], discount: 16 },
    { name: 'Harbor Club Hotel', coords: [59.9280, 30.3000], discount: 12 },
    { name: 'Достоевский', coords: [59.9275, 30.3480], discount: 19 },
    { name: 'Катарина Отель', coords: [59.9300, 30.3600], discount: 15 },
    { name: 'Коринтия Санкт-Петербург', coords: [59.9335, 30.3590], discount: 22 },
    { name: 'Парк Инн Прибалтийская', coords: [59.8580, 30.2180], discount: 10 },
    { name: 'Форум', coords: [59.9380, 30.3550], discount: 17 },
    { name: 'Амбассадор', coords: [59.9355, 30.3320], discount: 21 },
    { name: 'Англетер Бутик', coords: [59.9342, 30.3088], discount: 13 },
    { name: 'Арт Отель Ассамблея', coords: [59.9290, 30.3620], discount: 24 },
    { name: 'Бизнес-отель Триумф', coords: [59.9200, 30.3500], discount: 11 },
    { name: 'Комфитель Пулковская', coords: [59.8410, 30.3210], discount: 16 }
  ];

  // Казань: свои отели с привязкой к реальной геолокации
  var KAZAN_HOTELS_GEO = [
    { name: 'Korston Tower', coords: [55.7874, 49.1243], discount: 18 },
    { name: 'Гранд Отель Казань', coords: [55.7892, 49.1225], discount: 22 },
    { name: 'Ривьера', coords: [55.8012, 49.1065], discount: 20 },
    { name: 'Мираж', coords: [55.7885, 49.1210], discount: 15 },
    { name: 'Ибис Казань Центр', coords: [55.7880, 49.1150], discount: 28 },
    { name: 'Новотель Казань', coords: [55.7875, 49.1145], discount: 14 },
    { name: 'Шаляпин Палас', coords: [55.7910, 49.1220], discount: 24 },
    { name: 'Регина', coords: [55.7920, 49.1180], discount: 12 },
    { name: 'Отель Биляр Палас', coords: [55.7950, 49.1120], discount: 19 },
    { name: 'Sweet Йорт', coords: [55.7900, 49.1100], discount: 16 },
    { name: 'Rushouse', coords: [55.7890, 49.1160], discount: 10 },
    { name: 'Пилигрим', coords: [55.7860, 49.1200], discount: 13 },
    { name: 'Венера', coords: [55.7930, 49.1150], discount: 21 },
    { name: 'Park hotel', coords: [55.7940, 49.1080], discount: 17 },
    { name: 'Кристалл', coords: [55.7870, 49.1190], discount: 11 },
    { name: 'Джузеппе', coords: [55.7905, 49.1210], discount: 25 },
    { name: 'Сулейман Палас', coords: [55.7915, 49.1230], discount: 23 },
    { name: 'Республика', coords: [55.7888, 49.1170], discount: 14 },
    { name: 'Отель Казань', coords: [55.7895, 49.1165], discount: 16 },
    { name: 'Булгар', coords: [55.7935, 49.1140], discount: 20 },
    { name: 'Татарстан', coords: [55.7908, 49.1200], discount: 12 },
    { name: 'Холидей Инн', coords: [55.7872, 49.1215], discount: 26 },
    { name: 'Ривьера Отель', coords: [55.8010, 49.1068], discount: 19 },
    { name: 'Индиго', coords: [55.7898, 49.1155], discount: 15 },
    { name: 'Сафар', coords: [55.7928, 49.1175], discount: 11 },
    { name: 'Азимут', coords: [55.7865, 49.1185], discount: 27 },
    { name: 'Отель на Баумана', coords: [55.7882, 49.1235], discount: 18 },
    { name: 'Ногай', coords: [55.7912, 49.1240], discount: 14 },
    { name: 'NEO Kazan Palace by TASIGO', coords: [55.7890, 49.1220], discount: 22 },
    { name: 'Cosmos Kazan Hotel', coords: [55.7878, 49.1195], discount: 16 },
    { name: 'Ramada by Wyndham Kazan City Centre', coords: [55.7880, 49.1175], discount: 21 },
    { name: 'Capslock', coords: [55.7902, 49.1110], discount: 10 },
    { name: 'Дуслык', coords: [55.7932, 49.1160], discount: 13 },
    { name: 'Ак Барс Отель', coords: [55.7922, 49.1188], discount: 24 },
    { name: 'Ногай Палас', coords: [55.7918, 49.1235], discount: 20 },
    { name: 'Регина Палас', coords: [55.7925, 49.1185], discount: 17 }
  ];

  function geoPlacemarksToPlacemarks(geoList) {
    return geoList.map(function(h) {
      return {
        coords: h.coords,
        hint: h.name,
        balloonTitle: h.name,
        balloonBody: 'Скидка: −' + h.discount + '%',
        discount: h.discount
      };
    });
  }

  // Адреса для геокодирования через ymaps.geocode (реальные координаты с карты)
  var MOSCOW_HOTELS_ADDRESSES = [
    { name: 'Отель Метрополь', address: 'Москва, Театральный проезд, 2' },
    { name: 'Националь', address: 'Москва, Моховая улица, 15/1' },
    { name: 'The Ritz-Carlton Moscow', address: 'Москва, Тверская улица, 3' },
    { name: 'Савой', address: 'Москва, Рождественка, 3/6' },
    { name: 'St. Regis Николаевская', address: 'Москва, Никольская улица, 12' },
    { name: 'Арарат Парк Хаятт', address: 'Москва, Неглинная улица, 4' },
    { name: 'Марриотт Москва Гранд Отель', address: 'Москва, Тверская улица, 26/1' },
    { name: 'InterContinental Москва Тверская', address: 'Москва, Тверская улица, 22' },
    { name: 'Four Seasons Hotel Moscow', address: 'Москва, Охотный Ряд, 2' },
    { name: 'Palmira Business Club', address: 'Москва, ул. Воронцовская, 35' },
    { name: 'AZIMUT Сити Отель Смоленская', address: 'Москва, Смоленская площадь, 6' },
    { name: 'ibis Москва Киевская', address: 'Москва, Киевская улица, 2' },
    { name: 'Балчуг Кемпински', address: 'Москва, ул. Балчуг, 1' },
    { name: 'Лотте Отель Москва', address: 'Москва, Новинский бульвар, 8' },
    { name: 'Хаятт Ридженси Москва', address: 'Москва, ул. Новый Арбат, 36' },
    { name: 'DoubleTree by Hilton Москва', address: 'Москва, ул. Тверская, 12' },
    { name: 'Новотель Москва Сити', address: 'Москва, Пресненская набережная, 2' },
    { name: 'Ибис Павелецкая', address: 'Москва, ул. Кожевническая, 10' },
    { name: 'Холидей Инн Лесная', address: 'Москва, ул. Лесная, 15' },
    { name: 'Парк Инн Садур', address: 'Москва, ул. Юрловский проезд, 14' },
    { name: 'Гостиница Арбат', address: 'Москва, ул. Арбат, 12' },
    { name: 'Отель Арбат Хаус', address: 'Москва, ул. Арбат, 11' },
    { name: 'Амбассадор', address: 'Москва, ул. Рождественка, 5' },
    { name: 'Аэростар Отель', address: 'Москва, Ленинградский проспект, 37к9' },
    { name: 'Борис Годунов', address: 'Москва, ул. Малая Дмитровка, 4' },
    { name: 'Будапешт', address: 'Москва, ул. Петровские линии, 2' },
    { name: 'Введенский', address: 'Москва, ул. Введенского, 1' },
    { name: 'Дом на Маяковке', address: 'Москва, ул. Красносельская Верхняя, 2' },
    { name: 'Золотой колос', address: 'Москва, ул. Тверская, 12' },
    { name: 'Кортъярд Марриотт Павелецкая', address: 'Москва, ул. Кожевническая, 8' },
    { name: 'Метрополь Панорама', address: 'Москва, Театральный проезд, 1' },
    { name: 'Отель Пушкин', address: 'Москва, ул. Тверская, 26' },
    { name: 'Славянка', address: 'Москва, ул. Берзарина, 5' },
    { name: 'Азимут Отель Олимпик', address: 'Москва, Олимпийский проспект, 18/1' },
    { name: 'Аквамарин Отель', address: 'Москва, ул. Азовская, 24' },
    { name: 'Ариум Отель', address: 'Москва, ул. Сретенка, 15' },
    { name: 'Аструс Отель', address: 'Москва, ул. Петровка, 17' },
    { name: 'Байкал Сити Отель', address: 'Москва, ул. Сретенка, 2' },
    { name: 'Брайтон Отель', address: 'Москва, ул. Братиславская, 6' },
    { name: 'Гранд Отель Мандарин', address: 'Москва, ул. Тверская, 15' },
    { name: 'Даймонд Москва-Сити', address: 'Москва, Пресненская наб., 8' },
    { name: 'Елисеефф Арбат Отель', address: 'Москва, ул. Арбат, 16' },
    { name: 'Марриотт Империал Плаза', address: 'Москва, ул. Тверская, 10' },
    { name: 'Мёвенпик Москва', address: 'Москва, ул. Таганская, 17' },
    { name: 'Рихтер Отель', address: 'Москва, ул. Большая Ордынка, 72' },
    { name: 'Чехов Москва Кьюрио', address: 'Москва, ул. Малая Дмитровка, 11' },
    { name: 'Page 20 Отель', address: 'Москва, ул. Арбат, 20' },
    { name: 'Twelve Reasons', address: 'Москва, ул. Малая Бронная, 2' },
    { name: 'Radisson Славянская', address: 'Москва, Берзарина, 5' },
    { name: 'Космос', address: 'Москва, проспект Мира, 150' },
    { name: 'Украина', address: 'Москва, Кутузовский проспект, 2/1' },
    { name: 'Пекин', address: 'Москва, ул. Большая Садовая, 5' }
  ];

  var SPB_HOTELS_ADDRESSES = [
    { name: 'Астория', address: 'Санкт-Петербург, Большая Морская улица, 39' },
    { name: 'Гранд Отель Европа', address: 'Санкт-Петербург, Михайловская улица, 1/7' },
    { name: 'Лотте Отель Санкт-Петербург', address: 'Санкт-Петербург, Антоненко переулок, 2' },
    { name: 'Гранд Отель Мойка 22', address: 'Санкт-Петербург, набережная реки Мойки, 22' },
    { name: 'Англетер', address: 'Санкт-Петербург, Малая Морская улица, 24' },
    { name: 'Невский Палас', address: 'Санкт-Петербург, Невский проспект, 57' },
    { name: 'Коринтия Санкт-Петербург', address: 'Санкт-Петербург, Невский проспект, 57' },
    { name: 'Рэдиссон Ройал', address: 'Санкт-Петербург, ул. Ломоносова, 1' },
    { name: 'AZIMUT Отель Санкт-Петербург', address: 'Санкт-Петербург, Лермонтовский проспект, 43/1' },
    { name: 'Калейдоскоп GOLD Малая Морская', address: 'Санкт-Петербург, Малая Морская улица, 24' },
    { name: 'Harbor Club Hotel', address: 'Санкт-Петербург, наб. реки Мойки, 88' },
    { name: 'Kentron Boutique Невский', address: 'Санкт-Петербург, Невский проспект, 91' },
    { name: 'Kravt Nevsky Hotel', address: 'Санкт-Петербург, Невский проспект, 16' },
    { name: 'Бутик-отель Росси', address: 'Санкт-Петербург, набережная реки Фонтанки, 55' },
    { name: 'Отель Санкт-Петербург', address: 'Санкт-Петербург, Пироговская набережная, 5/2' },
    { name: 'Tsar Palace Luxury Hotel', address: 'Санкт-Петербург, ул. Миллионная, 19' },
    { name: 'Wawelberg', address: 'Санкт-Петербург, Невский проспект, 7' },
    { name: 'Ренартисс Исаакий', address: 'Санкт-Петербург, переулок Антоненко, 2' },
    { name: 'Мариотт Воронцовский', address: 'Санкт-Петербург, Воронцовский переулок, 2' },
    { name: 'Кемпински Мойка 22', address: 'Санкт-Петербург, набережная реки Мойки, 22' },
    { name: 'Пулковская', address: 'Санкт-Петербург, пл. Победы, 1' },
    { name: 'Октябрьская', address: 'Санкт-Петербург, Лиговский проспект, 10' },
    { name: 'Москва', address: 'Санкт-Петербург, пл. Александра Невского, 2' },
    { name: 'Достоевский', address: 'Санкт-Петербург, Владимирский проспект, 19' },
    { name: 'Катарина Отель', address: 'Санкт-Петербург, Невский проспект, 100' },
    { name: 'Белладжио', address: 'Санкт-Петербург, ул. Рубинштейна, 25' },
    { name: 'Парк Инн Прибалтийская', address: 'Санкт-Петербург, ул. Кораблестроителей, 14' },
    { name: 'Ибис Центр', address: 'Санкт-Петербург, Лиговский проспект, 28' },
    { name: 'Новотель Санкт-Петербург Центр', address: 'Санкт-Петербург, ул. Маяковского, 3А' },
    { name: 'Холидей Инн Невский', address: 'Санкт-Петербург, Невский проспект, 59' },
    { name: 'Хаятт Ридженси', address: 'Санкт-Петербург, ул. Марата, 82' },
    { name: 'Форум Отель', address: 'Санкт-Петербург, Итальянская улица, 35' },
    { name: 'Амбассадор', address: 'Санкт-Петербург, ул. Римского-Корсакова, 5' },
    { name: 'Европа', address: 'Санкт-Петербург, Михайловская улица, 1' },
    { name: 'Акватория', address: 'Санкт-Петербург, ул. Одоевского, 10' },
    { name: 'Россия', address: 'Санкт-Петербург, ул. Миллионная, 15' },
    { name: 'Прибалтийская', address: 'Санкт-Петербург, ул. Кораблестроителей, 14' },
    { name: 'Советская', address: 'Санкт-Петербург, Лермонтовский проспект, 43' },
    { name: 'Выборгская', address: 'Санкт-Петербург, Большой Сампсониевский проспект, 63' },
    { name: 'Ладога', address: 'Санкт-Петербург, ул. Пархоменко, 3' },
    { name: 'Звездная', address: 'Санкт-Петербург, Ленинский проспект, 239' },
    { name: 'Русь', address: 'Санкт-Петербург, ул. Артиллерийская, 1' },
    { name: 'Нева', address: 'Санкт-Петербург, ул. Чайковского, 17' },
    { name: 'Адмиралтейская', address: 'Санкт-Петербург, ул. Адмиралтейская, 12' },
    { name: 'Англетер Бутик', address: 'Санкт-Петербург, Малая Морская, 24' },
    { name: 'Арт Отель Ассамблея', address: 'Санкт-Петербург, ул. Чайковского, 34' },
    { name: 'Бизнес-отель Триумф', address: 'Санкт-Петербург, ул. Малая Морская, 13' },
    { name: 'Комфитель Пулковская', address: 'Санкт-Петербург, пл. Победы, 1' }
  ];

  var KAZAN_HOTELS_ADDRESSES = [
    { name: 'Корстон Тауэр Казань', address: 'Казань, ул. Николая Ершова, 1А' },
    { name: 'Регина', address: 'Казань, ул. Баумана, 47' },
    { name: 'Гранд Отель Казань', address: 'Казань, ул. Петербургская, 52' },
    { name: 'Ибис Казань Центр', address: 'Казань, ул. Правосудия, 1' },
    { name: 'Новотель Казань', address: 'Казань, ул. Петербургская, 52' },
    { name: 'Ривьера', address: 'Казань, ул. Фатыха Амирхана, 1' },
    { name: 'Ногай', address: 'Казань, ул. Парижской Коммуны, 8' },
    { name: 'NEO Kazan Palace', address: 'Казань, ул. Петербургская, 52' },
    { name: 'Cosmos Kazan Hotel', address: 'Казань, ул. Николая Ершова, 1' },
    { name: 'Ramada Kazan City Centre', address: 'Казань, ул. Пушкина, 4' },
    { name: 'Sweet Йорт', address: 'Казань, ул. Баумана, 35' },
    { name: 'Пилигрим', address: 'Казань, ул. Островского, 63' },
    { name: 'Отель Биляр Палас', address: 'Казань, ул. Баумана, 78' },
    { name: 'Венера', address: 'Казань, ул. Баумана, 36' },
    { name: 'Park hotel', address: 'Казань, ул. Павлюхина, 91' },
    { name: 'Регина Палас', address: 'Казань, ул. Баумана, 58' },
    { name: 'Кристалл', address: 'Казань, ул. Островского, 55' },
    { name: 'Мираж', address: 'Казань, ул. Право-Булачная, 43' },
    { name: 'Джузеппе', address: 'Казань, ул. Баумана, 44' },
    { name: 'Сулейман Палас', address: 'Казань, ул. Петербургская, 52' },
    { name: 'Шаляпин Палас', address: 'Казань, ул. Университетская, 7' },
    { name: 'Республика', address: 'Казань, ул. Пушкина, 9' },
    { name: 'Булгар', address: 'Казань, ул. Чернышевского, 15' },
    { name: 'Татарстан', address: 'Казань, ул. Пушкина, 4' },
    { name: 'Холидей Инн Казань', address: 'Казань, ул. Николая Ершова, 1' },
    { name: 'Индиго', address: 'Казань, ул. Баумана, 49' },
    { name: 'Сафар', address: 'Казань, ул. Баумана, 58' },
    { name: 'Азимут Отель Казань', address: 'Казань, ул. Право-Булачная, 43' },
    { name: 'Отель на Баумана', address: 'Казань, ул. Баумана, 58' },
    { name: 'Биляр', address: 'Казань, ул. Баумана, 27' },
    { name: 'Ак Барс', address: 'Казань, ул. Право-Булачная, 43' },
    { name: 'Ногай Палас', address: 'Казань, ул. Парижской Коммуны, 8' },
    { name: 'Колвин', address: 'Казань, ул. Островского, 55' },
    { name: 'Спутник', address: 'Казань, ул. Гагарина, 14' },
    { name: 'Волга', address: 'Казань, ул. Баумана, 9' },
    { name: 'Казанская', address: 'Казань, ул. Баумана, 64' },
    { name: 'Центральная', address: 'Казань, ул. Баумана, 50' },
    { name: 'Белая', address: 'Казань, ул. Баумана, 45' },
    { name: 'Татиана', address: 'Казань, ул. Баумана, 68' },
    { name: 'Rushouse Казань', address: 'Казань, ул. Фатыха Амирхана, 1' },
    { name: 'Capslock', address: 'Казань, ул. Баумана, 15' },
    { name: 'Амакс Сафар', address: 'Казань, ул. Баумана, 58' },
    { name: 'Ривьера Отель', address: 'Казань, ул. Фатыха Амирхана, 1' },
    { name: 'Дуслык', address: 'Казань, ул. Баумана, 72' },
    { name: 'Идель', address: 'Казань, ул. Баумана, 22' },
    { name: 'Чулпан', address: 'Казань, ул. Баумана, 38' },
    { name: 'Туган Авылым', address: 'Казань, ул. Тукая, 120' },
    { name: 'Ак Барс Отель', address: 'Казань, ул. Право-Булачная, 43' }
  ];

  var CITY_BOUNDS = {
    moscow: [[55.49, 37.37], [55.92, 37.97]],
    spb: [[59.80, 29.90], [60.08, 30.55]],
    kazan: [[55.72, 48.95], [55.87, 49.25]],
    russia: [[41, 19], [82, 180]]
  };

  /** Отели по всей РФ (реальные адреса) — для карты «Другие города РФ», точки 5px */
  var RUSSIA_HOTELS_ADDRESSES = [
    { name: 'Radisson Kaliningrad', address: 'Калининград, ул. Октябрьская, 15' },
    { name: 'Holiday Inn Kaliningrad', address: 'Калининград, Московский проспект, 106' },
    { name: 'Парк Инн Калининград', address: 'Калининград, ул. Невского, 30' },
    { name: 'Азимут Мурманск', address: 'Мурманск, ул. Ленина, 82' },
    { name: 'Парк Инн Полярные Зори', address: 'Мурманск, ул. Книповича, 17' },
    { name: 'Пур-Наволок Архангельск', address: 'Архангельск, наб. Северной Двины, 88' },
    { name: 'Двина', address: 'Архангельск, ул. Троицкий проспект, 52' },
    { name: 'Спасская Вологда', address: 'Вологда, ул. Предтеченская, 18' },
    { name: 'Граффити Вологда', address: 'Вологда, ул. Мира, 32' },
    { name: 'Ринг Премьер Ярославль', address: 'Ярославль, ул. Свободы, 55' },
    { name: 'Ибис Ярославль', address: 'Ярославль, ул. Победы, 31' },
    { name: 'Космос Ярославль', address: 'Ярославль, ул. Большая Октябрьская, 87' },
    { name: 'Оснабрюк Тверь', address: 'Тверь, ул. Советская, 61' },
    { name: 'Владимир', address: 'Владимир, ул. Большая Московская, 74' },
    { name: 'Русская деревня Владимир', address: 'Владимир, ул. Чайковского, 28' },
    { name: 'Созвездие Иваново', address: 'Иваново, ул. Красной Армии, 4' },
    { name: 'Мариотт Нижний Новгород', address: 'Нижний Новгород, ул. Октябрьская, 11' },
    { name: 'Ибис Нижний Новгород', address: 'Нижний Новгород, ул. Максима Горького, 115' },
    { name: 'Шератон Нижний Новгород', address: 'Нижний Новгород, ул. Октябрьская, 11' },
    { name: 'Октябрьская Нижний Новгород', address: 'Нижний Новгород, ул. Большая Покровская, 45' },
    { name: 'Азимут Нижний Новгород', address: 'Нижний Новгород, ул. Звездинка, 2' },
    { name: 'Хилтон Самара', address: 'Самара, ул. Антонова-Овсеенко, 59' },
    { name: 'Ибис Самара', address: 'Самара, ул. Мичурина, 131' },
    { name: 'Ренессанс Самара', address: 'Самара, ул. Некрасовская, 27' },
    { name: 'Богемия Саратов', address: 'Саратов, ул. Московская, 84' },
    { name: 'Холидей Инн Саратов', address: 'Саратов, ул. Чернышевского, 90' },
    { name: 'Волгоград', address: 'Волгоград, ул. Мира, 12' },
    { name: 'Парк Инн Волгоград', address: 'Волгоград, ул. Изобильная, 2' },
    { name: 'Венец Ульяновск', address: 'Ульяновск, ул. Гончарова, 50' },
    { name: 'Симбирск Ульяновск', address: 'Ульяновск, ул. Ленина, 100' },
    { name: 'Дон Плаза Ростов', address: 'Ростов-на-Дону, ул. Большая Садовая, 115' },
    { name: 'Парк Инн Ростов', address: 'Ростов-на-Дону, ул. Красноармейская, 170' },
    { name: 'Мариотт Ростов', address: 'Ростов-на-Дону, ул. Большая Садовая, 115' },
    { name: 'Парк Инн Краснодар', address: 'Краснодар, ул. Красная, 109' },
    { name: 'Мариотт Краснодар', address: 'Краснодар, ул. Красная, 109' },
    { name: 'Ибис Краснодар', address: 'Краснодар, ул. Ставропольская, 204' },
    { name: 'Рэдиссон Сочи', address: 'Сочи, ул. Орджоникидзе, 11' },
    { name: 'Мариотт Сочи', address: 'Сочи, ул. Орджоникидзе, 11' },
    { name: 'Меркюр Сочи', address: 'Сочи, ул. Виноградная, 12' },
    { name: 'Сочи Плаза', address: 'Сочи, ул. Навагинская, 22' },
    { name: 'Родина Сочи', address: 'Сочи, ул. Виноградная, 14' },
    { name: 'Нарзан Минеральные Воды', address: 'Минеральные Воды, ул. Советская, 25' },
    { name: 'Грозный Сити', address: 'Грозный, проспект Ахмата Кадырова, 2' },
    { name: 'Мариотт Екатеринбург', address: 'Екатеринбург, ул. Бориса Ельцина, 8' },
    { name: 'Парк Инн Екатеринбург', address: 'Екатеринбург, ул. Мамина-Сибиряка, 98' },
    { name: 'Новотел Екатеринбург', address: 'Екатеринбург, ул. Энгельса, 7' },
    { name: 'Хаятт Екатеринбург', address: 'Екатеринбург, ул. Бориса Ельцина, 8' },
    { name: 'Онегин Екатеринбург', address: 'Екатеринбург, ул. Красноармейская, 72' },
    { name: 'Парк Сити Челябинск', address: 'Челябинск, ул. Лесопарковая, 6' },
    { name: 'Малахит Челябинск', address: 'Челябинск, ул. Труда, 153' },
    { name: 'Рэдиссон Челябинск', address: 'Челябинск, ул. Ворошилова, 2' },
    { name: 'Урал Пермь', address: 'Пермь, ул. Ленина, 58' },
    { name: 'Авиатур Пермь', address: 'Пермь, ул. Советской Армии, 66' },
    { name: 'Ремезов Тюмень', address: 'Тюмень, ул. Республики, 251' },
    { name: 'Восток Тюмень', address: 'Тюмень, ул. Республики, 159' },
    { name: 'Башкирия Уфа', address: 'Уфа, ул. Революционная, 25' },
    { name: 'Хилтон Уфа', address: 'Уфа, ул. Ленина, 9' },
    { name: 'Президент Уфа', address: 'Уфа, ул. Коммунистическая, 16' },
    { name: 'Оренбург', address: 'Оренбург, ул. Советская, 27' },
    { name: 'Металлург Магнитогорск', address: 'Магнитогорск, ул. Ленина, 69' },
    { name: 'Мариотт Новосибирск', address: 'Новосибирск, ул. Каинская, 7' },
    { name: 'Парк Инн Новосибирск', address: 'Новосибирск, ул. Дмитрия Донского, 1' },
    { name: 'Ибис Новосибирск', address: 'Новосибирск, ул. Красный проспект, 25' },
    { name: 'Центральная Новосибирск', address: 'Новосибирск, ул. Ленина, 3' },
    { name: 'Новосибирск отель', address: 'Новосибирск, ул. Сибирская, 35' },
    { name: 'Ибис Омск', address: 'Омск, ул. Фрунзе, 80' },
    { name: 'Маяк Омск', address: 'Омск, ул. Ленина, 6' },
    { name: 'Магистрат Томск', address: 'Томск, пл. Ленина, 15' },
    { name: 'Сибирь Томск', address: 'Томск, пр. Кирова, 65' },
    { name: 'Новотел Красноярск', address: 'Красноярск, ул. Взлётная, 15' },
    { name: 'Ибис Красноярск', address: 'Красноярск, ул. Маерчака, 53' },
    { name: 'Октябрьская Красноярск', address: 'Красноярск, пр. Мира, 15' },
    { name: 'Красноярск отель', address: 'Красноярск, ул. Урицкого, 94' },
    { name: 'Мариотт Иркутск', address: 'Иркутск, ул. Свердлова, 29' },
    { name: 'Кортъярд Иркутск', address: 'Иркутск, ул. Чкалова, 15' },
    { name: 'Ангара Иркутск', address: 'Иркутск, ул. Сухэ-Батора, 7' },
    { name: 'Байкал Бизнес Центр', address: 'Иркутск, ул. Байкальская, 279' },
    { name: 'Алтай Барнаул', address: 'Барнаул, пр. Ленина, 24' },
    { name: 'Сибирь Барнаул', address: 'Барнаул, ул. Анатолия, 136' },
    { name: 'Кузбасс Кемерово', address: 'Кемерово, пр. Советский, 56' },
    { name: 'Томь Кемерово', address: 'Кемерово, ул. Ноградская, 1' },
    { name: 'Новокузнецкая', address: 'Новокузнецк, ул. Кирова, 56' },
    { name: 'Хакасия Абакан', address: 'Абакан, ул. Пушкина, 78' },
    { name: 'Хёндэ Владивосток', address: 'Владивосток, ул. Семёновская, 29' },
    { name: 'Азимут Владивосток', address: 'Владивосток, ул. Набережная, 10' },
    { name: 'Экватор Владивосток', address: 'Владивосток, ул. Набережная, 20' },
    { name: 'Версаль Владивосток', address: 'Владивосток, ул. Светланская, 10' },
    { name: 'Приморье Владивосток', address: 'Владивосток, ул. Пограничная, 6' },
    { name: 'Парус Хабаровск', address: 'Хабаровск, ул. Амурский бульвар, 2' },
    { name: 'Ибис Хабаровск', address: 'Хабаровск, ул. Воронежская, 25' },
    { name: 'Амур Хабаровск', address: 'Хабаровск, ул. Ленина, 29' },
    { name: 'Саппоро Хабаровск', address: 'Хабаровск, ул. Ленина, 64' },
    { name: 'Лена Якутск', address: 'Якутск, пр. Ленина, 24' },
    { name: 'Полярная звезда Якутск', address: 'Якутск, ул. Орджоникидзе, 24' },
    { name: 'Амур Благовещенск', address: 'Благовещенск, ул. Ленина, 133' },
    { name: 'Юг Благовещенск', address: 'Благовещенск, ул. Шевченко, 2' },
    { name: 'Авача Петропавловск-Камчатский', address: 'Петропавловск-Камчатский, пр. Карла Маркса, 31' },
    { name: 'Гейзер Петропавловск-Камчатский', address: 'Петропавловск-Камчатский, ул. Топоркова, 10' },
    { name: 'Мега Палас Южно-Сахалинск', address: 'Южно-Сахалинск, ул. Ленина, 220' },
    { name: 'Санта Ризорт Южно-Сахалинск', address: 'Южно-Сахалинск, ул. Дзержинского, 34' },
    { name: 'Находка отель', address: 'Находка, ул. Находкинский проспект, 14' },
    { name: 'Амур Комсомольск', address: 'Комсомольск-на-Амуре, пр. Ленина, 27' },
    { name: 'Турист Курган', address: 'Курган, ул. Гоголя, 49' },
    { name: 'Волна Смоленск', address: 'Смоленск, ул. Конёнкова, 2' },
    { name: 'Россия Смоленск', address: 'Смоленск, ул. Дзержинского, 23' },
    { name: 'Центральная Тула', address: 'Тула, пр. Ленина, 96' },
    { name: 'Скиф Рязань', address: 'Рязань, Первомайский проспект, 55' },
    { name: 'Ока Рязань', address: 'Рязань, ул. Есенина, 42' },
    { name: 'Плес Кострома', address: 'Кострома, ул. Советская, 2' },
    { name: 'Волга Кострома', address: 'Кострома, ул. Юрия Смирнова, 19' },
    { name: 'Центральная Липецк', address: 'Липецк, ул. Зегеля, 1' },
    { name: 'Металлург Липецк', address: 'Липецк, пл. Металлургов, 2' },
    { name: 'Воронеж', address: 'Воронеж, пр. Революции, 43' },
    { name: 'Дегас Воронеж', address: 'Воронеж, ул. Никитинская, 42' },
    { name: 'Парк Отель Тамбов', address: 'Тамбов, ул. Советская, 108' },
    { name: 'Гранд Отель Пенза', address: 'Пенза, ул. Московская, 96' },
    { name: 'Холидей Инн Саранск', address: 'Саранск, ул. Советская, 109' },
    { name: 'Меридиан Чебоксары', address: 'Чебоксары, пр. Ленина, 21' },
    { name: 'Конгресс Отель Чебоксары', address: 'Чебоксары, ул. К. Иванова, 74' },
    { name: 'Татарстан Йошкар-Ола', address: 'Йошкар-Ола, Ленинский проспект, 30' },
    { name: 'Ласточка Ижевск', address: 'Ижевск, ул. Пушкинская, 214' },
    { name: 'Парк Инн Ижевск', address: 'Ижевск, ул. Удмуртская, 167' },
    { name: 'Алтай Бизнес Горно-Алтайск', address: 'Горно-Алтайск, пр. Коммунистический, 69' },
    { name: 'Байкал Плаза Улан-Удэ', address: 'Улан-Удэ, ул. Ербанова, 12' },
    { name: 'Гэсэр Улан-Удэ', address: 'Улан-Удэ, ул. Революции 1905 года, 19' },
    { name: 'Визит Чита', address: 'Чита, ул. Ленина, 55' },
    { name: 'Арктика Салехард', address: 'Салехард, ул. Республики, 38' },
    { name: 'Обь Новый Уренгой', address: 'Новый Уренгой, ул. Мира, 1' },
    { name: 'Сибирь Сургут', address: 'Сургут, ул. Энергетиков, 44' },
    { name: 'Олимпия Нижневартовск', address: 'Нижневартовск, ул. Мира, 23' },
    { name: 'Калининград Скандинавия', address: 'Калининград, ул. 9 Апреля, 20' },
    { name: 'Чайка Калининград', address: 'Калининград, ул. Сергеева, 12' },
    { name: 'Мурманск отель', address: 'Мурманск, пр. Ленина, 82' },
    { name: 'Арктика Мурманск', address: 'Мурманск, ул. Книповича, 17' },
    { name: 'Соломбала Архангельск', address: 'Архангельск, ул. Троицкий проспект, 52' },
    { name: 'Беломорская Архангельск', address: 'Архангельск, ул. Попова, 12' },
    { name: 'Вологда отель', address: 'Вологда, ул. Мира, 32' },
    { name: 'Ярославль Центр', address: 'Ярославль, ул. Республиканская, 56' },
    { name: 'Юбилейная Ярославль', address: 'Ярославль, Которосльная наб., 26' },
    { name: 'Тверь отель', address: 'Тверь, ул. Желябова, 2' },
    { name: 'Заря Владимир', address: 'Владимир, ул. Студёная Гора, 36' },
    { name: 'Иваново Гранд', address: 'Иваново, ул. Красной Армии, 4' },
    { name: 'Азимут Нижний 2', address: 'Нижний Новгород, ул. Родионова, 187' },
    { name: 'Волна Нижний Новгород', address: 'Нижний Новгород, ул. Рождественская, 18' },
    { name: 'Ока Нижний Новгород', address: 'Нижний Новгород, ул. Гагарина, 27' },
    { name: 'Самара Бизнес', address: 'Самара, ул. Мичурина, 131' },
    { name: 'Лада Самара', address: 'Самара, ул. Ленинградская, 86' },
    { name: 'Саратов Центр', address: 'Саратов, ул. Московская, 84' },
    { name: 'Волгоград Парк', address: 'Волгоград, ул. Комсомольская, 11' },
    { name: 'Ульяновск Центр', address: 'Ульяновск, ул. Гончарова, 50' },
    { name: 'Ростов Центр', address: 'Ростов-на-Дону, ул. Красноармейская, 170' },
    { name: 'Краснодар Центр', address: 'Краснодар, ул. Красная, 109' },
    { name: 'Сочи Маринс', address: 'Сочи, ул. Орджоникидзе, 11' },
    { name: 'Жемчужина Сочи', address: 'Сочи, ул. Черноморская, 3' },
    { name: 'Пик Сочи', address: 'Сочи, ул. Виноградная, 14' },
    { name: 'Екатеринбург Центр', address: 'Екатеринбург, ул. Малышева, 74' },
    { name: 'Большой Урал Екатеринбург', address: 'Екатеринбург, ул. Красноармейская, 72' },
    { name: 'Челябинск Центр', address: 'Челябинск, ул. Ворошилова, 2' },
    { name: 'Пермь Центр', address: 'Пермь, ул. Ленина, 58' },
    { name: 'Тюмень Центр', address: 'Тюмень, ул. Республики, 159' },
    { name: 'Уфа Центр', address: 'Уфа, ул. Революционная, 25' },
    { name: 'Новосибирск Сибирь', address: 'Новосибирск, ул. Сибирская, 35' },
    { name: 'Омск Форум', address: 'Омск, ул. Фрунзе, 80' },
    { name: 'Томск Европа', address: 'Томск, пр. Кирова, 65' },
    { name: 'Красноярск Сибирь', address: 'Красноярск, пр. Мира, 15' },
    { name: 'Иркутск Байкал', address: 'Иркутск, ул. Байкальская, 279' },
    { name: 'Барнаул Центр', address: 'Барнаул, пр. Ленина, 24' },
    { name: 'Кемерово Центр', address: 'Кемерово, пр. Советский, 56' },
    { name: 'Владивосток Центр', address: 'Владивосток, ул. Светланская, 10' },
    { name: 'Хабаровск Центр', address: 'Хабаровск, ул. Ленина, 29' },
    { name: 'Якутск Центр', address: 'Якутск, пр. Ленина, 24' },
    { name: 'Благовещенск отель', address: 'Благовещенск, ул. Ленина, 133' },
    { name: 'Петропавловск отель', address: 'Петропавловск-Камчатский, пр. Карла Маркса, 31' },
    { name: 'Южно-Сахалинск отель', address: 'Южно-Сахалинск, ул. Ленина, 220' },
    { name: 'Смоленск Центр', address: 'Смоленск, ул. Дзержинского, 23' },
    { name: 'Тула Центр', address: 'Тула, пр. Ленина, 96' },
    { name: 'Рязань Центр', address: 'Рязань, Первомайский проспект, 55' },
    { name: 'Кострома Центр', address: 'Кострома, ул. Советская, 2' },
    { name: 'Липецк Центр', address: 'Липецк, ул. Зегеля, 1' },
    { name: 'Воронеж Центр', address: 'Воронеж, пр. Революции, 43' },
    { name: 'Тамбов Центр', address: 'Тамбов, ул. Советская, 108' },
    { name: 'Пенза Центр', address: 'Пенза, ул. Московская, 96' },
    { name: 'Саранск Центр', address: 'Саранск, ул. Советская, 109' },
    { name: 'Чебоксары Центр', address: 'Чебоксары, пр. Ленина, 21' },
    { name: 'Ижевск Центр', address: 'Ижевск, ул. Пушкинская, 214' },
    { name: 'Улан-Удэ Центр', address: 'Улан-Удэ, ул. Ербанова, 12' },
    { name: 'Чита Центр', address: 'Чита, ул. Ленина, 55' },
    { name: 'Сургут Центр', address: 'Сургут, ул. Энергетиков, 44' },
    { name: 'Нижневартовск Центр', address: 'Нижневартовск, ул. Мира, 23' },
    { name: 'Новый Уренгой Центр', address: 'Новый Уренгой, ул. Мира, 1' },
    { name: 'Салехард Центр', address: 'Салехард, ул. Республики, 38' },
    { name: 'Магнитогорск Центр', address: 'Магнитогорск, ул. Ленина, 69' },
    { name: 'Курган Центр', address: 'Курган, ул. Гоголя, 49' },
    { name: 'Оренбург Центр', address: 'Оренбург, ул. Советская, 27' },
    { name: 'Абакан Центр', address: 'Абакан, ул. Пушкина, 78' },
    { name: 'Новокузнецк Центр', address: 'Новокузнецк, ул. Кирова, 56' },
    { name: 'Комсомольск Центр', address: 'Комсомольск-на-Амуре, пр. Ленина, 27' },
    { name: 'Находка Центр', address: 'Находка, Находкинский проспект, 14' },
    { name: 'Горно-Алтайск Центр', address: 'Горно-Алтайск, пр. Коммунистический, 69' },
    { name: 'Йошкар-Ола Центр', address: 'Йошкар-Ола, Ленинский проспект, 30' },
    { name: 'Минеральные Воды Центр', address: 'Минеральные Воды, ул. Советская, 25' },
    { name: 'Пятигорск Плаза', address: 'Пятигорск, ул. Кирова, 28' },
    { name: 'Кисловодск Нарзан', address: 'Кисловодск, пр. Мира, 17' },
    { name: 'Ессентуки Виктория', address: 'Ессентуки, ул. Пятигорская, 22' },
    { name: 'Ставрополь Интурист', address: 'Ставрополь, пр. Карла Маркса, 42' },
    { name: 'Махачкала Ленинград', address: 'Махачкала, пр. Расула Гамзатова, 43' },
    { name: 'Владикавказ Империал', address: 'Владикавказ, пр. Мира, 19' },
    { name: 'Нальчик Терек', address: 'Нальчик, пр. Ленина, 58' },
    { name: 'Черкесск отель', address: 'Черкесск, ул. Ленина, 33' },
    { name: 'Элиста отель', address: 'Элиста, ул. Ленина, 241' },
    { name: 'Астрахань Парк Инн', address: 'Астрахань, ул. Никольская, 4' },
    { name: 'Волгоград Хилтон', address: 'Волгоград, ул. Рабоче-Крестьянская, 18' },
    { name: 'Тольятти Парус', address: 'Тольятти, ул. Революционная, 80' },
    { name: 'Саратов Волга', address: 'Саратов, наб. Космонавтов, 5' },
    { name: 'Энгельс отель', address: 'Энгельс, ул. Тельмана, 7' },
    { name: 'Пенза Пилигрим', address: 'Пенза, ул. Кирова, 69' },
    { name: 'Ульяновск Гостиный', address: 'Ульяновск, ул. Гончарова, 50' },
    { name: 'Димитровград отель', address: 'Димитровград, ул. Куйбышева, 232' },
    { name: 'Саранск Меридиан', address: 'Саранск, ул. Советская, 109' },
    { name: 'Чебоксары Конгресс', address: 'Чебоксары, ул. К. Иванова, 74' },
    { name: 'Йошкар-Ола Татарстан', address: 'Йошкар-Ола, Ленинский проспект, 30' },
    { name: 'Ижевск Парк Инн', address: 'Ижевск, ул. Удмуртская, 167' },
    { name: 'Набережные Челны Гранд', address: 'Набережные Челны, пр. Мира, 52' },
    { name: 'Альметьевск отель', address: 'Альметьевск, ул. Ленина, 98' },
    { name: 'Нижнекамск отель', address: 'Нижнекамск, пр. Химиков, 31' },
    { name: 'Орск отель', address: 'Орск, пр. Ленина, 45' },
    { name: 'Бузулук отель', address: 'Бузулук, ул. Ленина, 63' },
    { name: 'Стерлитамак отель', address: 'Стерлитамак, пр. Октября, 18' },
    { name: 'Салават отель', address: 'Салават, ул. Ленина, 18' },
    { name: 'Нефтекамск отель', address: 'Нефтекамск, ул. Ленина, 84' },
    { name: 'Златоуст отель', address: 'Златоуст, ул. Ленина, 2' },
    { name: 'Миасс отель', address: 'Миасс, пр. Автозаводцев, 21' },
    { name: 'Копейск отель', address: 'Копейск, ул. Ленина, 52' },
    { name: 'Нижний Тагил отель', address: 'Нижний Тагил, пр. Ленина, 33' },
    { name: 'Каменск-Уральский отель', address: 'Каменск-Уральский, ул. Ленина, 36' },
    { name: 'Серов отель', address: 'Серов, ул. Ленина, 83' },
    { name: 'Невьянск отель', address: 'Невьянск, ул. Ленина, 15' },
    { name: 'Березники отель', address: 'Березники, пр. Ленина, 43' },
    { name: 'Соликамск отель', address: 'Соликамск, ул. 20-летия Победы, 88' },
    { name: 'Кудымкар отель', address: 'Кудымкар, ул. Лихачёва, 54' },
    { name: 'Тобольск отель', address: 'Тобольск, ул. Р. Люксембург, 38' },
    { name: 'Ишим отель', address: 'Ишим, ул. Ленина, 62' },
    { name: 'Сургут Нефтяник', address: 'Сургут, ул. Энергетиков, 44' },
    { name: 'Нижневартовск Самотлор', address: 'Нижневартовск, ул. Мира, 23' },
    { name: 'Когалым отель', address: 'Когалым, ул. Дружбы Народов, 40' },
    { name: 'Ноябрьск отель', address: 'Ноябрьск, ул. Ленина, 28' },
    { name: 'Новый Уренгой Ямбург', address: 'Новый Уренгой, ул. Мира, 1' },
    { name: 'Салехард Ямал', address: 'Салехард, ул. Республики, 38' },
    { name: 'Надым отель', address: 'Надым, ул. Зверева, 9' },
    { name: 'Лабытнанги отель', address: 'Лабытнанги, ул. Свободы, 15' },
    { name: 'Нарьян-Мар отель', address: 'Нарьян-Мар, ул. Смидовича, 20' },
    { name: 'Воркута отель', address: 'Воркута, ул. Ленина, 38' },
    { name: 'Ухта отель', address: 'Ухта, ул. Мира, 5' },
    { name: 'Сыктывкар отель', address: 'Сыктывкар, ул. Коммунистическая, 67' },
    { name: 'Великий Новгород отель', address: 'Великий Новгород, ул. Большая Московская, 16' },
    { name: 'Псков отель', address: 'Псков, ул. Р. Люксембург, 1' },
    { name: 'Петрозаводск отель', address: 'Петрозаводск, ул. Ленина, 26' },
    { name: 'Вологда Атриум', address: 'Вологда, ул. Мира, 32' },
    { name: 'Череповец отель', address: 'Череповец, Советский проспект, 39' },
    { name: 'Рыбинск отель', address: 'Рыбинск, ул. Крестовая, 69' },
    { name: 'Кострома Волга', address: 'Кострома, ул. Юрия Смирнова, 19' },
    { name: 'Иваново Текстиль', address: 'Иваново, ул. Красной Армии, 4' },
    { name: 'Шуя отель', address: 'Шуя, ул. Ленина, 2' },
    { name: 'Кинешма отель', address: 'Кинешма, ул. Ленина, 26' },
    { name: 'Брянск отель', address: 'Брянск, пр. Ленина, 83' },
    { name: 'Орёл отель', address: 'Орёл, ул. Ленина, 17' },
    { name: 'Курск отель', address: 'Курск, ул. Ленина, 2' },
    { name: 'Белгород отель', address: 'Белгород, ул. Народная, 76' },
    { name: 'Тамбов Гранд', address: 'Тамбов, ул. Советская, 108' },
    { name: 'Мичуринск отель', address: 'Мичуринск, ул. Советская, 298' },
    { name: 'Елец отель', address: 'Елец, ул. Мира, 95' },
    { name: 'Курск Центр', address: 'Курск, ул. Ленина, 2' },
    { name: 'Белгород Континенталь', address: 'Белгород, ул. Народная, 76' },
    { name: 'Старый Оскол отель', address: 'Старый Оскол, ул. Ленина, 22' },
    { name: 'Воронеж Дегас', address: 'Воронеж, ул. Никитинская, 42' },
    { name: 'Липецк Металлург', address: 'Липецк, пл. Металлургов, 2' },
    { name: 'Тамбов Державинский', address: 'Тамбов, ул. Советская, 108' },
    { name: 'Пенза Гранд', address: 'Пенза, ул. Московская, 96' },
    { name: 'Кузнецк отель', address: 'Кузнецк, ул. Ленина, 247' },
    { name: 'Саранск Русь', address: 'Саранск, ул. Советская, 109' },
    { name: 'Рязань Ловеч', address: 'Рязань, ул. Есенина, 42' },
    { name: 'Калуга отель', address: 'Калуга, ул. Кирова, 1' },
    { name: 'Обнинск отель', address: 'Обнинск, пр. Ленина, 126' },
    { name: 'Тула Престиж', address: 'Тула, пр. Ленина, 96' },
    { name: 'Орёл Гранд', address: 'Орёл, ул. Ленина, 17' },
    { name: 'Брянск Десна', address: 'Брянск, пр. Ленина, 83' },
    { name: 'Смоленск Россия', address: 'Смоленск, ул. Дзержинского, 23' },
    { name: 'Великие Луки отель', address: 'Великие Луки, ул. Пушкина, 12' },
    { name: 'Тверь Оснабрюк', address: 'Тверь, ул. Советская, 61' },
    { name: 'Вышний Волочёк отель', address: 'Вышний Волочёк, ул. Осташковская, 3' },
    { name: 'Белозерск отель', address: 'Белозерск, ул. Советский проспект, 43' },
    { name: 'Кириллов отель', address: 'Кириллов, ул. Гагарина, 103' },
    { name: 'Великий Устюг отель', address: 'Великий Устюг, ул. Красная, 97' },
    { name: 'Череповец Северсталь', address: 'Череповец, Советский проспект, 39' },
    { name: 'Вологда Спасская', address: 'Вологда, ул. Предтеченская, 18' },
    { name: 'Ярославль Ибис', address: 'Ярославль, ул. Победы, 31' },
    { name: 'Рыбинск Бурлак', address: 'Рыбинск, ул. Крестовая, 69' },
    { name: 'Переславль отель', address: 'Переславль-Залесский, ул. Ростовская, 27' },
    { name: 'Углич отель', address: 'Углич, ул. Революционная, 14' },
    { name: 'Ростов Великий отель', address: 'Ростов, ул. Ленина, 3' },
    { name: 'Кострома Плес', address: 'Кострома, ул. Советская, 2' },
    { name: 'Владимир Заря', address: 'Владимир, ул. Студёная Гора, 36' },
    { name: 'Суздаль отель', address: 'Суздаль, ул. Кремлёвская, 20' },
    { name: 'Гусь-Хрустальный отель', address: 'Гусь-Хрустальный, ул. Калинина, 2' },
    { name: 'Ковров отель', address: 'Ковров, ул. Дегтярёва, 18' },
    { name: 'Муром отель', address: 'Муром, ул. Ленина, 24' },
    { name: 'Нижний Новгород Волна', address: 'Нижний Новгород, ул. Рождественская, 18' },
    { name: 'Дзержинск отель', address: 'Дзержинск, пр. Ленина, 53' },
    { name: 'Арзамас отель', address: 'Арзамас, ул. Ленина, 11' },
    { name: 'Саров отель', address: 'Саров, пр. Ленина, 27' },
    { name: 'Кстово отель', address: 'Кстово, ул. Зеленая, 2' },
    { name: 'Бор отель', address: 'Бор, ул. Ленина, 90' },
    { name: 'Самара Лада', address: 'Самара, ул. Ленинградская, 86' },
    { name: 'Тольятти Виктория', address: 'Тольятти, ул. Революционная, 80' },
    { name: 'Сызрань отель', address: 'Сызрань, ул. Советская, 66' },
    { name: 'Чапаевск отель', address: 'Чапаевск, ул. Ленина, 1' },
    { name: 'Отрадный отель', address: 'Отрадный, ул. Первомайская, 31' },
    { name: 'Жигулёвск отель', address: 'Жигулёвск, ул. Мира, 5' },
    { name: 'Саратов Богемия', address: 'Саратов, ул. Московская, 84' },
    { name: 'Балаково отель', address: 'Балаково, ул. Трнавская, 2' },
    { name: 'Вольск отель', address: 'Вольск, ул. Революционная, 75' },
    { name: 'Пугачёв отель', address: 'Пугачёв, ул. Топоркова, 68' },
    { name: 'Волгоград Волгоград', address: 'Волгоград, ул. Мира, 12' },
    { name: 'Волжский отель', address: 'Волжский, пр. Ленина, 72' },
    { name: 'Камышин отель', address: 'Камышин, ул. Ленина, 14' },
    { name: 'Ульяновск Венец', address: 'Ульяновск, ул. Гончарова, 50' },
    { name: 'Димитровград Авиа', address: 'Димитровград, ул. Куйбышева, 232' },
    { name: 'Инза отель', address: 'Инза, ул. Ленина, 42' },
    { name: 'Ростов Дон Плаза', address: 'Ростов-на-Дону, ул. Большая Садовая, 115' },
    { name: 'Таганрог отель', address: 'Таганрог, ул. Петровская, 73' },
    { name: 'Новочеркасск отель', address: 'Новочеркасск, пр. Платовский, 80' },
    { name: 'Батайск отель', address: 'Батайск, ул. Луначарского, 114' },
    { name: 'Шахты отель', address: 'Шахты, пр. Карла Маркса, 95' },
    { name: 'Волгодонск отель', address: 'Волгодонск, ул. Ленина, 93' },
    { name: 'Новороссийск отель', address: 'Новороссийск, ул. Советов, 40' },
    { name: 'Армавир отель', address: 'Армавир, ул. Ленина, 91' },
    { name: 'Сочи Жемчужина', address: 'Сочи, ул. Черноморская, 3' },
    { name: 'Адлер отель', address: 'Адлер, ул. Кирова, 54' },
    { name: 'Лазаревское отель', address: 'Лазаревское, ул. Победы, 96' },
    { name: 'Геленджик отель', address: 'Геленджик, ул. Островского, 125' },
    { name: 'Анапа отель', address: 'Анапа, ул. Крымская, 125' },
    { name: 'Туапсе отель', address: 'Туапсе, ул. Карла Маркса, 7' },
    { name: 'Ейск отель', address: 'Ейск, ул. Свердлова, 67' },
    { name: 'Кропоткин отель', address: 'Кропоткин, ул. Красная, 176' },
    { name: 'Тимашёвск отель', address: 'Тимашёвск, ул. Ленина, 132' },
    { name: 'Славянск-на-Кубани отель', address: 'Славянск-на-Кубани, ул. Кубанская, 213' },
    { name: 'Екатеринбург Онегин', address: 'Екатеринбург, ул. Красноармейская, 72' },
    { name: 'Первоуральск отель', address: 'Первоуральск, ул. Ватутина, 41' },
    { name: 'Ревда отель', address: 'Ревда, ул. Циолковского, 29' },
    { name: 'Полевской отель', address: 'Полевской, ул. Ильича, 31' },
    { name: 'Краснотурьинск отель', address: 'Краснотурьинск, ул. Ленина, 59' },
    { name: 'Асбест отель', address: 'Асбест, ул. Ленина, 40' },
    { name: 'Реж отель', address: 'Реж, ул. Ленина, 38' },
    { name: 'Верхняя Пышма отель', address: 'Верхняя Пышма, ул. Уральских рабочих, 2' },
    { name: 'Троицк Челябинск отель', address: 'Троицк, ул. Гагарина, 15' },
    { name: 'Златоуст Малахит', address: 'Златоуст, ул. Ленина, 2' },
    { name: 'Сатка отель', address: 'Сатка, ул. Ленина, 8' },
    { name: 'Озёрск отель', address: 'Озёрск, пр. Ленина, 30' },
    { name: 'Снежинск отель', address: 'Снежинск, ул. Васильева, 13' },
    { name: 'Трехгорный отель', address: 'Трёхгорный, ул. Мира, 17' },
    { name: 'Пермь Урал', address: 'Пермь, ул. Ленина, 58' },
    { name: 'Кунгур отель', address: 'Кунгур, ул. Ленина, 38' },
    { name: 'Лысьва отель', address: 'Лысьва, ул. Революции, 23' },
    { name: 'Чайковский отель', address: 'Чайковский, ул. Ленина, 53' },
    { name: 'Краснокамск отель', address: 'Краснокамск, ул. Карла Маркса, 8' },
    { name: 'Тюмень Ремезов', address: 'Тюмень, ул. Республики, 251' },
    { name: 'Заводоуковск отель', address: 'Заводоуковск, ул. Ленина, 22' },
    { name: 'Ялуторовск отель', address: 'Ялуторовск, ул. Ленина, 45' },
    { name: 'Ханты-Мансийск отель', address: 'Ханты-Мансийск, ул. Мира, 14' },
    { name: 'Нефтеюганск отель', address: 'Нефтеюганск, ул. Ленина, 25' },
    { name: 'Мегион отель', address: 'Мегион, ул. Заводская, 7' },
    { name: 'Лангепас отель', address: 'Лангепас, ул. Ленина, 28' },
    { name: 'Радужный отель', address: 'Радужный, ул. Мира, 12' },
    { name: 'Урай отель', address: 'Урай, ул. Ленина, 75' },
    { name: 'Новосибирск Мариотт', address: 'Новосибирск, ул. Каинская, 7' },
    { name: 'Бердск отель', address: 'Бердск, ул. Ленина, 89' },
    { name: 'Искитим отель', address: 'Искитим, ул. Коротеева, 62' },
    { name: 'Куйбышев отель', address: 'Куйбышев, ул. Ленина, 27' },
    { name: 'Барабинск отель', address: 'Барабинск, ул. Ленина, 33' },
    { name: 'Омск Ибис', address: 'Омск, ул. Фрунзе, 80' },
    { name: 'Тара отель', address: 'Тара, ул. Ленина, 14' },
    { name: 'Тюкалинск отель', address: 'Тюкалинск, ул. Ленина, 52' },
    { name: 'Томск Магистрат', address: 'Томск, пл. Ленина, 15' },
    { name: 'Северск отель', address: 'Северск, пр. Коммунистический, 45' },
    { name: 'Колпашево отель', address: 'Колпашево, ул. Ленина, 38' },
    { name: 'Асино отель', address: 'Асино, ул. Ленина, 56' },
    { name: 'Стрежевой отель', address: 'Стрежевой, ул. Мира, 18' },
    { name: 'Красноярск Новотел', address: 'Красноярск, ул. Взлётная, 15' },
    { name: 'Норильск отель', address: 'Норильск, ул. Ленинский проспект, 3' },
    { name: 'Ачинск отель', address: 'Ачинск, ул. Ленина, 42' },
    { name: 'Канск отель', address: 'Канск, ул. Ленина, 38' },
    { name: 'Лесосибирск отель', address: 'Лесосибирск, ул. Ленина, 22' },
    { name: 'Минусинск отель', address: 'Минусинск, ул. Ленина, 78' },
    { name: 'Иркутск Мариотт', address: 'Иркутск, ул. Свердлова, 29' },
    { name: 'Ангарск отель', address: 'Ангарск, ул. Ленина, 14' },
    { name: 'Усолье-Сибирское отель', address: 'Усолье-Сибирское, ул. Ленина, 42' },
    { name: 'Братск отель', address: 'Братск, ул. Мира, 35' },
    { name: 'Усть-Илимск отель', address: 'Усть-Илимск, ул. Ленина, 68' },
    { name: 'Усть-Кут отель', address: 'Усть-Кут, ул. Кирова, 42' },
    { name: 'Байкальск отель', address: 'Байкальск, ул. Ленина, 2' },
    { name: 'Слюдянка отель', address: 'Слюдянка, ул. Ленина, 55' },
    { name: 'Барнаул Алтай', address: 'Барнаул, пр. Ленина, 24' },
    { name: 'Бийск отель', address: 'Бийск, ул. Ленина, 211' },
    { name: 'Рубцовск отель', address: 'Рубцовск, пр. Ленина, 112' },
    { name: 'Заринск отель', address: 'Заринск, ул. Ленина, 28' },
    { name: 'Новоалтайск отель', address: 'Новоалтайск, ул. Деповская, 24' },
    { name: 'Кемерово Кузбасс', address: 'Кемерово, пр. Советский, 56' },
    { name: 'Прокопьевск отель', address: 'Прокопьевск, пр. Шахтёров, 44' },
    { name: 'Ленинск-Кузнецкий отель', address: 'Ленинск-Кузнецкий, пр. Кирова, 62' },
    { name: 'Междуреченск отель', address: 'Междуреченск, пр. Строителей, 25' },
    { name: 'Киселёвск отель', address: 'Киселёвск, ул. Ленина, 38' },
    { name: 'Юрга отель', address: 'Юрга, ул. Ленина, 52' },
    { name: 'Новокузнецк Новокузнецкая', address: 'Новокузнецк, ул. Кирова, 56' },
    { name: 'Осинники отель', address: 'Осинники, ул. Ленина, 42' },
    { name: 'Мыски отель', address: 'Мыски, ул. Ленина, 18' },
    { name: 'Абакан Хакасия', address: 'Абакан, ул. Пушкина, 78' },
    { name: 'Черногорск отель', address: 'Черногорск, ул. Советская, 66' },
    { name: 'Саяногорск отель', address: 'Саяногорск, ул. Ленинградская, 42' },
    { name: 'Владивосток Хёндэ', address: 'Владивосток, ул. Семёновская, 29' },
    { name: 'Артём отель', address: 'Артём, ул. Фрунзе, 36' },
    { name: 'Уссурийск отель', address: 'Уссурийск, ул. Некрасова, 22' },
    { name: 'Арсеньев отель', address: 'Арсеньев, ул. Ленина, 42' },
    { name: 'Дальнегорск отель', address: 'Дальнегорск, пр. 50 лет Октября, 74' },
    { name: 'Дальнереченск отель', address: 'Дальнереченск, ул. Ленина, 52' },
    { name: 'Партизанск отель', address: 'Партизанск, ул. Ленина, 38' },
    { name: 'Спасск-Дальний отель', address: 'Спасск-Дальний, ул. Советская, 112' },
    { name: 'Хабаровск Парус', address: 'Хабаровск, ул. Амурский бульвар, 2' },
    { name: 'Комсомольск Амур', address: 'Комсомольск-на-Амуре, пр. Ленина, 27' },
    { name: 'Амурск отель', address: 'Амурск, пр. Строителей, 47' },
    { name: 'Советская Гавань отель', address: 'Советская Гавань, ул. Ленина, 42' },
    { name: 'Николаевск-на-Амуре отель', address: 'Николаевск-на-Амуре, ул. Советская, 28' },
    { name: 'Якутск Лена', address: 'Якутск, пр. Ленина, 24' },
    { name: 'Нерюнгри отель', address: 'Нерюнгри, ул. Ленина, 25' },
    { name: 'Мирный отель', address: 'Мирный, ул. Ленина, 7' },
    { name: 'Ленск отель', address: 'Ленск, ул. Ленина, 42' },
    { name: 'Алдан отель', address: 'Алдан, ул. Ленина, 38' },
    { name: 'Благовещенск Амур', address: 'Благовещенск, ул. Ленина, 133' },
    { name: 'Тында отель', address: 'Тында, ул. Красная Пресня, 146' },
    { name: 'Свободный отель', address: 'Свободный, ул. Ленина, 52' },
    { name: 'Петропавловск Авача', address: 'Петропавловск-Камчатский, пр. Карла Маркса, 31' },
    { name: 'Елизово отель', address: 'Елизово, ул. Ленина, 23' },
    { name: 'Вилючинск отель', address: 'Вилючинск, ул. Победы, 18' },
    { name: 'Южно-Сахалинск Мега Палас', address: 'Южно-Сахалинск, ул. Ленина, 220' },
    { name: 'Холмск отель', address: 'Холмск, ул. Советская, 78' },
    { name: 'Корсаков отель', address: 'Корсаков, ул. Советская, 42' },
    { name: 'Находка Находка', address: 'Находка, Находкинский проспект, 14' },
    { name: 'Партизанск Приморье отель', address: 'Партизанск, ул. Ленина, 38' },
    { name: 'Дальнереченск Приморье отель', address: 'Дальнереченск, ул. Ленина, 52' },
    { name: 'Грозный Сити 2', address: 'Грозный, пр. Ахмата Кадырова, 2' },
    { name: 'Махачкала Панорама', address: 'Махачкала, пр. Расула Гамзатова, 43' },
    { name: 'Дербент отель', address: 'Дербент, ул. Ленина, 14' },
    { name: 'Каспийск отель', address: 'Каспийск, ул. Ленина, 22' },
    { name: 'Избербаш отель', address: 'Избербаш, ул. Ленина, 18' },
    { name: 'Буйнакск отель', address: 'Буйнакск, ул. Ленина, 42' },
    { name: 'Кизляр отель', address: 'Кизляр, ул. Ленина, 28' },
    { name: 'Хасавюрт отель', address: 'Хасавюрт, ул. Ленина, 55' },
    { name: 'Карабудахкент отель', address: 'Карабудахкент, ул. Ленина, 12' },
    { name: 'Тюмень Восток', address: 'Тюмень, ул. Республики, 159' },
    { name: 'Нижнекамск Нефтехимик', address: 'Нижнекамск, пр. Химиков, 31' },
    { name: 'Елабуга отель', address: 'Елабуга, ул. Казанская, 18' },
    { name: 'Чистополь отель', address: 'Чистополь, ул. Ленина, 42' },
    { name: 'Зеленодольск отель', address: 'Зеленодольск, ул. Ленина, 28' },
    { name: 'Лениногорск отель', address: 'Лениногорск, ул. Ленина, 52' },
    { name: 'Октябрьский отель', address: 'Октябрьский, ул. Ленина, 38' },
    { name: 'Сибай отель', address: 'Сибай, ул. Ленина, 22' },
    { name: 'Кумертау отель', address: 'Кумертау, ул. Ленина, 35' },
    { name: 'Орск Южный Урал', address: 'Орск, пр. Ленина, 45' },
    { name: 'Новотроицк отель', address: 'Новотроицк, ул. Советская, 62' },
    { name: 'Бугуруслан отель', address: 'Бугуруслан, ул. Ленина, 42' },
    { name: 'Бузулук Авиатор', address: 'Бузулук, ул. Ленина, 63' },
    { name: 'Гай отель', address: 'Гай, ул. Ленина, 28' },
    { name: 'Медногорск отель', address: 'Медногорск, ул. Ленина, 18' },
    { name: 'Новоуральск отель', address: 'Новоуральск, ул. Ленина, 15' },
    { name: 'Лесной отель', address: 'Лесной, ул. Ленина, 42' },
    { name: 'Верхняя Салда отель', address: 'Верхняя Салда, ул. Ленина, 28' },
    { name: 'Красноуральск отель', address: 'Красноуральск, ул. Ленина, 22' },
    { name: 'Североуральск отель', address: 'Североуральск, ул. Мира, 18' },
    { name: 'Ивдель отель', address: 'Ивдель, ул. Ленина, 52' },
    { name: 'Губкинский отель', address: 'Губкинский, ул. Ленина, 28' },
    { name: 'Муравленко отель', address: 'Муравленко, ул. Ленина, 35' },
    { name: 'Тарко-Сале отель', address: 'Тарко-Сале, ул. Ленина, 42' },
    { name: 'Губкинский Ямал', address: 'Губкинский, ул. Ленина, 28' },
    { name: 'Муравленко Север', address: 'Муравленко, ул. Ленина, 35' },
    { name: 'Пуровск отель', address: 'Тарко-Сале, ул. Ленина, 42' },
    { name: 'Тверь Гелиопарк', address: 'Тверь, ул. Советская, 61' },
    { name: 'Ржев отель', address: 'Ржев, ул. Ленина, 28' },
    { name: 'Кимры отель', address: 'Кимры, ул. Урицкого, 8' },
    { name: 'Вышний Волочёк Венеция', address: 'Вышний Волочёк, ул. Осташковская, 3' },
    { name: 'Бежецк отель', address: 'Бежецк, ул. Ленина, 42' },
    { name: 'Осташков отель', address: 'Осташков, ул. Ленина, 52' },
    { name: 'Торжок отель', address: 'Торжок, ул. Ленина, 28' },
    { name: 'Конаково отель', address: 'Конаково, ул. Ленина, 35' },
    { name: 'Удомля отель', address: 'Удомля, ул. Ленина, 18' },
    { name: 'Валдай отель', address: 'Валдай, ул. Луначарского, 2' },
    { name: 'Старая Русса отель', address: 'Старая Русса, ул. Ленина, 42' },
    { name: 'Боровичи отель', address: 'Боровичи, ул. Ленина, 28' },
    { name: 'Чудово отель', address: 'Чудово, ул. Ленина, 22' },
    { name: 'Псков Рижская', address: 'Псков, ул. Р. Люксембург, 1' },
    { name: 'Великие Луки Луч', address: 'Великие Луки, ул. Пушкина, 12' },
    { name: 'Остров отель', address: 'Остров, ул. Ленина, 8' },
    { name: 'Печоры отель', address: 'Печоры, ул. Ленина, 15' },
    { name: 'Петрозаводск Карелия', address: 'Петрозаводск, ул. Ленина, 26' },
    { name: 'Кондопога отель', address: 'Кондопога, ул. Ленина, 22' },
    { name: 'Сегежа отель', address: 'Сегежа, ул. Ленина, 18' },
    { name: 'Костомукша отель', address: 'Костомукша, ул. Ленина, 12' },
    { name: 'Сортавала отель', address: 'Сортавала, ул. Ленина, 28' },
    { name: 'Медвежьегорск отель', address: 'Медвежьегорск, ул. Ленина, 15' },
    { name: 'Беломорск отель', address: 'Беломорск, ул. Ленина, 22' },
    { name: 'Кемь отель', address: 'Кемь, ул. Ленина, 18' },
    { name: 'Кандалакша отель', address: 'Кандалакша, ул. Ленина, 42' },
    { name: 'Северодвинск отель', address: 'Северодвинск, ул. Ленина, 38' },
    { name: 'Котлас отель', address: 'Котлас, ул. Ленина, 28' },
    { name: 'Коряжма отель', address: 'Коряжма, ул. Ленина, 22' },
    { name: 'Мончегорск отель', address: 'Мончегорск, ул. Ленина, 15' },
    { name: 'Кировск отель', address: 'Кировск, ул. Ленина, 28' },
    { name: 'Апатиты отель', address: 'Апатиты, ул. Ленина, 42' },
    { name: 'Оленегорск отель', address: 'Оленегорск, ул. Ленина, 18' },
    { name: 'Заполярный отель', address: 'Заполярный, ул. Ленина, 12' },
    { name: 'Ковдор отель', address: 'Ковдор, ул. Ленина, 8' },
    { name: 'Полярные Зори отель', address: 'Полярные Зори, ул. Ленина, 15' },
    { name: 'Светогорск отель', address: 'Светогорск, ул. Ленина, 22' },
    { name: 'Выборг отель', address: 'Выборг, ул. Ленина, 42' },
    { name: 'Приозерск отель', address: 'Приозерск, ул. Ленина, 28' },
    { name: 'Сосновый Бор отель', address: 'Сосновый Бор, ул. Ленина, 35' },
    { name: 'Тихвин отель', address: 'Тихвин, ул. Ленина, 38' },
    { name: 'Кириши отель', address: 'Кириши, ул. Ленина, 25' },
    { name: 'Волхов отель', address: 'Волхов, ул. Ленина, 32' },
    { name: 'Сланцы отель', address: 'Сланцы, ул. Ленина, 18' },
    { name: 'Кингисепп отель', address: 'Кингисепп, ул. Ленина, 22' },
    { name: 'Луга отель', address: 'Луга, ул. Ленина, 42' },
    { name: 'Гатчина отель', address: 'Гатчина, ул. Ленина, 28' },
    { name: 'Лодейное Поле отель', address: 'Лодейное Поле, ул. Ленина, 15' },
    { name: 'Подпорожье отель', address: 'Подпорожье, ул. Ленина, 12' }
  ];

  function addPlacemarkFromGeocode(map, coords, name, discount, CustomPinLayout, HotelBalloonLayout) {
    var placemark = new ymaps.Placemark(
      coords,
      {
        hintContent: name,
        balloonContentHeader: name,
        balloonContentBody: 'Скидка: −' + discount + '%',
        discount: discount
      },
      {
        iconLayout: CustomPinLayout,
        iconShape: { type: 'Rectangle', coordinates: [[-44, -18], [44, 18]] },
        balloonContentLayout: HotelBalloonLayout,
        hideIconOnBalloonOpen: false,
        openBalloonOnClick: false
      }
    );
    map.geoObjects.add(placemark);
  }

  function geocodeAndAddPlacemarks(map, hotels, bounds, discountMin, discountMax, CustomPinLayout, HotelBalloonLayout) {
    var promises = hotels.map(function(hotel, i) {
      var discount = discountMin + (i % (discountMax - discountMin + 1));
      return ymaps.geocode(hotel.address, { boundedBy: bounds, results: 1, strictBounds: false })
        .then(function(res) {
          if (res.geoObjects.getLength() > 0) {
            var coords = res.geoObjects.get(0).geometry.getCoordinates();
            return { coords: coords, name: hotel.name, discount: discount };
          }
          return null;
        })
        .catch(function() { return null; });
    });

    Promise.all(promises).then(function(results) {
      var resolved = results.filter(function(r) { return r; });
      resolved.forEach(function(item) {
        addPlacemarkFromGeocode(map, item.coords, item.name, item.discount, CustomPinLayout, HotelBalloonLayout);
      });
    });
  }

  /** Геокодирование адресов отелей по РФ и добавление на карту как чёрные точки 5px */
  function geocodeAndAddDotPlacemarks(map, hotels, bounds, SmallBlackDotLayout) {
    var dotShape = { type: 'Rectangle', coordinates: [[-2.5, -2.5], [2.5, 2.5]] };
    var promises = hotels.map(function(hotel) {
      return ymaps.geocode(hotel.address, { boundedBy: bounds, results: 1, strictBounds: false })
        .then(function(res) {
          if (res.geoObjects.getLength() > 0) {
            var coords = res.geoObjects.get(0).geometry.getCoordinates();
            return { coords: coords, name: hotel.name };
          }
          return null;
        })
        .catch(function() { return null; });
    });

    Promise.all(promises).then(function(results) {
      var resolved = results.filter(function(r) { return r; });
      resolved.forEach(function(item) {
        var placemark = new ymaps.Placemark(item.coords, {}, {
          iconLayout: SmallBlackDotLayout,
          iconShape: dotShape,
          hasBalloon: false,
          hasHint: false
        });
        map.geoObjects.add(placemark);
      });
    });
  }

  /** Map city name (from address) → approximate coordinates for Russia-wide dot map */
  var CITY_COORDS = {
    'Калининград': [54.7104, 20.4522], 'Мурманск': [68.9585, 33.0827],
    'Архангельск': [64.5399, 40.5152], 'Вологда': [59.2181, 39.8886],
    'Ярославль': [57.6261, 39.8845], 'Тверь': [56.8587, 35.9176],
    'Владимир': [56.1290, 40.4066], 'Иваново': [56.9965, 40.9716],
    'Нижний Новгород': [56.3269, 43.9962], 'Самара': [53.1959, 50.1002],
    'Саратов': [51.5336, 46.0343], 'Волгоград': [48.7080, 44.5133],
    'Ульяновск': [54.3142, 48.4031], 'Ростов-на-Дону': [47.2357, 39.7015],
    'Краснодар': [45.0355, 38.9753], 'Сочи': [43.5855, 39.7231],
    'Минеральные Воды': [44.2210, 43.1350], 'Грозный': [43.3180, 45.6947],
    'Екатеринбург': [56.8389, 60.6057], 'Челябинск': [55.1644, 61.4368],
    'Пермь': [58.0105, 56.2502], 'Тюмень': [57.1531, 65.5343],
    'Уфа': [54.7388, 55.9721], 'Оренбург': [51.7685, 55.0968],
    'Магнитогорск': [53.4071, 59.0455], 'Новосибирск': [55.0084, 82.9357],
    'Омск': [54.9885, 73.3242], 'Томск': [56.4846, 84.9476],
    'Красноярск': [56.0153, 92.8932], 'Иркутск': [52.2869, 104.3050],
    'Барнаул': [53.3548, 83.7696], 'Кемерово': [55.3546, 86.0875],
    'Новокузнецк': [53.7596, 87.1216], 'Абакан': [53.7151, 91.4292],
    'Владивосток': [43.1155, 131.8855], 'Хабаровск': [48.4802, 135.0719],
    'Якутск': [62.0355, 129.6755], 'Благовещенск': [50.2907, 127.5272],
    'Петропавловск-Камчатский': [53.0452, 158.6511],
    'Южно-Сахалинск': [46.9641, 142.7285], 'Находка': [42.8238, 132.8735],
    'Комсомольск-на-Амуре': [50.5512, 137.0079], 'Курган': [55.4449, 65.3415],
    'Смоленск': [54.7826, 32.0453], 'Тула': [54.1961, 37.6182],
    'Рязань': [54.6295, 39.7368], 'Кострома': [57.7677, 40.9270],
    'Липецк': [52.6031, 39.5708], 'Воронеж': [51.6720, 39.1843],
    'Тамбов': [52.7317, 41.4433], 'Пенза': [53.1959, 45.0183],
    'Саранск': [54.1838, 45.1749], 'Чебоксары': [56.1322, 47.2519],
    'Йошкар-Ола': [56.6343, 47.8995], 'Ижевск': [56.8527, 53.2114],
    'Горно-Алтайск': [51.9581, 85.9603], 'Улан-Удэ': [51.8271, 107.5864],
    'Чита': [52.0340, 113.5006], 'Салехард': [66.5300, 66.6019],
    'Новый Уренгой': [66.0853, 76.6823], 'Сургут': [61.2500, 73.3964],
    'Нижневартовск': [60.9344, 76.5531], 'Великий Новгород': [58.5228, 31.2749],
    'Псков': [57.8136, 28.3496], 'Петрозаводск': [61.7849, 34.3469],
    'Череповец': [59.1269, 37.9093], 'Рыбинск': [58.0455, 38.8421],
    'Брянск': [53.2521, 34.3717], 'Орёл': [52.9651, 36.0785],
    'Курск': [51.7373, 36.1874], 'Белгород': [50.5997, 36.5862],
    'Калуга': [54.5293, 36.2754], 'Обнинск': [55.0968, 36.6121],
    'Набережные Челны': [55.7437, 52.3959], 'Альметьевск': [54.9013, 52.2973],
    'Нижнекамск': [55.6372, 51.8207], 'Орск': [51.2293, 58.4746],
    'Стерлитамак': [53.6302, 55.9500], 'Златоуст': [55.1719, 59.6725],
    'Нижний Тагил': [57.9193, 59.9654], 'Тольятти': [53.5078, 49.4204],
    'Волжский': [48.7833, 44.7561], 'Таганрог': [47.2362, 38.8969],
    'Новороссийск': [44.7235, 37.7687], 'Геленджик': [44.5622, 38.0766],
    'Анапа': [44.8932, 37.3166], 'Пятигорск': [44.0486, 43.0594],
    'Кисловодск': [43.9133, 42.7206], 'Ессентуки': [44.0451, 42.8608],
    'Ставрополь': [45.0448, 41.9691], 'Махачкала': [42.9849, 47.5047],
    'Владикавказ': [43.0242, 44.6816], 'Нальчик': [43.4846, 43.6072],
    'Элиста': [46.3078, 44.2558], 'Астрахань': [46.3497, 48.0408],
    'Адлер': [43.4280, 39.9200], 'Ейск': [46.7103, 38.2717],
    'Когалым': [62.2665, 74.4833], 'Ноябрьск': [63.2013, 75.4511],
    'Надым': [65.5289, 72.5231], 'Нарьян-Мар': [67.6380, 53.0066],
    'Воркута': [67.4969, 64.0602], 'Ухта': [63.5672, 53.6914],
    'Сыктывкар': [61.6688, 50.8364], 'Великие Луки': [56.3400, 30.5453],
    'Белозерск': [60.0355, 37.7905], 'Великий Устюг': [60.7600, 46.3000],
    'Суздаль': [56.4222, 40.4500], 'Дзержинск': [56.2476, 43.4601],
    'Тобольск': [58.1987, 68.2543], 'Мичуринск': [52.8975, 40.4906],
    'Старый Оскол': [51.2967, 37.8414], 'Балаково': [52.0278, 47.8007],
    'Камышин': [50.0833, 45.4008], 'Сызрань': [53.1553, 48.4746],
    'Лодейное Поле': [60.7270, 33.5530], 'Гатчина': [59.5764, 30.1286]
  };

  function russiaDotsFromAddresses(hotels) {
    var seen = {};
    var coords = [];
    hotels.forEach(function(h) {
      var city = h.address.split(',')[0].trim();
      if (!seen[city] && CITY_COORDS[city]) {
        seen[city] = true;
        coords.push(CITY_COORDS[city]);
      }
    });
    return coords;
  }

  function initSavingsMaps() {
    if (typeof ymaps === 'undefined') {
      console.error('Yandex Maps API не загружен');
      return;
    }

    ymaps.ready(function() {
      var containers = {
        moscow: document.getElementById('yandex-map-moscow'),
        spb: document.getElementById('yandex-map-spb'),
        kazan: document.getElementById('yandex-map-kazan'),
        russia: document.getElementById('yandex-map-russia')
      };

      if (!containers.moscow) return;

      var CustomPinLayout = createPinLayout();
      var HotelBalloonLayout = createBalloonContentLayout();
      var SmallBlackDotLayout = createSmallBlackDotLayout();

      // Use hardcoded coordinates (no geocoding needed)
      var spbPlacemarks = geoPlacemarksToPlacemarks(SPB_HOTELS_GEO);
      var kazanPlacemarks = geoPlacemarksToPlacemarks(KAZAN_HOTELS_GEO);

      window.savingsMaps = {
        moscow: createMap('yandex-map-moscow', [55.7558, 37.6173], 11, MOSCOW_PLACEMARKS_REAL),
        spb: createMap('yandex-map-spb', [59.9343, 30.3351], 12, spbPlacemarks),
        kazan: createMap('yandex-map-kazan', [55.7977, 49.1131], 13, kazanPlacemarks),
        russia: createMap('yandex-map-russia', [60, 82], 4, [], { dotsOnly: true })
      };

      // Russia dots — use hardcoded city coordinates (no geocoding needed)
      var russiaDots = russiaDotsFromAddresses(RUSSIA_HOTELS_ADDRESSES);
      var dotShape = { type: 'Rectangle', coordinates: [[-2.5, -2.5], [2.5, 2.5]] };
      russiaDots.forEach(function(coords) {
        var placemark = new ymaps.Placemark(coords, {}, {
          iconLayout: SmallBlackDotLayout,
          iconShape: dotShape,
          hasBalloon: false,
          hasHint: false
        });
        window.savingsMaps.russia.geoObjects.add(placemark);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSavingsMaps);
  } else {
    initSavingsMaps();
  }
})();
