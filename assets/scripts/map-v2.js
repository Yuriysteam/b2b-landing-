// Интерактивная карта с отелями для v2
(function () {
  // Проверяем наличие контейнера карты
  const mapContainer = document.getElementById('yandex-map');
  const hotelsContainer = document.getElementById('hotelSnippets');
  if (!mapContainer || !hotelsContainer) return;

  // Конфигурация маркеров
  const markerConfig = {
    iconSize: 16,
    fontSize: 14,
    clusterRadius: 60,
    colors: {
      markerBg: '#FFFFFF',
      discountText: '#000000',
      clusterBg: '#7F5FFF'
    }
  };

  // Кастомные стили карты (фиолетовая тема)
  const mapCustomStyles = [{"tags":"country","elements":"geometry.fill","stylers":[{"color":"#8d85ad"},{"opacity":0.8,"zoom":0},{"opacity":0.8,"zoom":1},{"opacity":0.8,"zoom":2},{"opacity":0.8,"zoom":3},{"opacity":0.8,"zoom":4},{"opacity":1,"zoom":5},{"opacity":1,"zoom":6},{"opacity":1,"zoom":7},{"opacity":1,"zoom":8},{"opacity":1,"zoom":9},{"opacity":1,"zoom":10},{"opacity":1,"zoom":11},{"opacity":1,"zoom":12},{"opacity":1,"zoom":13},{"opacity":1,"zoom":14},{"opacity":1,"zoom":15},{"opacity":1,"zoom":16},{"opacity":1,"zoom":17},{"opacity":1,"zoom":18},{"opacity":1,"zoom":19},{"opacity":1,"zoom":20},{"opacity":1,"zoom":21}]},{"tags":"country","elements":"geometry.outline","stylers":[{"color":"#ad99ff"},{"opacity":0.15,"zoom":0},{"opacity":0.15,"zoom":1},{"opacity":0.15,"zoom":2},{"opacity":0.15,"zoom":3},{"opacity":0.15,"zoom":4},{"opacity":0.15,"zoom":5},{"opacity":0.25,"zoom":6},{"opacity":0.5,"zoom":7},{"opacity":0.47,"zoom":8},{"opacity":0.44,"zoom":9},{"opacity":0.41,"zoom":10},{"opacity":0.38,"zoom":11},{"opacity":0.35,"zoom":12},{"opacity":0.33,"zoom":13},{"opacity":0.3,"zoom":14},{"opacity":0.28,"zoom":15},{"opacity":0.25,"zoom":16},{"opacity":0.25,"zoom":17},{"opacity":0.25,"zoom":18},{"opacity":0.25,"zoom":19},{"opacity":0.25,"zoom":20},{"opacity":0.25,"zoom":21}]},{"tags":"region","elements":"geometry.fill","stylers":[{"color":"#a9a3c2","opacity":0.5,"zoom":0},{"color":"#a9a3c2","opacity":0.5,"zoom":1},{"color":"#a9a3c2","opacity":0.5,"zoom":2},{"color":"#a9a3c2","opacity":0.5,"zoom":3},{"color":"#a9a3c2","opacity":0.5,"zoom":4},{"color":"#a9a3c2","opacity":0.5,"zoom":5},{"color":"#a9a3c2","opacity":1,"zoom":6},{"color":"#a9a3c2","opacity":1,"zoom":7},{"color":"#8d85ad","opacity":1,"zoom":8},{"color":"#8d85ad","opacity":1,"zoom":9},{"color":"#8d85ad","opacity":1,"zoom":10},{"color":"#8d85ad","opacity":1,"zoom":11},{"color":"#8d85ad","opacity":1,"zoom":12},{"color":"#8d85ad","opacity":1,"zoom":13},{"color":"#8d85ad","opacity":1,"zoom":14},{"color":"#8d85ad","opacity":1,"zoom":15},{"color":"#8d85ad","opacity":1,"zoom":16},{"color":"#8d85ad","opacity":1,"zoom":17},{"color":"#8d85ad","opacity":1,"zoom":18},{"color":"#8d85ad","opacity":1,"zoom":19},{"color":"#8d85ad","opacity":1,"zoom":20},{"color":"#8d85ad","opacity":1,"zoom":21}]},{"tags":"region","elements":"geometry.outline","stylers":[{"color":"#ad99ff"},{"opacity":0.15,"zoom":0},{"opacity":0.15,"zoom":1},{"opacity":0.15,"zoom":2},{"opacity":0.15,"zoom":3},{"opacity":0.15,"zoom":4},{"opacity":0.15,"zoom":5},{"opacity":0.25,"zoom":6},{"opacity":0.5,"zoom":7},{"opacity":0.47,"zoom":8},{"opacity":0.44,"zoom":9},{"opacity":0.41,"zoom":10},{"opacity":0.38,"zoom":11},{"opacity":0.35,"zoom":12},{"opacity":0.33,"zoom":13},{"opacity":0.3,"zoom":14},{"opacity":0.28,"zoom":15},{"opacity":0.25,"zoom":16},{"opacity":0.25,"zoom":17},{"opacity":0.25,"zoom":18},{"opacity":0.25,"zoom":19},{"opacity":0.25,"zoom":20},{"opacity":0.25,"zoom":21}]},{"tags":{"any":"admin","none":["country","region","locality","district","address"]},"elements":"geometry.fill","stylers":[{"color":"#8d85ad"},{"opacity":0.5,"zoom":0},{"opacity":0.5,"zoom":1},{"opacity":0.5,"zoom":2},{"opacity":0.5,"zoom":3},{"opacity":0.5,"zoom":4},{"opacity":0.5,"zoom":5},{"opacity":1,"zoom":6},{"opacity":1,"zoom":7},{"opacity":1,"zoom":8},{"opacity":1,"zoom":9},{"opacity":1,"zoom":10},{"opacity":1,"zoom":11},{"opacity":1,"zoom":12},{"opacity":1,"zoom":13},{"opacity":1,"zoom":14},{"opacity":1,"zoom":15},{"opacity":1,"zoom":16},{"opacity":1,"zoom":17},{"opacity":1,"zoom":18},{"opacity":1,"zoom":19},{"opacity":1,"zoom":20},{"opacity":1,"zoom":21}]},{"tags":{"any":"admin","none":["country","region","locality","district","address"]},"elements":"geometry.outline","stylers":[{"color":"#ad99ff"},{"opacity":0.15,"zoom":0},{"opacity":0.15,"zoom":1},{"opacity":0.15,"zoom":2},{"opacity":0.15,"zoom":3},{"opacity":0.15,"zoom":4},{"opacity":0.15,"zoom":5},{"opacity":0.25,"zoom":6},{"opacity":0.5,"zoom":7},{"opacity":0.47,"zoom":8},{"opacity":0.44,"zoom":9},{"opacity":0.41,"zoom":10},{"opacity":0.38,"zoom":11},{"opacity":0.35,"zoom":12},{"opacity":0.33,"zoom":13},{"opacity":0.3,"zoom":14},{"opacity":0.28,"zoom":15},{"opacity":0.25,"zoom":16},{"opacity":0.25,"zoom":17},{"opacity":0.25,"zoom":18},{"opacity":0.25,"zoom":19},{"opacity":0.25,"zoom":20},{"opacity":0.25,"zoom":21}]},{"tags":{"any":"landcover","none":"vegetation"},"stylers":[{"hue":"#cabdff"}]},{"tags":"vegetation","elements":"geometry","stylers":[{"color":"#a18aff","opacity":0.1,"zoom":0},{"color":"#a18aff","opacity":0.1,"zoom":1},{"color":"#a18aff","opacity":0.1,"zoom":2},{"color":"#a18aff","opacity":0.1,"zoom":3},{"color":"#a18aff","opacity":0.1,"zoom":4},{"color":"#a18aff","opacity":0.1,"zoom":5},{"color":"#a18aff","opacity":0.2,"zoom":6},{"color":"#cabdff","opacity":0.3,"zoom":7},{"color":"#cabdff","opacity":0.4,"zoom":8},{"color":"#cabdff","opacity":0.6,"zoom":9},{"color":"#cabdff","opacity":0.8,"zoom":10},{"color":"#cabdff","opacity":1,"zoom":11},{"color":"#cabdff","opacity":1,"zoom":12},{"color":"#cabdff","opacity":1,"zoom":13},{"color":"#d2c7ff","opacity":1,"zoom":14},{"color":"#dad1ff","opacity":1,"zoom":15},{"color":"#dad1ff","opacity":1,"zoom":16},{"color":"#dad1ff","opacity":1,"zoom":17},{"color":"#dad1ff","opacity":1,"zoom":18},{"color":"#dad1ff","opacity":1,"zoom":19},{"color":"#dad1ff","opacity":1,"zoom":20},{"color":"#dad1ff","opacity":1,"zoom":21}]},{"tags":"park","elements":"geometry","stylers":[{"color":"#cabdff","opacity":0.1,"zoom":0},{"color":"#cabdff","opacity":0.1,"zoom":1},{"color":"#cabdff","opacity":0.1,"zoom":2},{"color":"#cabdff","opacity":0.1,"zoom":3},{"color":"#cabdff","opacity":0.1,"zoom":4},{"color":"#cabdff","opacity":0.1,"zoom":5},{"color":"#cabdff","opacity":0.2,"zoom":6},{"color":"#cabdff","opacity":0.3,"zoom":7},{"color":"#cabdff","opacity":0.4,"zoom":8},{"color":"#cabdff","opacity":0.6,"zoom":9},{"color":"#cabdff","opacity":0.8,"zoom":10},{"color":"#cabdff","opacity":1,"zoom":11},{"color":"#cabdff","opacity":1,"zoom":12},{"color":"#cabdff","opacity":1,"zoom":13},{"color":"#d2c7ff","opacity":1,"zoom":14},{"color":"#dad1ff","opacity":1,"zoom":15},{"color":"#dad1ff","opacity":0.9,"zoom":16},{"color":"#dad1ff","opacity":0.8,"zoom":17},{"color":"#dad1ff","opacity":0.7,"zoom":18},{"color":"#dad1ff","opacity":0.7,"zoom":19},{"color":"#dad1ff","opacity":0.7,"zoom":20},{"color":"#dad1ff","opacity":0.7,"zoom":21}]},{"tags":"national_park","elements":"geometry","stylers":[{"color":"#cabdff","opacity":0.1,"zoom":0},{"color":"#cabdff","opacity":0.1,"zoom":1},{"color":"#cabdff","opacity":0.1,"zoom":2},{"color":"#cabdff","opacity":0.1,"zoom":3},{"color":"#cabdff","opacity":0.1,"zoom":4},{"color":"#cabdff","opacity":0.1,"zoom":5},{"color":"#cabdff","opacity":0.2,"zoom":6},{"color":"#cabdff","opacity":0.3,"zoom":7},{"color":"#cabdff","opacity":0.4,"zoom":8},{"color":"#cabdff","opacity":0.6,"zoom":9},{"color":"#cabdff","opacity":0.8,"zoom":10},{"color":"#cabdff","opacity":1,"zoom":11},{"color":"#cabdff","opacity":1,"zoom":12},{"color":"#cabdff","opacity":1,"zoom":13},{"color":"#d2c7ff","opacity":1,"zoom":14},{"color":"#dad1ff","opacity":1,"zoom":15},{"color":"#dad1ff","opacity":0.7,"zoom":16},{"color":"#dad1ff","opacity":0.7,"zoom":17},{"color":"#dad1ff","opacity":0.7,"zoom":18},{"color":"#dad1ff","opacity":0.7,"zoom":19},{"color":"#dad1ff","opacity":0.7,"zoom":20},{"color":"#dad1ff","opacity":0.7,"zoom":21}]},{"tags":"cemetery","elements":"geometry","stylers":[{"color":"#cabdff","zoom":0},{"color":"#cabdff","zoom":1},{"color":"#cabdff","zoom":2},{"color":"#cabdff","zoom":3},{"color":"#cabdff","zoom":4},{"color":"#cabdff","zoom":5},{"color":"#cabdff","zoom":6},{"color":"#cabdff","zoom":7},{"color":"#cabdff","zoom":8},{"color":"#cabdff","zoom":9},{"color":"#cabdff","zoom":10},{"color":"#cabdff","zoom":11},{"color":"#cabdff","zoom":12},{"color":"#cabdff","zoom":13},{"color":"#d2c7ff","zoom":14},{"color":"#dad1ff","zoom":15},{"color":"#dad1ff","zoom":16},{"color":"#dad1ff","zoom":17},{"color":"#dad1ff","zoom":18},{"color":"#dad1ff","zoom":19},{"color":"#dad1ff","zoom":20},{"color":"#dad1ff","zoom":21}]},{"tags":"sports_ground","elements":"geometry","stylers":[{"color":"#b6a3ff","opacity":0,"zoom":0},{"color":"#b6a3ff","opacity":0,"zoom":1},{"color":"#b6a3ff","opacity":0,"zoom":2},{"color":"#b6a3ff","opacity":0,"zoom":3},{"color":"#b6a3ff","opacity":0,"zoom":4},{"color":"#b6a3ff","opacity":0,"zoom":5},{"color":"#b6a3ff","opacity":0,"zoom":6},{"color":"#b6a3ff","opacity":0,"zoom":7},{"color":"#b6a3ff","opacity":0,"zoom":8},{"color":"#b6a3ff","opacity":0,"zoom":9},{"color":"#b6a3ff","opacity":0,"zoom":10},{"color":"#b6a3ff","opacity":0,"zoom":11},{"color":"#b6a3ff","opacity":0,"zoom":12},{"color":"#b6a3ff","opacity":0,"zoom":13},{"color":"#beadff","opacity":0,"zoom":14},{"color":"#c6b8ff","opacity":0.5,"zoom":15},{"color":"#c7baff","opacity":1,"zoom":16},{"color":"#c9bbff","opacity":1,"zoom":17},{"color":"#cabdff","opacity":1,"zoom":18},{"color":"#cbbfff","opacity":1,"zoom":19},{"color":"#cdc0ff","opacity":1,"zoom":20},{"color":"#cec2ff","opacity":1,"zoom":21}]},{"tags":"terrain","elements":"geometry","stylers":[{"hue":"#ded6ff"},{"opacity":0.3,"zoom":0},{"opacity":0.3,"zoom":1},{"opacity":0.3,"zoom":2},{"opacity":0.3,"zoom":3},{"opacity":0.3,"zoom":4},{"opacity":0.35,"zoom":5},{"opacity":0.4,"zoom":6},{"opacity":0.6,"zoom":7},{"opacity":0.8,"zoom":8},{"opacity":0.9,"zoom":9},{"opacity":1,"zoom":10},{"opacity":1,"zoom":11},{"opacity":1,"zoom":12},{"opacity":1,"zoom":13},{"opacity":1,"zoom":14},{"opacity":1,"zoom":15},{"opacity":1,"zoom":16},{"opacity":1,"zoom":17},{"opacity":1,"zoom":18},{"opacity":1,"zoom":19},{"opacity":1,"zoom":20},{"opacity":1,"zoom":21}]},{"tags":"geographic_line","elements":"geometry","stylers":[{"color":"#3b0aff"}]},{"tags":"land","elements":"geometry","stylers":[{"color":"#ded6ff","zoom":0},{"color":"#ded6ff","zoom":1},{"color":"#ded6ff","zoom":2},{"color":"#ded6ff","zoom":3},{"color":"#ded6ff","zoom":4},{"color":"#e2dbff","zoom":5},{"color":"#e6e0ff","zoom":6},{"color":"#ebe6ff","zoom":7},{"color":"#efebff","zoom":8},{"color":"#efebff","zoom":9},{"color":"#efebff","zoom":10},{"color":"#efebff","zoom":11},{"color":"#efebff","zoom":12},{"color":"#efebff","zoom":13},{"color":"#f3f0ff","zoom":14},{"color":"#f7f5ff","zoom":15},{"color":"#f8f6ff","zoom":16},{"color":"#f8f7ff","zoom":17},{"color":"#f9f7ff","zoom":18},{"color":"#faf8ff","zoom":19},{"color":"#faf9ff","zoom":20},{"color":"#fbfaff","zoom":21}]},{"tags":"residential","elements":"geometry","stylers":[{"color":"#ded6ff","opacity":0.5,"zoom":0},{"color":"#ded6ff","opacity":0.5,"zoom":1},{"color":"#ded6ff","opacity":0.5,"zoom":2},{"color":"#ded6ff","opacity":0.5,"zoom":3},{"color":"#ded6ff","opacity":0.5,"zoom":4},{"color":"#ded6ff","opacity":0.5,"zoom":5},{"color":"#ded6ff","opacity":0.5,"zoom":6},{"color":"#ded6ff","opacity":0.5,"zoom":7},{"color":"#ded6ff","opacity":0.5,"zoom":8},{"color":"#ded6ff","opacity":0.5,"zoom":9},{"color":"#ded6ff","opacity":0.5,"zoom":10},{"color":"#ded6ff","opacity":0.5,"zoom":11},{"color":"#ded6ff","opacity":0.5,"zoom":12},{"color":"#ded6ff","opacity":1,"zoom":13},{"color":"#e6e0ff","opacity":1,"zoom":14},{"color":"#efebff","opacity":1,"zoom":15},{"color":"#f0edff","opacity":1,"zoom":16},{"color":"#f2eeff","opacity":1,"zoom":17},{"color":"#f3f0ff","opacity":1,"zoom":18},{"color":"#f4f2ff","opacity":1,"zoom":19},{"color":"#f6f3ff","opacity":1,"zoom":20},{"color":"#f7f5ff","opacity":1,"zoom":21}]},{"tags":"locality","elements":"geometry","stylers":[{"color":"#ded6ff","zoom":0},{"color":"#ded6ff","zoom":1},{"color":"#ded6ff","zoom":2},{"color":"#ded6ff","zoom":3},{"color":"#ded6ff","zoom":4},{"color":"#ded6ff","zoom":5},{"color":"#ded6ff","zoom":6},{"color":"#ded6ff","zoom":7},{"color":"#ded6ff","zoom":8},{"color":"#ded6ff","zoom":9},{"color":"#ded6ff","zoom":10},{"color":"#ded6ff","zoom":11},{"color":"#ded6ff","zoom":12},{"color":"#ded6ff","zoom":13},{"color":"#e6e0ff","zoom":14},{"color":"#efebff","zoom":15},{"color":"#f0edff","zoom":16},{"color":"#f2eeff","zoom":17},{"color":"#f3f0ff","zoom":18},{"color":"#f4f2ff","zoom":19},{"color":"#f6f3ff","zoom":20},{"color":"#f7f5ff","zoom":21}]},{"tags":{"any":"structure","none":["building","fence"]},"elements":"geometry","stylers":[{"opacity":0.9},{"color":"#ded6ff","zoom":0},{"color":"#ded6ff","zoom":1},{"color":"#ded6ff","zoom":2},{"color":"#ded6ff","zoom":3},{"color":"#ded6ff","zoom":4},{"color":"#ded6ff","zoom":5},{"color":"#ded6ff","zoom":6},{"color":"#ded6ff","zoom":7},{"color":"#ded6ff","zoom":8},{"color":"#ded6ff","zoom":9},{"color":"#ded6ff","zoom":10},{"color":"#ded6ff","zoom":11},{"color":"#ded6ff","zoom":12},{"color":"#ded6ff","zoom":13},{"color":"#e6e0ff","zoom":14},{"color":"#efebff","zoom":15},{"color":"#f0edff","zoom":16},{"color":"#f2eeff","zoom":17},{"color":"#f3f0ff","zoom":18},{"color":"#f4f2ff","zoom":19},{"color":"#f6f3ff","zoom":20},{"color":"#f7f5ff","zoom":21}]},{"tags":"building","elements":"geometry.fill","stylers":[{"color":"#cec2ff"},{"opacity":0.7,"zoom":0},{"opacity":0.7,"zoom":1},{"opacity":0.7,"zoom":2},{"opacity":0.7,"zoom":3},{"opacity":0.7,"zoom":4},{"opacity":0.7,"zoom":5},{"opacity":0.7,"zoom":6},{"opacity":0.7,"zoom":7},{"opacity":0.7,"zoom":8},{"opacity":0.7,"zoom":9},{"opacity":0.7,"zoom":10},{"opacity":0.7,"zoom":11},{"opacity":0.7,"zoom":12},{"opacity":0.7,"zoom":13},{"opacity":0.7,"zoom":14},{"opacity":0.7,"zoom":15},{"opacity":0.9,"zoom":16},{"opacity":0.6,"zoom":17},{"opacity":0.6,"zoom":18},{"opacity":0.6,"zoom":19},{"opacity":0.6,"zoom":20},{"opacity":0.6,"zoom":21}]},{"tags":"building","elements":"geometry.outline","stylers":[{"color":"#ad99ff"},{"opacity":0.5,"zoom":0},{"opacity":0.5,"zoom":1},{"opacity":0.5,"zoom":2},{"opacity":0.5,"zoom":3},{"opacity":0.5,"zoom":4},{"opacity":0.5,"zoom":5},{"opacity":0.5,"zoom":6},{"opacity":0.5,"zoom":7},{"opacity":0.5,"zoom":8},{"opacity":0.5,"zoom":9},{"opacity":0.5,"zoom":10},{"opacity":0.5,"zoom":11},{"opacity":0.5,"zoom":12},{"opacity":0.5,"zoom":13},{"opacity":0.5,"zoom":14},{"opacity":0.5,"zoom":15},{"opacity":0.5,"zoom":16},{"opacity":1,"zoom":17},{"opacity":1,"zoom":18},{"opacity":1,"zoom":19},{"opacity":1,"zoom":20},{"opacity":1,"zoom":21}]},{"tags":{"any":"urban_area","none":["residential","industrial","cemetery","park","medical","sports_ground","beach","construction_site"]},"elements":"geometry","stylers":[{"color":"#cec2ff","opacity":1,"zoom":0},{"color":"#cec2ff","opacity":1,"zoom":1},{"color":"#cec2ff","opacity":1,"zoom":2},{"color":"#cec2ff","opacity":1,"zoom":3},{"color":"#cec2ff","opacity":1,"zoom":4},{"color":"#cec2ff","opacity":1,"zoom":5},{"color":"#cec2ff","opacity":1,"zoom":6},{"color":"#cec2ff","opacity":1,"zoom":7},{"color":"#cec2ff","opacity":1,"zoom":8},{"color":"#cec2ff","opacity":1,"zoom":9},{"color":"#cec2ff","opacity":1,"zoom":10},{"color":"#cec2ff","opacity":1,"zoom":11},{"color":"#cec2ff","opacity":1,"zoom":12},{"color":"#cec2ff","opacity":1,"zoom":13},{"color":"#d8ceff","opacity":1,"zoom":14},{"color":"#e2dbff","opacity":1,"zoom":15},{"color":"#ece8ff","opacity":0.67,"zoom":16},{"color":"#f7f5ff","opacity":0.33,"zoom":17},{"color":"#f7f5ff","opacity":0,"zoom":18},{"color":"#f7f5ff","opacity":0,"zoom":19},{"color":"#f7f5ff","opacity":0,"zoom":20},{"color":"#f7f5ff","opacity":0,"zoom":21}]},{"tags":"poi","elements":"label.icon","stylers":[{"color":"#8161ff"},{"secondary-color":"#ffffff"},{"tertiary-color":"#ffffff"}]},{"tags":"poi","elements":"label.text.fill","stylers":[{"color":"#1f0099"}]},{"tags":"poi","elements":"label.text.outline","stylers":[{"color":"#ffffff"},{"opacity":0.5}]},{"tags":"outdoor","elements":"label.icon","stylers":[{"color":"#8161ff"},{"secondary-color":"#ffffff"},{"tertiary-color":"#ffffff"}]},{"tags":"outdoor","elements":"label.text.fill","stylers":[{"color":"#1f0099"}]},{"tags":"outdoor","elements":"label.text.outline","stylers":[{"color":"#ffffff"},{"opacity":0.5}]},{"tags":"park","elements":"label.icon","stylers":[{"color":"#8161ff"},{"secondary-color":"#ffffff"},{"tertiary-color":"#ffffff"}]},{"tags":"park","elements":"label.text.fill","stylers":[{"color":"#1f0099"}]},{"tags":"park","elements":"label.text.outline","stylers":[{"color":"#ffffff"},{"opacity":0.5}]},{"tags":"cemetery","elements":"label.icon","stylers":[{"color":"#8161ff"},{"secondary-color":"#ffffff"},{"tertiary-color":"#ffffff"}]},{"tags":"cemetery","elements":"label.text.fill","stylers":[{"color":"#1f0099"}]},{"tags":"cemetery","elements":"label.text.outline","stylers":[{"color":"#ffffff"},{"opacity":0.5}]},{"tags":"beach","elements":"label.icon","stylers":[{"color":"#8161ff"},{"secondary-color":"#ffffff"},{"tertiary-color":"#ffffff"}]},{"tags":"beach","elements":"label.text.fill","stylers":[{"color":"#1f0099"}]},{"tags":"beach","elements":"label.text.outline","stylers":[{"color":"#ffffff"},{"opacity":0.5}]},{"tags":"medical","elements":"label.icon","stylers":[{"color":"#8161ff"},{"secondary-color":"#ffffff"},{"tertiary-color":"#ffffff"}]},{"tags":"medical","elements":"label.text.fill","stylers":[{"color":"#1f0099"}]},{"tags":"medical","elements":"label.text.outline","stylers":[{"color":"#ffffff"},{"opacity":0.5}]},{"tags":"shopping","elements":"label.icon","stylers":[{"color":"#8161ff"},{"secondary-color":"#ffffff"},{"tertiary-color":"#ffffff"}]},{"tags":"shopping","elements":"label.text.fill","stylers":[{"color":"#1f0099"}]},{"tags":"shopping","elements":"label.text.outline","stylers":[{"color":"#ffffff"},{"opacity":0.5}]},{"tags":"commercial_services","elements":"label.icon","stylers":[{"color":"#8161ff"},{"secondary-color":"#ffffff"},{"tertiary-color":"#ffffff"}]},{"tags":"commercial_services","elements":"label.text.fill","stylers":[{"color":"#1f0099"}]},{"tags":"commercial_services","elements":"label.text.outline","stylers":[{"color":"#ffffff"},{"opacity":0.5}]},{"tags":"food_and_drink","elements":"label.icon","stylers":[{"color":"#8161ff"},{"secondary-color":"#ffffff"},{"tertiary-color":"#ffffff"}]},{"tags":"food_and_drink","elements":"label.text.fill","stylers":[{"color":"#1f0099"}]},{"tags":"food_and_drink","elements":"label.text.outline","stylers":[{"color":"#ffffff"},{"opacity":0.5}]},{"tags":"road","elements":"label.icon","types":"point","stylers":[{"color":"#8161ff"},{"secondary-color":"#ffffff"},{"tertiary-color":"#ffffff"}]},{"tags":"road","elements":"label.text.fill","types":"point","stylers":[{"color":"#ffffff"}]},{"tags":"entrance","elements":"label.icon","stylers":[{"color":"#8161ff"},{"secondary-color":"#ffffff"},{"hue":"#8161ff"}]},{"tags":"locality","elements":"label.icon","stylers":[{"color":"#8161ff"},{"secondary-color":"#ffffff"}]},{"tags":"country","elements":"label.text.fill","stylers":[{"opacity":0.8},{"color":"#2e00e6"}]},{"tags":"country","elements":"label.text.outline","stylers":[{"color":"#ffffff"},{"opacity":0.5}]},{"tags":"region","elements":"label.text.fill","stylers":[{"color":"#2e00e6"},{"opacity":0.8}]},{"tags":"region","elements":"label.text.outline","stylers":[{"color":"#ffffff"},{"opacity":0.5}]},{"tags":"district","elements":"label.text.fill","stylers":[{"color":"#2e00e6"},{"opacity":0.8}]},{"tags":"district","elements":"label.text.outline","stylers":[{"color":"#ffffff"},{"opacity":0.5}]},{"tags":{"any":"admin","none":["country","region","locality","district","address"]},"elements":"label.text.fill","stylers":[{"color":"#2e00e6"}]},{"tags":{"any":"admin","none":["country","region","locality","district","address"]},"elements":"label.text.outline","stylers":[{"color":"#ffffff"},{"opacity":0.5}]},{"tags":"locality","elements":"label.text.fill","stylers":[{"color":"#1f0099","zoom":0},{"color":"#1f0099","zoom":1},{"color":"#1f0099","zoom":2},{"color":"#1f0099","zoom":3},{"color":"#1f0099","zoom":4},{"color":"#1e0095","zoom":5},{"color":"#1d0091","zoom":6},{"color":"#1d008d","zoom":7},{"color":"#1c0088","zoom":8},{"color":"#1b0084","zoom":9},{"color":"#1a0080","zoom":10},{"color":"#1a0080","zoom":11},{"color":"#1a0080","zoom":12},{"color":"#1a0080","zoom":13},{"color":"#1a0080","zoom":14},{"color":"#1a0080","zoom":15},{"color":"#1a0080","zoom":16},{"color":"#1a0080","zoom":17},{"color":"#1a0080","zoom":18},{"color":"#1a0080","zoom":19},{"color":"#1a0080","zoom":20},{"color":"#1a0080","zoom":21}]},{"tags":"locality","elements":"label.text.outline","stylers":[{"color":"#ffffff"},{"opacity":0.5}]},{"tags":"road","elements":"label.text.fill","types":"polyline","stylers":[{"color":"#2400b3"}]},{"tags":"road","elements":"label.text.outline","types":"polyline","stylers":[{"color":"#ffffff"},{"opacity":0.5}]},{"tags":"road","elements":"geometry.fill.pattern","types":"polyline","stylers":[{"scale":1},{"color":"#471aff"}]},{"tags":"road","elements":"label.text.fill","types":"point","stylers":[{"color":"#ffffff"}]},{"tags":"structure","elements":"label.text.fill","stylers":[{"color":"#2900cc"},{"opacity":0.5}]},{"tags":"structure","elements":"label.text.outline","stylers":[{"color":"#ffffff"},{"opacity":0.5}]},{"tags":"address","elements":"label.text.fill","stylers":[{"color":"#2900cc"},{"opacity":0.9,"zoom":0},{"opacity":0.9,"zoom":1},{"opacity":0.9,"zoom":2},{"opacity":0.9,"zoom":3},{"opacity":0.9,"zoom":4},{"opacity":0.9,"zoom":5},{"opacity":0.9,"zoom":6},{"opacity":0.9,"zoom":7},{"opacity":0.9,"zoom":8},{"opacity":0.9,"zoom":9},{"opacity":0.9,"zoom":10},{"opacity":0.9,"zoom":11},{"opacity":0.9,"zoom":12},{"opacity":0.9,"zoom":13},{"opacity":0.9,"zoom":14},{"opacity":0.9,"zoom":15},{"opacity":0.9,"zoom":16},{"opacity":1,"zoom":17},{"opacity":1,"zoom":18},{"opacity":1,"zoom":19},{"opacity":1,"zoom":20},{"opacity":1,"zoom":21}]},{"tags":"address","elements":"label.text.outline","stylers":[{"color":"#ffffff"},{"opacity":0.5}]},{"tags":"landscape","elements":"label.text.fill","stylers":[{"color":"#2e00e6","opacity":1,"zoom":0},{"color":"#2e00e6","opacity":1,"zoom":1},{"color":"#2e00e6","opacity":1,"zoom":2},{"color":"#2e00e6","opacity":1,"zoom":3},{"color":"#2900cc","opacity":0.5,"zoom":4},{"color":"#2900cc","opacity":0.5,"zoom":5},{"color":"#2900cc","opacity":0.5,"zoom":6},{"color":"#2900cc","opacity":0.5,"zoom":7},{"color":"#2900cc","opacity":0.5,"zoom":8},{"color":"#2900cc","opacity":0.5,"zoom":9},{"color":"#2900cc","opacity":0.5,"zoom":10},{"color":"#2900cc","opacity":0.5,"zoom":11},{"color":"#2900cc","opacity":0.5,"zoom":12},{"color":"#2900cc","opacity":0.5,"zoom":13},{"color":"#2900cc","opacity":0.5,"zoom":14},{"color":"#2900cc","opacity":0.5,"zoom":15},{"color":"#2900cc","opacity":0.5,"zoom":16},{"color":"#2900cc","opacity":0.5,"zoom":17},{"color":"#2900cc","opacity":0.5,"zoom":18},{"color":"#2900cc","opacity":0.5,"zoom":19},{"color":"#2900cc","opacity":0.5,"zoom":20},{"color":"#2900cc","opacity":0.5,"zoom":21}]},{"tags":"landscape","elements":"label.text.outline","stylers":[{"color":"#ffffff"},{"opacity":0.5,"zoom":0},{"opacity":0.5,"zoom":1},{"opacity":0.5,"zoom":2},{"opacity":0.5,"zoom":3},{"opacity":0,"zoom":4},{"opacity":0,"zoom":5},{"opacity":0,"zoom":6},{"opacity":0,"zoom":7},{"opacity":0,"zoom":8},{"opacity":0,"zoom":9},{"opacity":0,"zoom":10},{"opacity":0,"zoom":11},{"opacity":0,"zoom":12},{"opacity":0,"zoom":13},{"opacity":0,"zoom":14},{"opacity":0,"zoom":15},{"opacity":0,"zoom":16},{"opacity":0,"zoom":17},{"opacity":0,"zoom":18},{"opacity":0,"zoom":19},{"opacity":0,"zoom":20},{"opacity":0,"zoom":21}]},{"tags":"water","elements":"label.text.fill","stylers":[{"color":"#3705ff"},{"opacity":0.8}]},{"tags":"water","elements":"label.text.outline","types":"polyline","stylers":[{"color":"#ffffff"},{"opacity":0.2}]},{"tags":{"any":"road_1","none":"is_tunnel"},"elements":"geometry.fill","stylers":[{"color":"#ffffff"},{"scale":0,"zoom":0},{"scale":0,"zoom":1},{"scale":0,"zoom":2},{"scale":0,"zoom":3},{"scale":0,"zoom":4},{"scale":0,"zoom":5},{"scale":2.97,"zoom":6},{"scale":3.19,"zoom":7},{"scale":3.53,"zoom":8},{"scale":4,"zoom":9},{"scale":3.61,"zoom":10},{"scale":3.06,"zoom":11},{"scale":2.64,"zoom":12},{"scale":2.27,"zoom":13},{"scale":2.03,"zoom":14},{"scale":1.9,"zoom":15},{"scale":1.86,"zoom":16},{"scale":1.48,"zoom":17},{"scale":1.21,"zoom":18},{"scale":1.04,"zoom":19},{"scale":0.94,"zoom":20},{"scale":0.9,"zoom":21}]},{"tags":{"any":"road_1"},"elements":"geometry.outline","stylers":[{"color":"#00000000","scale":1.4,"zoom":0},{"color":"#00000000","scale":1.4,"zoom":1},{"color":"#00000000","scale":1.4,"zoom":2},{"color":"#00000000","scale":1.4,"zoom":3},{"color":"#00000000","scale":1.4,"zoom":4},{"color":"#00000000","scale":1.4,"zoom":5},{"color":"#00000000","scale":3.05,"zoom":6},{"color":"#00000000","scale":3.05,"zoom":7},{"color":"#d6ccff","scale":3.15,"zoom":8},{"color":"#ded6ff","scale":3.37,"zoom":9},{"color":"#ded6ff","scale":3.36,"zoom":10},{"color":"#ded6ff","scale":3.17,"zoom":11},{"color":"#ded6ff","scale":3,"zoom":12},{"color":"#ded6ff","scale":2.8,"zoom":13},{"color":"#e7e0ff","scale":2.66,"zoom":14},{"color":"#e7e0ff","scale":2.61,"zoom":15},{"color":"#eae4ff","scale":2.64,"zoom":16},{"color":"#ede8ff","scale":2.14,"zoom":17},{"color":"#f0ecff","scale":1.79,"zoom":18},{"color":"#f3f0ff","scale":1.55,"zoom":19},{"color":"#f5f2ff","scale":1.41,"zoom":20},{"color":"#f7f5ff","scale":1.35,"zoom":21}]},{"tags":{"any":"road_2","none":"is_tunnel"},"elements":"geometry.fill","stylers":[{"color":"#ffffff"},{"scale":0,"zoom":0},{"scale":0,"zoom":1},{"scale":0,"zoom":2},{"scale":0,"zoom":3},{"scale":0,"zoom":4},{"scale":0,"zoom":5},{"scale":2.97,"zoom":6},{"scale":3.19,"zoom":7},{"scale":3.53,"zoom":8},{"scale":4,"zoom":9},{"scale":3.61,"zoom":10},{"scale":3.06,"zoom":11},{"scale":2.64,"zoom":12},{"scale":2.27,"zoom":13},{"scale":2.03,"zoom":14},{"scale":1.9,"zoom":15},{"scale":1.86,"zoom":16},{"scale":1.48,"zoom":17},{"scale":1.21,"zoom":18},{"scale":1.04,"zoom":19},{"scale":0.94,"zoom":20},{"scale":0.9,"zoom":21}]},{"tags":{"any":"road_2"},"elements":"geometry.outline","stylers":[{"color":"#00000000","scale":1.4,"zoom":0},{"color":"#00000000","scale":1.4,"zoom":1},{"color":"#00000000","scale":1.4,"zoom":2},{"color":"#00000000","scale":1.4,"zoom":3},{"color":"#00000000","scale":1.4,"zoom":4},{"color":"#00000000","scale":1.4,"zoom":5},{"color":"#00000000","scale":3.05,"zoom":6},{"color":"#00000000","scale":3.05,"zoom":7},{"color":"#d6ccff","scale":3.15,"zoom":8},{"color":"#ded6ff","scale":3.37,"zoom":9},{"color":"#ded6ff","scale":3.36,"zoom":10},{"color":"#ded6ff","scale":3.17,"zoom":11},{"color":"#ded6ff","scale":3,"zoom":12},{"color":"#ded6ff","scale":2.8,"zoom":13},{"color":"#e7e0ff","scale":2.66,"zoom":14},{"color":"#e7e0ff","scale":2.61,"zoom":15},{"color":"#eae4ff","scale":2.64,"zoom":16},{"color":"#ede8ff","scale":2.14,"zoom":17},{"color":"#f0ecff","scale":1.79,"zoom":18},{"color":"#f3f0ff","scale":1.55,"zoom":19},{"color":"#f5f2ff","scale":1.41,"zoom":20},{"color":"#f7f5ff","scale":1.35,"zoom":21}]},{"tags":{"any":"road_3","none":"is_tunnel"},"elements":"geometry.fill","stylers":[{"color":"#ffffff"},{"scale":0,"zoom":0},{"scale":0,"zoom":1},{"scale":0,"zoom":2},{"scale":0,"zoom":3},{"scale":0,"zoom":4},{"scale":0,"zoom":5},{"scale":0,"zoom":6},{"scale":0,"zoom":7},{"scale":0,"zoom":8},{"scale":2.51,"zoom":9},{"scale":2.62,"zoom":10},{"scale":1.68,"zoom":11},{"scale":1.67,"zoom":12},{"scale":1.38,"zoom":13},{"scale":1.19,"zoom":14},{"scale":1.08,"zoom":15},{"scale":1.04,"zoom":16},{"scale":0.91,"zoom":17},{"scale":0.84,"zoom":18},{"scale":0.82,"zoom":19},{"scale":0.84,"zoom":20},{"scale":0.9,"zoom":21}]},{"tags":{"any":"road_3"},"elements":"geometry.outline","stylers":[{"color":"#ffffff","scale":1.6,"zoom":0},{"color":"#ffffff","scale":1.6,"zoom":1},{"color":"#ffffff","scale":1.6,"zoom":2},{"color":"#ffffff","scale":1.6,"zoom":3},{"color":"#ffffff","scale":1.6,"zoom":4},{"color":"#ffffff","scale":1.6,"zoom":5},{"color":"#ffffff","scale":1.6,"zoom":6},{"color":"#ffffff","scale":1.6,"zoom":7},{"color":"#ffffff","scale":1.29,"zoom":8},{"color":"#ded6ff","scale":4.21,"zoom":9},{"color":"#ded6ff","scale":2.74,"zoom":10},{"color":"#ded6ff","scale":2.04,"zoom":11},{"color":"#ded6ff","scale":2.13,"zoom":12},{"color":"#ded6ff","scale":1.88,"zoom":13},{"color":"#e7e0ff","scale":1.7,"zoom":14},{"color":"#e7e0ff","scale":1.59,"zoom":15},{"color":"#eae4ff","scale":1.55,"zoom":16},{"color":"#ede8ff","scale":1.37,"zoom":17},{"color":"#f0ecff","scale":1.27,"zoom":18},{"color":"#f3f0ff","scale":1.23,"zoom":19},{"color":"#f5f2ff","scale":1.26,"zoom":20},{"color":"#f7f5ff","scale":1.35,"zoom":21}]},{"tags":{"any":"road_4","none":"is_tunnel"},"elements":"geometry.fill","stylers":[{"color":"#ffffff"},{"scale":0,"zoom":0},{"scale":0,"zoom":1},{"scale":0,"zoom":2},{"scale":0,"zoom":3},{"scale":0,"zoom":4},{"scale":0,"zoom":5},{"scale":0,"zoom":6},{"scale":0,"zoom":7},{"scale":0,"zoom":8},{"scale":0,"zoom":9},{"scale":1.69,"zoom":10},{"scale":1.26,"zoom":11},{"scale":1.41,"zoom":12},{"scale":1.19,"zoom":13},{"scale":1.04,"zoom":14},{"scale":0.97,"zoom":15},{"scale":1.15,"zoom":16},{"scale":0.99,"zoom":17},{"scale":0.89,"zoom":18},{"scale":0.85,"zoom":19},{"scale":0.85,"zoom":20},{"scale":0.9,"zoom":21}]},{"tags":{"any":"road_4"},"elements":"geometry.outline","stylers":[{"color":"#ffffff","scale":1.4,"zoom":0},{"color":"#ffffff","scale":1.4,"zoom":1},{"color":"#ffffff","scale":1.4,"zoom":2},{"color":"#ffffff","scale":1.4,"zoom":3},{"color":"#ffffff","scale":1.4,"zoom":4},{"color":"#ffffff","scale":1.4,"zoom":5},{"color":"#ffffff","scale":1.4,"zoom":6},{"color":"#ffffff","scale":1.4,"zoom":7},{"color":"#ffffff","scale":1.4,"zoom":8},{"color":"#ffffff","scale":1.12,"zoom":9},{"color":"#ded6ff","scale":1.9,"zoom":10},{"color":"#ded6ff","scale":1.62,"zoom":11},{"color":"#ded6ff","scale":1.83,"zoom":12},{"color":"#ded6ff","scale":1.64,"zoom":13},{"color":"#e7e0ff","scale":1.51,"zoom":14},{"color":"#e7e0ff","scale":1.44,"zoom":15},{"color":"#eae4ff","scale":1.69,"zoom":16},{"color":"#ede8ff","scale":1.47,"zoom":17},{"color":"#f0ecff","scale":1.34,"zoom":18},{"color":"#f3f0ff","scale":1.28,"zoom":19},{"color":"#f5f2ff","scale":1.28,"zoom":20},{"color":"#f7f5ff","scale":1.34,"zoom":21}]},{"tags":{"any":"road_5","none":"is_tunnel"},"elements":"geometry.fill","stylers":[{"color":"#ffffff"},{"scale":0,"zoom":0},{"scale":0,"zoom":1},{"scale":0,"zoom":2},{"scale":0,"zoom":3},{"scale":0,"zoom":4},{"scale":0,"zoom":5},{"scale":0,"zoom":6},{"scale":0,"zoom":7},{"scale":0,"zoom":8},{"scale":0,"zoom":9},{"scale":0,"zoom":10},{"scale":0,"zoom":11},{"scale":1.25,"zoom":12},{"scale":0.95,"zoom":13},{"scale":0.81,"zoom":14},{"scale":0.95,"zoom":15},{"scale":1.1,"zoom":16},{"scale":0.93,"zoom":17},{"scale":0.85,"zoom":18},{"scale":0.82,"zoom":19},{"scale":0.84,"zoom":20},{"scale":0.9,"zoom":21}]},{"tags":{"any":"road_5"},"elements":"geometry.outline","stylers":[{"color":"#ffffff","scale":1.4,"zoom":0},{"color":"#ffffff","scale":1.4,"zoom":1},{"color":"#ffffff","scale":1.4,"zoom":2},{"color":"#ffffff","scale":1.4,"zoom":3},{"color":"#ffffff","scale":1.4,"zoom":4},{"color":"#ffffff","scale":1.4,"zoom":5},{"color":"#ffffff","scale":1.4,"zoom":6},{"color":"#ffffff","scale":1.4,"zoom":7},{"color":"#ffffff","scale":1.4,"zoom":8},{"color":"#ffffff","scale":1.4,"zoom":9},{"color":"#ffffff","scale":1.4,"zoom":10},{"color":"#ffffff","scale":0.62,"zoom":11},{"color":"#ded6ff","scale":1.61,"zoom":12},{"color":"#ded6ff","scale":1.36,"zoom":13},{"color":"#e7e0ff","scale":1.22,"zoom":14},{"color":"#e7e0ff","scale":1.41,"zoom":15},{"color":"#eae4ff","scale":1.63,"zoom":16},{"color":"#ede8ff","scale":1.4,"zoom":17},{"color":"#f0ecff","scale":1.27,"zoom":18},{"color":"#f3f0ff","scale":1.23,"zoom":19},{"color":"#f5f2ff","scale":1.25,"zoom":20},{"color":"#f7f5ff","scale":1.34,"zoom":21}]},{"tags":{"any":"road_6","none":"is_tunnel"},"elements":"geometry.fill","stylers":[{"color":"#ffffff"},{"scale":0,"zoom":0},{"scale":0,"zoom":1},{"scale":0,"zoom":2},{"scale":0,"zoom":3},{"scale":0,"zoom":4},{"scale":0,"zoom":5},{"scale":0,"zoom":6},{"scale":0,"zoom":7},{"scale":0,"zoom":8},{"scale":0,"zoom":9},{"scale":0,"zoom":10},{"scale":0,"zoom":11},{"scale":0,"zoom":12},{"scale":2.25,"zoom":13},{"scale":1.27,"zoom":14},{"scale":1.25,"zoom":15},{"scale":1.31,"zoom":16},{"scale":1.04,"zoom":17},{"scale":0.9,"zoom":18},{"scale":0.85,"zoom":19},{"scale":0.85,"zoom":20},{"scale":0.9,"zoom":21}]},{"tags":{"any":"road_6"},"elements":"geometry.outline","stylers":[{"color":"#ffffff","scale":1.4,"zoom":0},{"color":"#ffffff","scale":1.4,"zoom":1},{"color":"#ffffff","scale":1.4,"zoom":2},{"color":"#ffffff","scale":1.4,"zoom":3},{"color":"#ffffff","scale":1.4,"zoom":4},{"color":"#ffffff","scale":1.4,"zoom":5},{"color":"#ffffff","scale":1.4,"zoom":6},{"color":"#ffffff","scale":1.4,"zoom":7},{"color":"#ffffff","scale":1.4,"zoom":8},{"color":"#ffffff","scale":1.4,"zoom":9},{"color":"#ffffff","scale":1.4,"zoom":10},{"color":"#ffffff","scale":1.4,"zoom":11},{"color":"#ffffff","scale":1.4,"zoom":12},{"color":"#ded6ff","scale":2.31,"zoom":13},{"color":"#e7e0ff","scale":1.7,"zoom":14},{"color":"#e7e0ff","scale":1.76,"zoom":15},{"color":"#eae4ff","scale":1.89,"zoom":16},{"color":"#ede8ff","scale":1.55,"zoom":17},{"color":"#f0ecff","scale":1.36,"zoom":18},{"color":"#f3f0ff","scale":1.27,"zoom":19},{"color":"#f5f2ff","scale":1.27,"zoom":20},{"color":"#f7f5ff","scale":1.34,"zoom":21}]},{"tags":{"any":"road_7","none":"is_tunnel"},"elements":"geometry.fill","stylers":[{"color":"#ffffff"},{"scale":0,"zoom":0},{"scale":0,"zoom":1},{"scale":0,"zoom":2},{"scale":0,"zoom":3},{"scale":0,"zoom":4},{"scale":0,"zoom":5},{"scale":0,"zoom":6},{"scale":0,"zoom":7},{"scale":0,"zoom":8},{"scale":0,"zoom":9},{"scale":0,"zoom":10},{"scale":0,"zoom":11},{"scale":0,"zoom":12},{"scale":0,"zoom":13},{"scale":0.9,"zoom":14},{"scale":0.78,"zoom":15},{"scale":0.88,"zoom":16},{"scale":0.8,"zoom":17},{"scale":0.78,"zoom":18},{"scale":0.79,"zoom":19},{"scale":0.83,"zoom":20},{"scale":0.9,"zoom":21}]},{"tags":{"any":"road_7"},"elements":"geometry.outline","stylers":[{"color":"#ffffff","scale":1.4,"zoom":0},{"color":"#ffffff","scale":1.4,"zoom":1},{"color":"#ffffff","scale":1.4,"zoom":2},{"color":"#ffffff","scale":1.4,"zoom":3},{"color":"#ffffff","scale":1.4,"zoom":4},{"color":"#ffffff","scale":1.4,"zoom":5},{"color":"#ffffff","scale":1.4,"zoom":6},{"color":"#ffffff","scale":1.4,"zoom":7},{"color":"#ffffff","scale":1.4,"zoom":8},{"color":"#ffffff","scale":1.4,"zoom":9},{"color":"#ffffff","scale":1.4,"zoom":10},{"color":"#ffffff","scale":1.4,"zoom":11},{"color":"#ffffff","scale":1.4,"zoom":12},{"color":"#ffffff","scale":1.4,"zoom":13},{"color":"#e7e0ff","scale":1.31,"zoom":14},{"color":"#e7e0ff","scale":1.19,"zoom":15},{"color":"#eae4ff","scale":1.31,"zoom":16},{"color":"#ede8ff","scale":1.21,"zoom":17},{"color":"#f0ecff","scale":1.17,"zoom":18},{"color":"#f3f0ff","scale":1.18,"zoom":19},{"color":"#f5f2ff","scale":1.23,"zoom":20},{"color":"#f7f5ff","scale":1.33,"zoom":21}]},{"tags":{"any":"road_minor","none":"is_tunnel"},"elements":"geometry.fill","stylers":[{"color":"#ffffff"},{"scale":0,"zoom":0},{"scale":0,"zoom":1},{"scale":0,"zoom":2},{"scale":0,"zoom":3},{"scale":0,"zoom":4},{"scale":0,"zoom":5},{"scale":0,"zoom":6},{"scale":0,"zoom":7},{"scale":0,"zoom":8},{"scale":0,"zoom":9},{"scale":0,"zoom":10},{"scale":0,"zoom":11},{"scale":0,"zoom":12},{"scale":0,"zoom":13},{"scale":0,"zoom":14},{"scale":0,"zoom":15},{"scale":0.9,"zoom":16},{"scale":0.9,"zoom":17},{"scale":0.9,"zoom":18},{"scale":0.9,"zoom":19},{"scale":0.9,"zoom":20},{"scale":0.9,"zoom":21}]},{"tags":{"any":"road_minor"},"elements":"geometry.outline","stylers":[{"color":"#ffffff","scale":0.4,"zoom":0},{"color":"#ffffff","scale":0.4,"zoom":1},{"color":"#ffffff","scale":0.4,"zoom":2},{"color":"#ffffff","scale":0.4,"zoom":3},{"color":"#ffffff","scale":0.4,"zoom":4},{"color":"#ffffff","scale":0.4,"zoom":5},{"color":"#ffffff","scale":0.4,"zoom":6},{"color":"#ffffff","scale":0.4,"zoom":7},{"color":"#ffffff","scale":0.4,"zoom":8},{"color":"#ffffff","scale":0.4,"zoom":9},{"color":"#ffffff","scale":0.4,"zoom":10},{"color":"#ffffff","scale":0.4,"zoom":11},{"color":"#ffffff","scale":0.4,"zoom":12},{"color":"#ffffff","scale":0.4,"zoom":13},{"color":"#e7e0ff","scale":0.4,"zoom":14},{"color":"#e7e0ff","scale":0.4,"zoom":15},{"color":"#eae4ff","scale":1.4,"zoom":16},{"color":"#ede8ff","scale":1.27,"zoom":17},{"color":"#f0ecff","scale":1.27,"zoom":18},{"color":"#f3f0ff","scale":1.29,"zoom":19},{"color":"#f5f2ff","scale":1.31,"zoom":20},{"color":"#f7f5ff","scale":1.32,"zoom":21}]},{"tags":{"any":"road_unclassified","none":"is_tunnel"},"elements":"geometry.fill","stylers":[{"color":"#ffffff"},{"scale":0,"zoom":0},{"scale":0,"zoom":1},{"scale":0,"zoom":2},{"scale":0,"zoom":3},{"scale":0,"zoom":4},{"scale":0,"zoom":5},{"scale":0,"zoom":6},{"scale":0,"zoom":7},{"scale":0,"zoom":8},{"scale":0,"zoom":9},{"scale":0,"zoom":10},{"scale":0,"zoom":11},{"scale":0,"zoom":12},{"scale":0,"zoom":13},{"scale":0,"zoom":14},{"scale":0,"zoom":15},{"scale":0.9,"zoom":16},{"scale":0.9,"zoom":17},{"scale":0.9,"zoom":18},{"scale":0.9,"zoom":19},{"scale":0.9,"zoom":20},{"scale":0.9,"zoom":21}]},{"tags":{"any":"road_unclassified"},"elements":"geometry.outline","stylers":[{"color":"#ffffff","scale":0.4,"zoom":0},{"color":"#ffffff","scale":0.4,"zoom":1},{"color":"#ffffff","scale":0.4,"zoom":2},{"color":"#ffffff","scale":0.4,"zoom":3},{"color":"#ffffff","scale":0.4,"zoom":4},{"color":"#ffffff","scale":0.4,"zoom":5},{"color":"#ffffff","scale":0.4,"zoom":6},{"color":"#ffffff","scale":0.4,"zoom":7},{"color":"#ffffff","scale":0.4,"zoom":8},{"color":"#ffffff","scale":0.4,"zoom":9},{"color":"#ffffff","scale":0.4,"zoom":10},{"color":"#ffffff","scale":0.4,"zoom":11},{"color":"#ffffff","scale":0.4,"zoom":12},{"color":"#ffffff","scale":0.4,"zoom":13},{"color":"#e7e0ff","scale":0.4,"zoom":14},{"color":"#e7e0ff","scale":0.4,"zoom":15},{"color":"#eae4ff","scale":1.4,"zoom":16},{"color":"#ede8ff","scale":1.27,"zoom":17},{"color":"#f0ecff","scale":1.27,"zoom":18},{"color":"#f3f0ff","scale":1.29,"zoom":19},{"color":"#f5f2ff","scale":1.31,"zoom":20},{"color":"#f7f5ff","scale":1.32,"zoom":21}]},{"tags":{"all":"is_tunnel","none":"path"},"elements":"geometry.fill","stylers":[{"color":"#d6ccff","zoom":0},{"color":"#d6ccff","zoom":1},{"color":"#d6ccff","zoom":2},{"color":"#d6ccff","zoom":3},{"color":"#d6ccff","zoom":4},{"color":"#d6ccff","zoom":5},{"color":"#d6ccff","zoom":6},{"color":"#d6ccff","zoom":7},{"color":"#d6ccff","zoom":8},{"color":"#d6ccff","zoom":9},{"color":"#d6ccff","zoom":10},{"color":"#d6ccff","zoom":11},{"color":"#d6ccff","zoom":12},{"color":"#d6ccff","zoom":13},{"color":"#ded6ff","zoom":14},{"color":"#e7e0ff","zoom":15},{"color":"#e8e2ff","zoom":16},{"color":"#eae4ff","zoom":17},{"color":"#ebe5ff","zoom":18},{"color":"#ece7ff","zoom":19},{"color":"#eee9ff","zoom":20},{"color":"#efebff","zoom":21}]},{"tags":{"all":"path","none":"is_tunnel"},"elements":"geometry.fill","stylers":[{"color":"#9980ff"}]},{"tags":{"all":"path","none":"is_tunnel"},"elements":"geometry.outline","stylers":[{"opacity":0.7},{"color":"#ded6ff","zoom":0},{"color":"#ded6ff","zoom":1},{"color":"#ded6ff","zoom":2},{"color":"#ded6ff","zoom":3},{"color":"#ded6ff","zoom":4},{"color":"#ded6ff","zoom":5},{"color":"#ded6ff","zoom":6},{"color":"#ded6ff","zoom":7},{"color":"#ded6ff","zoom":8},{"color":"#ded6ff","zoom":9},{"color":"#ded6ff","zoom":10},{"color":"#ded6ff","zoom":11},{"color":"#ded6ff","zoom":12},{"color":"#ded6ff","zoom":13},{"color":"#e6e0ff","zoom":14},{"color":"#efebff","zoom":15},{"color":"#f0edff","zoom":16},{"color":"#f2eeff","zoom":17},{"color":"#f3f0ff","zoom":18},{"color":"#f4f2ff","zoom":19},{"color":"#f6f3ff","zoom":20},{"color":"#f7f5ff","zoom":21}]},{"tags":"road_construction","elements":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"tags":"road_construction","elements":"geometry.outline","stylers":[{"color":"#c2b3ff","zoom":0},{"color":"#c2b3ff","zoom":1},{"color":"#c2b3ff","zoom":2},{"color":"#c2b3ff","zoom":3},{"color":"#c2b3ff","zoom":4},{"color":"#c2b3ff","zoom":5},{"color":"#c2b3ff","zoom":6},{"color":"#c2b3ff","zoom":7},{"color":"#c2b3ff","zoom":8},{"color":"#c2b3ff","zoom":9},{"color":"#c2b3ff","zoom":10},{"color":"#c2b3ff","zoom":11},{"color":"#c2b3ff","zoom":12},{"color":"#c2b3ff","zoom":13},{"color":"#9980ff","zoom":14},{"color":"#c2b3ff","zoom":15},{"color":"#c9bbff","zoom":16},{"color":"#d0c4ff","zoom":17},{"color":"#d6ccff","zoom":18},{"color":"#ddd4ff","zoom":19},{"color":"#e4ddff","zoom":20},{"color":"#ebe5ff","zoom":21}]},{"tags":{"any":"ferry"},"stylers":[{"color":"#896bff"}]},{"tags":"transit_location","elements":"label.icon","stylers":[{"hue":"#8161ff"},{"saturation":0}]},{"tags":"transit_location","elements":"label.text.fill","stylers":[{"color":"#887ab8"}]},{"tags":"transit_location","elements":"label.text.outline","stylers":[{"color":"#ffffff"}]},{"tags":"transit_schema","elements":"geometry.fill","stylers":[{"color":"#887ab8"},{"scale":0.7},{"opacity":0.6,"zoom":0},{"opacity":0.6,"zoom":1},{"opacity":0.6,"zoom":2},{"opacity":0.6,"zoom":3},{"opacity":0.6,"zoom":4},{"opacity":0.6,"zoom":5},{"opacity":0.6,"zoom":6},{"opacity":0.6,"zoom":7},{"opacity":0.6,"zoom":8},{"opacity":0.6,"zoom":9},{"opacity":0.6,"zoom":10},{"opacity":0.6,"zoom":11},{"opacity":0.6,"zoom":12},{"opacity":0.6,"zoom":13},{"opacity":0.6,"zoom":14},{"opacity":0.5,"zoom":15},{"opacity":0.4,"zoom":16},{"opacity":0.4,"zoom":17},{"opacity":0.4,"zoom":18},{"opacity":0.4,"zoom":19},{"opacity":0.4,"zoom":20},{"opacity":0.4,"zoom":21}]},{"tags":"transit_schema","elements":"geometry.outline","stylers":[{"opacity":0}]},{"tags":"transit_line","elements":"geometry.fill.pattern","stylers":[{"color":"#aaa3c2"},{"opacity":0,"zoom":0},{"opacity":0,"zoom":1},{"opacity":0,"zoom":2},{"opacity":0,"zoom":3},{"opacity":0,"zoom":4},{"opacity":0,"zoom":5},{"opacity":0,"zoom":6},{"opacity":0,"zoom":7},{"opacity":0,"zoom":8},{"opacity":0,"zoom":9},{"opacity":0,"zoom":10},{"opacity":0,"zoom":11},{"opacity":0,"zoom":12},{"opacity":1,"zoom":13},{"opacity":1,"zoom":14},{"opacity":1,"zoom":15},{"opacity":1,"zoom":16},{"opacity":1,"zoom":17},{"opacity":1,"zoom":18},{"opacity":1,"zoom":19},{"opacity":1,"zoom":20},{"opacity":1,"zoom":21}]},{"tags":"transit_line","elements":"geometry.fill","stylers":[{"color":"#aaa3c2"},{"scale":0.4},{"opacity":0,"zoom":0},{"opacity":0,"zoom":1},{"opacity":0,"zoom":2},{"opacity":0,"zoom":3},{"opacity":0,"zoom":4},{"opacity":0,"zoom":5},{"opacity":0,"zoom":6},{"opacity":0,"zoom":7},{"opacity":0,"zoom":8},{"opacity":0,"zoom":9},{"opacity":0,"zoom":10},{"opacity":0,"zoom":11},{"opacity":0,"zoom":12},{"opacity":1,"zoom":13},{"opacity":1,"zoom":14},{"opacity":1,"zoom":15},{"opacity":1,"zoom":16},{"opacity":1,"zoom":17},{"opacity":1,"zoom":18},{"opacity":1,"zoom":19},{"opacity":1,"zoom":20},{"opacity":1,"zoom":21}]},{"tags":"water","elements":"geometry","stylers":[{"color":"#b19eff","zoom":0},{"color":"#b19eff","zoom":1},{"color":"#b19eff","zoom":2},{"color":"#b19eff","zoom":3},{"color":"#b19eff","zoom":4},{"color":"#b19eff","zoom":5},{"color":"#b19eff","zoom":6},{"color":"#b19eff","zoom":7},{"color":"#b4a1ff","zoom":8},{"color":"#b7a5ff","zoom":9},{"color":"#baa8ff","zoom":10},{"color":"#bbaaff","zoom":11},{"color":"#bdabff","zoom":12},{"color":"#beadff","zoom":13},{"color":"#c0b0ff","zoom":14},{"color":"#c2b2ff","zoom":15},{"color":"#c4b5ff","zoom":16},{"color":"#c6b7ff","zoom":17},{"color":"#c8baff","zoom":18},{"color":"#cabdff","zoom":19},{"color":"#ccbfff","zoom":20},{"color":"#cec2ff","zoom":21}]},{"tags":"water","elements":"geometry","types":"polyline","stylers":[{"opacity":0.4,"zoom":0},{"opacity":0.4,"zoom":1},{"opacity":0.4,"zoom":2},{"opacity":0.4,"zoom":3},{"opacity":0.6,"zoom":4},{"opacity":0.8,"zoom":5},{"opacity":1,"zoom":6},{"opacity":1,"zoom":7},{"opacity":1,"zoom":8},{"opacity":1,"zoom":9},{"opacity":1,"zoom":10},{"opacity":1,"zoom":11},{"opacity":1,"zoom":12},{"opacity":1,"zoom":13},{"opacity":1,"zoom":14},{"opacity":1,"zoom":15},{"opacity":1,"zoom":16},{"opacity":1,"zoom":17},{"opacity":1,"zoom":18},{"opacity":1,"zoom":19},{"opacity":1,"zoom":20},{"opacity":1,"zoom":21}]},{"tags":"bathymetry","elements":"geometry","stylers":[{"hue":"#b19eff"}]},{"tags":{"any":["industrial","construction_site"]},"elements":"geometry","stylers":[{"color":"#d6ccff","zoom":0},{"color":"#d6ccff","zoom":1},{"color":"#d6ccff","zoom":2},{"color":"#d6ccff","zoom":3},{"color":"#d6ccff","zoom":4},{"color":"#d6ccff","zoom":5},{"color":"#d6ccff","zoom":6},{"color":"#d6ccff","zoom":7},{"color":"#d6ccff","zoom":8},{"color":"#d6ccff","zoom":9},{"color":"#d6ccff","zoom":10},{"color":"#d6ccff","zoom":11},{"color":"#d6ccff","zoom":12},{"color":"#d6ccff","zoom":13},{"color":"#ded6ff","zoom":14},{"color":"#e7e0ff","zoom":15},{"color":"#e8e2ff","zoom":16},{"color":"#eae4ff","zoom":17},{"color":"#ebe5ff","zoom":18},{"color":"#ece7ff","zoom":19},{"color":"#eee9ff","zoom":20},{"color":"#efebff","zoom":21}]},{"tags":{"any":"transit","none":["transit_location","transit_line","transit_schema","is_unclassified_transit"]},"elements":"geometry","stylers":[{"color":"#d6ccff","zoom":0},{"color":"#d6ccff","zoom":1},{"color":"#d6ccff","zoom":2},{"color":"#d6ccff","zoom":3},{"color":"#d6ccff","zoom":4},{"color":"#d6ccff","zoom":5},{"color":"#d6ccff","zoom":6},{"color":"#d6ccff","zoom":7},{"color":"#d6ccff","zoom":8},{"color":"#d6ccff","zoom":9},{"color":"#d6ccff","zoom":10},{"color":"#d6ccff","zoom":11},{"color":"#d6ccff","zoom":12},{"color":"#d6ccff","zoom":13},{"color":"#ded6ff","zoom":14},{"color":"#e7e0ff","zoom":15},{"color":"#e8e2ff","zoom":16},{"color":"#eae4ff","zoom":17},{"color":"#ebe5ff","zoom":18},{"color":"#ece7ff","zoom":19},{"color":"#eee9ff","zoom":20},{"color":"#efebff","zoom":21}]},{"tags":"fence","elements":"geometry.fill","stylers":[{"color":"#c6b8ff"},{"opacity":0.75,"zoom":0},{"opacity":0.75,"zoom":1},{"opacity":0.75,"zoom":2},{"opacity":0.75,"zoom":3},{"opacity":0.75,"zoom":4},{"opacity":0.75,"zoom":5},{"opacity":0.75,"zoom":6},{"opacity":0.75,"zoom":7},{"opacity":0.75,"zoom":8},{"opacity":0.75,"zoom":9},{"opacity":0.75,"zoom":10},{"opacity":0.75,"zoom":11},{"opacity":0.75,"zoom":12},{"opacity":0.75,"zoom":13},{"opacity":0.75,"zoom":14},{"opacity":0.75,"zoom":15},{"opacity":0.75,"zoom":16},{"opacity":0.45,"zoom":17},{"opacity":0.45,"zoom":18},{"opacity":0.45,"zoom":19},{"opacity":0.45,"zoom":20},{"opacity":0.45,"zoom":21}]},{"tags":"medical","elements":"geometry","stylers":[{"color":"#d6ccff","zoom":0},{"color":"#d6ccff","zoom":1},{"color":"#d6ccff","zoom":2},{"color":"#d6ccff","zoom":3},{"color":"#d6ccff","zoom":4},{"color":"#d6ccff","zoom":5},{"color":"#d6ccff","zoom":6},{"color":"#d6ccff","zoom":7},{"color":"#d6ccff","zoom":8},{"color":"#d6ccff","zoom":9},{"color":"#d6ccff","zoom":10},{"color":"#d6ccff","zoom":11},{"color":"#d6ccff","zoom":12},{"color":"#d6ccff","zoom":13},{"color":"#ded6ff","zoom":14},{"color":"#e7e0ff","zoom":15},{"color":"#e8e2ff","zoom":16},{"color":"#eae4ff","zoom":17},{"color":"#ebe5ff","zoom":18},{"color":"#ece7ff","zoom":19},{"color":"#eee9ff","zoom":20},{"color":"#efebff","zoom":21}]},{"tags":"beach","elements":"geometry","stylers":[{"color":"#d6ccff","opacity":0.3,"zoom":0},{"color":"#d6ccff","opacity":0.3,"zoom":1},{"color":"#d6ccff","opacity":0.3,"zoom":2},{"color":"#d6ccff","opacity":0.3,"zoom":3},{"color":"#d6ccff","opacity":0.3,"zoom":4},{"color":"#d6ccff","opacity":0.3,"zoom":5},{"color":"#d6ccff","opacity":0.3,"zoom":6},{"color":"#d6ccff","opacity":0.3,"zoom":7},{"color":"#d6ccff","opacity":0.3,"zoom":8},{"color":"#d6ccff","opacity":0.3,"zoom":9},{"color":"#d6ccff","opacity":0.3,"zoom":10},{"color":"#d6ccff","opacity":0.3,"zoom":11},{"color":"#d6ccff","opacity":0.3,"zoom":12},{"color":"#d6ccff","opacity":0.65,"zoom":13},{"color":"#ded6ff","opacity":1,"zoom":14},{"color":"#e7e0ff","opacity":1,"zoom":15},{"color":"#e8e2ff","opacity":1,"zoom":16},{"color":"#eae4ff","opacity":1,"zoom":17},{"color":"#ebe5ff","opacity":1,"zoom":18},{"color":"#ece7ff","opacity":1,"zoom":19},{"color":"#eee9ff","opacity":1,"zoom":20},{"color":"#efebff","opacity":1,"zoom":21}]},{"tags":{"all":["is_tunnel","path"]},"elements":"geometry.fill","stylers":[{"color":"#9175ff"},{"opacity":0.3}]},{"tags":{"all":["is_tunnel","path"]},"elements":"geometry.outline","stylers":[{"opacity":0}]},{"tags":"road_limited","elements":"geometry.fill","stylers":[{"color":"#ad99ff"},{"scale":0,"zoom":0},{"scale":0,"zoom":1},{"scale":0,"zoom":2},{"scale":0,"zoom":3},{"scale":0,"zoom":4},{"scale":0,"zoom":5},{"scale":0,"zoom":6},{"scale":0,"zoom":7},{"scale":0,"zoom":8},{"scale":0,"zoom":9},{"scale":0,"zoom":10},{"scale":0,"zoom":11},{"scale":0,"zoom":12},{"scale":0.1,"zoom":13},{"scale":0.2,"zoom":14},{"scale":0.3,"zoom":15},{"scale":0.5,"zoom":16},{"scale":0.6,"zoom":17},{"scale":0.7,"zoom":18},{"scale":0.79,"zoom":19},{"scale":0.83,"zoom":20},{"scale":0.9,"zoom":21}]},{"tags":"road_limited","elements":"geometry.outline","stylers":[{"color":"#ffffff","scale":1.4,"zoom":0},{"color":"#ffffff","scale":1.4,"zoom":1},{"color":"#ffffff","scale":1.4,"zoom":2},{"color":"#ffffff","scale":1.4,"zoom":3},{"color":"#ffffff","scale":1.4,"zoom":4},{"color":"#ffffff","scale":1.4,"zoom":5},{"color":"#ffffff","scale":1.4,"zoom":6},{"color":"#ffffff","scale":1.4,"zoom":7},{"color":"#ffffff","scale":1.4,"zoom":8},{"color":"#ffffff","scale":1.4,"zoom":9},{"color":"#ffffff","scale":1.4,"zoom":10},{"color":"#ffffff","scale":1.4,"zoom":11},{"color":"#ffffff","scale":1.4,"zoom":12},{"color":"#ffffff","scale":0.1,"zoom":13},{"color":"#e7e0ff","scale":0.2,"zoom":14},{"color":"#e7e0ff","scale":0.3,"zoom":15},{"color":"#eae4ff","scale":0.5,"zoom":16},{"color":"#ede8ff","scale":0.6,"zoom":17},{"color":"#f0ecff","scale":0.7,"zoom":18},{"color":"#f3f0ff","scale":1.18,"zoom":19},{"color":"#f5f2ff","scale":1.23,"zoom":20},{"color":"#f7f5ff","scale":1.33,"zoom":21}]},{"tags":{"any":["urban_area","locality"]},"elements":"geometry","stylers":{"visibility":"off"}},{"tags":{"any":["terrain","bathymetry","landscape"],"none":"land"},"stylers":{"visibility":"off"}},{"tags":{"any":["park","cemetery"]},"stylers":{"visibility":"off"}},{"tags":{"any":["vegetation"]},"stylers":{"visibility":"off"}},{"tags":{"any":["industrial","construction_site","medical","sports_ground","beach"]},"types":"polygon","stylers":{"visibility":"off"}},{"tags":{"any":"transit","none":["transit_location","transit_line","transit_schema","is_unclassified_transit"]},"stylers":{"visibility":"off"}},{"tags":{"any":"urban_area","none":["residential","industrial","cemetery","park","medical","sports_ground","beach","construction_site"]},"stylers":{"visibility":"off"}},{"tags":{"any":["outdoor","park","cemetery","medical"]},"elements":"label","stylers":{"visibility":"off"}},{"tags":{"any":"poi","none":["outdoor","park","cemetery","medical"]},"stylers":{"visibility":"off"}},{"tags":{"any":"road"},"types":"point","stylers":{"visibility":"off"}},{"tags":{"any":["food_and_drink","shopping","commercial_services"]},"stylers":{"visibility":"off"}},{"tags":{"any":["traffic_light"]},"stylers":{"visibility":"off"}},{"tags":{"any":["entrance"]},"stylers":{"visibility":"off"}},{"tags":{"any":["road"],"none":["road_1","road_2","road_3","road_4","road_5","road_6","road_7"]},"elements":"label.icon","stylers":{"visibility":"off"}},{"tags":{"any":["region","road_1","road_2","road_3","road_4"]},"elements":"label","stylers":{"visibility":"off"}},{"tags":{"any":["district"]},"elements":"label","stylers":{"visibility":"off"}},{"tags":{"any":"admin","none":["country","region","locality","district","address"]},"elements":"label","stylers":{"visibility":"off"}},{"tags":{"any":["road_5","road_6"]},"elements":"label","stylers":{"visibility":"off"}},{"tags":{"any":["address","road_7","road_limited","road_unclassified","road_minor","road_construction","path"]},"elements":"label","stylers":{"visibility":"off"}},{"tags":{"any":["transit"]},"stylers":{"visibility":"off"}},{"tags":{"any":"landcover","none":"vegetation"},"stylers":{"visibility":"off"}}];

  // SVG иконка чемодана
  const SUITCASE_SVG = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 4C3 3.44772 3.44772 3 4 3H6V2C6 1.44772 6.44772 1 7 1H9C9.55228 1 10 1.44772 10 2V3H12C12.5523 3 13 3.44772 13 4V13C13 13.5523 12.5523 14 12 14H4C3.44772 14 3 13.5523 3 13V4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 3V5M10 3V5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M6 8H10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';

  // Данные отелей по городам
  const hotelsData = {
    moscow: {
      center: [55.753215, 37.622504],
      zoom: 12,
      hotels: [
        { name: 'AZIMUT Отель Олимпик Москва', price: 6900, discount: 18, coords: [55.782032, 37.601504] },
        { name: 'Novotel Москва Центр', price: 8500, discount: 22, coords: [55.764902, 37.604878] },
        { name: 'Космос', price: 5400, discount: 12, coords: [55.823051, 37.641144] },
        { name: 'Метрополь', price: 15000, discount: 25, coords: [55.758485, 37.620864] },
        { name: 'Украина', price: 12000, discount: 20, coords: [55.750446, 37.568341] },
        { name: 'Холидей Инн Сущёвский', price: 7200, discount: 15, coords: [55.791489, 37.604878] },
        { name: 'Ибис Павелецкая', price: 4900, discount: 10, coords: [55.729542, 37.640654] },
        { name: 'Мариотт Гранд', price: 18000, discount: 28, coords: [55.756993, 37.619024] },
        { name: 'Palmira Business Club', price: 6000, discount: 20, coords: [55.682, 37.6176] },
        { name: 'AZIMUT Сити Отель Смоленская', price: 7000, discount: 15, coords: [55.7477, 37.5835] },
        { name: 'ibis Москва Киевская', price: 5000, discount: 50, coords: [55.7439, 37.5652] },
        { name: 'Park Inn Садовая', price: 5800, discount: 14, coords: [55.724, 37.624] },
        { name: 'Балчуг Кемпински', price: 22000, discount: 18, coords: [55.748, 37.626] },
        { name: 'Националь', price: 16000, discount: 22, coords: [55.756, 37.616] },
        { name: 'Золотое кольцо', price: 6200, discount: 12, coords: [55.761, 37.576] },
        { name: 'Аэростар', price: 5500, discount: 16, coords: [55.801, 37.532] },
        { name: 'Вега Измайлово', price: 4800, discount: 14, coords: [55.790, 37.795] },
        { name: 'Hilton Ленинградская', price: 9500, discount: 20, coords: [55.776, 37.652] },
        { name: 'Radisson Славянская', price: 7800, discount: 17, coords: [55.729, 37.565] },
        { name: 'Пекин', price: 7100, discount: 13, coords: [55.769, 37.588] },
        { name: 'Lotte Hotel Moscow', price: 25000, discount: 24, coords: [55.767, 37.579] },
        { name: 'Crowne Plaza Москва', price: 8200, discount: 15, coords: [55.741, 37.628] },
        { name: 'Шератон Палас', price: 14000, discount: 19, coords: [55.760, 37.605] },
        { name: 'Марриотт Тверская', price: 11000, discount: 21, coords: [55.766, 37.605] },
        { name: 'Novotel Москва Сити', price: 8900, discount: 18, coords: [55.749, 37.541] },
        { name: 'DoubleTree Москва Сити', price: 9200, discount: 16, coords: [55.751, 37.534] },
        { name: 'Ибис Бюджет Панфиловская', price: 3800, discount: 11, coords: [55.796, 37.508] },
        { name: 'Арбат Хаятт', price: 13000, discount: 23, coords: [55.752, 37.591] },
        { name: 'Савой', price: 17000, discount: 20, coords: [55.758, 37.615] },
        { name: 'Four Seasons Москва', price: 35000, discount: 28, coords: [55.755, 37.619] }
      ]
    },
    spb: {
      center: [59.938784, 30.314997],
      zoom: 12,
      hotels: [
        { name: 'AZIMUT Отель Санкт-Петербург', price: 5800, discount: 16, coords: [59.944899, 30.361944] },
        { name: 'Гранд Отель Европа', price: 22000, discount: 30, coords: [59.935477, 30.331783] },
        { name: 'Астория', price: 18000, discount: 24, coords: [59.932934, 30.309044] },
        { name: 'Коринтия Санкт-Петербург', price: 9500, discount: 18, coords: [59.925716, 30.319464] },
        { name: 'Radisson Royal', price: 7800, discount: 14, coords: [59.932504, 30.348617] },
        { name: 'Парк Инн Прибалтийская', price: 5200, discount: 12, coords: [59.943997, 30.211317] },
        { name: 'Crowne Plaza Аэропорт', price: 6400, discount: 15, coords: [59.800304, 30.261944] }
      ]
    },
    kazan: {
      center: [55.788116, 49.122132],
      zoom: 13,
      hotels: [
        { name: 'Ривьера', price: 7200, discount: 20, coords: [55.806544, 49.095116] },
        { name: 'Мираж', price: 5800, discount: 15, coords: [55.785316, 49.124632] },
        { name: 'Корстон', price: 6500, discount: 18, coords: [55.813216, 49.103132] },
        { name: 'Гранд Отель Казань', price: 4900, discount: 12, coords: [55.791516, 49.108632] },
        { name: 'Ибис Казань Центр', price: 3800, discount: 10, coords: [55.787916, 49.114132] },
        { name: 'Шаляпин Палас Отель', price: 8200, discount: 22, coords: [55.795116, 49.118632] }
      ]
    },
    russia: {
      center: [55.751574, 60.573856],
      zoom: 5,
      hotels: [
        { name: 'AZIMUT Владивосток', price: 6200, discount: 18, coords: [43.115542, 131.885494] },
        { name: 'Гранд Отель Екатеринбург', price: 5400, discount: 14, coords: [56.838011, 60.597474] },
        { name: 'Хаятт Ридженси Сочи', price: 12000, discount: 25, coords: [43.584832, 39.722014] },
        { name: 'Новосибирск Марриотт', price: 7800, discount: 20, coords: [55.030199, 82.920430] },
        { name: 'Hilton Калининград', price: 8500, discount: 22, coords: [54.706999, 20.507234] },
        { name: 'DoubleTree Ростов-на-Дону', price: 5900, discount: 16, coords: [47.222078, 39.720349] },
        { name: 'Маринс Парк Нижний Новгород', price: 4800, discount: 12, coords: [56.326797, 44.006516] },
        { name: 'Radisson Красноярск', price: 6100, discount: 15, coords: [56.010569, 92.852572] }
      ]
    },
    world: {
      center: [48.8566, 2.3522],
      zoom: 4,
      hotels: [
        { name: 'Marriott Paris', price: 18000, discount: 22, coords: [48.869914, 2.338044] },
        { name: 'Hilton Istanbul', price: 12000, discount: 18, coords: [41.042753, 29.009539] },
        { name: 'Sheraton Dubai', price: 15000, discount: 25, coords: [25.087766, 55.145242] },
        { name: 'Radisson Blu Berlin', price: 9800, discount: 16, coords: [52.517037, 13.388860] },
        { name: 'InterContinental Vienna', price: 14000, discount: 20, coords: [48.207760, 16.372799] },
        { name: 'Movenpick Bangkok', price: 8500, discount: 15, coords: [13.729472, 100.559810] }
      ]
    }
  };

  let map = null;
  let clusterer = null;
  let markers = [];
  let currentCity = 'moscow';
  let HotelMarkerLayout = null;
  let ClusterLayout = null;
  let BlackDotLayout = null;
  const OVERLAP_PX = 20;

  // Форматирование цены
  function formatPrice(price) {
    return price.toLocaleString('ru-RU').replace(/\s/g, '\u00A0');
  }

  // Рендер сниппетов отелей
  function renderHotels(city) {
    const data = hotelsData[city];
    if (!data) return;

    hotelsContainer.innerHTML = data.hotels.map((hotel, index) => `
      <div class="hotel-snippet" data-index="${index}">
        <div class="hotel-snippet__name">${hotel.name}</div>
        <div class="hotel-snippet__details">
          <span class="hotel-snippet__price">от\u00A0${formatPrice(hotel.price)}\u00A0₽/ночь</span>
          <span class="hotel-snippet__discount">−${hotel.discount}%</span>
        </div>
      </div>
    `).join('');

    // Добавляем обработчики клика на сниппеты
    hotelsContainer.querySelectorAll('.hotel-snippet').forEach((snippet, index) => {
      snippet.addEventListener('click', () => {
        const hotel = data.hotels[index];
        if (map && hotel.coords && markers[index]) {
          map.setCenter(hotel.coords, 15, { duration: 500 });
          // Открыть балун маркера
          markers[index].balloon.open();
        }
      });
    });
  }

  // Создание кастомных layout (вызывается после ymaps.ready)
  function createCustomLayouts() {
    if (!ymaps || !ymaps.templateLayoutFactory) return;

    // Layout для маркера отеля
    HotelMarkerLayout = ymaps.templateLayoutFactory.createClass(
      '<div class="hotel-marker">' +
        '<div class="hotel-marker__icon">' + SUITCASE_SVG + '</div>' +
        '<div class="hotel-marker__discount">−{{ properties.discount }}%</div>' +
      '</div>',
      {
        build: function() {
          HotelMarkerLayout.superclass.build.call(this);
          const element = this.getParentElement().getElementsByClassName('hotel-marker')[0];
          if (element) {
            element.style.cursor = 'pointer';
          }
        },
        clear: function() {
          HotelMarkerLayout.superclass.clear.call(this);
        }
      }
    );

    // Layout для кластера
    ClusterLayout = ymaps.templateLayoutFactory.createClass(
      '<div class="hotel-cluster">' +
        '<div class="hotel-cluster__icon">' + SUITCASE_SVG + '</div>' +
        '<div class="hotel-cluster__count">+{{ properties.geoObjects.length }}</div>' +
      '</div>',
      {
        build: function() {
          ClusterLayout.superclass.build.call(this);
          const element = this.getParentElement().getElementsByClassName('hotel-cluster')[0];
          if (element) {
            element.style.cursor = 'pointer';
          }
        },
        clear: function() {
          ClusterLayout.superclass.clear.call(this);
        }
      }
    );

    // Чёрная точка для близких маркеров (< 20px)
    BlackDotLayout = ymaps.templateLayoutFactory.createClass(
      '<div class="hotel-marker hotel-marker_black-dot" style="width:8px;height:8px;border-radius:50%;background:#000;border:none;"></div>',
      {
        build: function() {
          BlackDotLayout.superclass.build.call(this);
        },
        clear: function() {
          BlackDotLayout.superclass.clear.call(this);
        }
      }
    );
  }

  // Обновить маркеры на карте
  function updateMarkers(city) {
    const data = hotelsData[city];
    if (!data || !map || !HotelMarkerLayout || !ClusterLayout) return;

    // Удаляем старый кластер
    if (clusterer) {
      map.geoObjects.remove(clusterer);
      clusterer = null;
    }
    markers = [];

    // Создаем новый кластер
    clusterer = new ymaps.Clusterer({
      clusterDisableClickZoom: false,
      clusterOpenBalloonOnClick: false,
      clusterBalloonContentLayout: 'cluster#balloonCarousel',
      clusterBalloonItemContentLayout: 'cluster#balloonCarouselItem',
      clusterBalloonPanelMaxMapArea: 0,
      clusterBalloonContentLayoutWidth: 200,
      clusterBalloonContentLayoutHeight: 130,
      clusterBalloonPagerSize: 5,
      clusterBalloonPagerVisible: true,
      clusterHideIconOnBalloonOpen: false,
      geoObjectHideIconOnBalloonOpen: false,
      zoomOnClick: true,
      groupByCoordinates: false,
      gridSize: 60, // Радиус кластеризации в пикселях
      clusterIcons: [{
        href: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48L3N2Zz4=',
        size: [60, 40],
        offset: [-30, -20]
      }],
      clusterIconContentLayout: ClusterLayout
    });

    // Добавляем маркеры в кластер
    data.hotels.forEach((hotel, index) => {
      const placemark = new ymaps.Placemark(hotel.coords, {
        discount: hotel.discount,
        name: hotel.name,
        price: hotel.price,
        balloonContentHeader: hotel.name,
        balloonContentBody: `<div style="font-size:14px;line-height:1.5;">от\u00A0${formatPrice(hotel.price)}\u00A0₽/ночь<br><strong style="color:#7F5FFF;font-size:16px;">−${hotel.discount}%</strong></div>`
      }, {
        iconLayout: HotelMarkerLayout,
        iconShape: {
          type: 'Rectangle',
          coordinates: [[-30, -15], [30, 15]]
        },
        iconOffset: [-30, -15]
      });

      // Обработчик клика для открытия балуна
      placemark.events.add('click', function() {
        placemark.balloon.open();
      });

      clusterer.add(placemark);
      markers.push(placemark);
    });

    // Добавляем кластер на карту
    map.geoObjects.add(clusterer);

    // Обработчик клика на кластер для увеличения зума
    clusterer.events.add('click', function(e) {
      const cluster = e.get('target');
      const geoObjects = cluster.getGeoObjects();
      if (geoObjects.length > 0) {
        const bounds = cluster.getBounds();
        map.setBounds(bounds, {
          duration: 300,
          checkZoomRange: true
        });
      }
    });

    // Применяем правило «ближе 20px — одна чёрная точка» (только Москва)
    if (city === 'moscow' && BlackDotLayout && markers.length > 0) {
      map.events.remove('boundschange', onBoundsChange);
      updateOverlappingMarkers();
      map.events.add('boundschange', onBoundsChange);
    }
  }

  // При перестроении карты — пересчитывать чёрные точки
  var boundsChangeTimer = null;
  function onBoundsChange() {
    if (boundsChangeTimer) clearTimeout(boundsChangeTimer);
    boundsChangeTimer = setTimeout(function() {
      boundsChangeTimer = null;
      if (currentCity === 'moscow') updateOverlappingMarkers();
    }, 150);
  }

  // Если две точки ближе 20px — одну показываем чёрной точкой (с меньшей скидкой)
  function updateOverlappingMarkers() {
    if (!map || !clusterer || markers.length === 0 || !BlackDotLayout || !HotelMarkerLayout) return;
    var list = clusterer.getGeoObjects();
    if (!list || list.length === 0) return;
    var projection = map.options.get('projection');
    var zoom = map.getZoom();
    var globalCenter = map.options.get('globalPixelCenter');
    var size = map.container.getSize();
    function coordToPixel(coord) {
      var g = projection.toGlobalPixels(coord, zoom);
      return [
        g[0] - globalCenter[0] + size[0] / 2,
        g[1] - globalCenter[1] + size[1] / 2
      ];
    }
    var pixels = [];
    for (var i = 0; i < list.length; i++) {
      var c = list[i].geometry.getCoordinates();
      pixels.push(coordToPixel(c));
    }
    var toBlack = {};
    for (var i = 0; i < list.length; i++) {
      for (var j = i + 1; j < list.length; j++) {
        var dx = pixels[i][0] - pixels[j][0];
        var dy = pixels[i][1] - pixels[j][1];
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < OVERLAP_PX) {
          var di = list[i].properties.get('discount');
          var dj = list[j].properties.get('discount');
          if (di <= dj) {
            toBlack[i] = true;
          } else {
            toBlack[j] = true;
          }
        }
      }
    }
    for (var k = 0; k < list.length; k++) {
      var pm = list[k];
      if (toBlack[k]) {
        pm.options.set('iconLayout', BlackDotLayout);
        pm.options.set('iconShape', { type: 'Rectangle', coordinates: [[-4, -4], [4, 4]] });
        pm.options.set('iconOffset', [-4, -4]);
      } else {
        pm.options.set('iconLayout', HotelMarkerLayout);
        pm.options.set('iconShape', { type: 'Rectangle', coordinates: [[-30, -15], [30, 15]] });
        pm.options.set('iconOffset', [-30, -15]);
      }
    }
  }

  // Переключение города
  function switchCity(city) {
    if (city === currentCity) return;
    var wasMoscow = (currentCity === 'moscow');
    currentCity = city;

    const data = hotelsData[city];
    if (!data) return;

    if (map && wasMoscow && city !== 'moscow') {
      map.events.remove('boundschange', onBoundsChange);
    }

    // Обновляем карту
    if (map) {
      map.setCenter(data.center, data.zoom, { duration: 500 });
      updateMarkers(city);
    }

    // Обновляем сниппеты
    renderHotels(city);

    // Обновляем активный таб
    document.querySelectorAll('.map-tab').forEach(tab => {
      tab.classList.remove('active');
      tab.setAttribute('aria-selected', 'false');
    });
    const activeTab = document.querySelector(`.map-tab[data-city="${city}"]`);
    if (activeTab) {
      activeTab.classList.add('active');
      activeTab.setAttribute('aria-selected', 'true');
    }
  }

  // Инициализация карты
  function initMap() {
    if (typeof ymaps === 'undefined') {
      console.warn('Yandex Maps API не загружен');
      // Показываем заглушку
      mapContainer.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#666;font-size:16px;">Карта загружается...</div>';
      return;
    }

    ymaps.ready(function () {
      // Создаем кастомные layout
      createCustomLayouts();

      const data = hotelsData[currentCity];

      map = new ymaps.Map(mapContainer, {
        center: data.center,
        zoom: data.zoom,
        controls: [] // Без контролов
      }, {
        suppressMapOpenBlock: true,
        // Применяем кастомные стили карты
        customization: mapCustomStyles
      });

      // Включаем управление картой для тестирования
      // map.behaviors.disable(['scrollZoom', 'drag', 'dblClickZoom', 'rightMouseButtonMagnifier']);

      // Добавляем маркеры
      updateMarkers(currentCity);
    });
  }

  // Обработчики табов
  document.querySelectorAll('.map-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const city = tab.dataset.city;
      switchCity(city);
    });
  });

  // Инициализация
  renderHotels(currentCity);
  initMap();
})();
