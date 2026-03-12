window.MAP_CUSTOMIZATION = [
  // === Скрываем ненужные слои ===
  {"tags":"poi","stylers":[{"visibility":"off"}]},
  {"tags":"food_and_drink","stylers":[{"visibility":"off"}]},
  {"tags":"shopping","stylers":[{"visibility":"off"}]},
  {"tags":"commercial_services","stylers":[{"visibility":"off"}]},
  {"tags":"medical","stylers":[{"visibility":"off"}]},
  {"tags":"sports_ground","stylers":[{"visibility":"off"}]},
  {"tags":"outdoor","stylers":[{"visibility":"off"}]},
  {"tags":"transit_location","stylers":[{"visibility":"off"}]},
  {"tags":"transit_line","stylers":[{"visibility":"off"}]},
  {"tags":"transit_schema","stylers":[{"visibility":"off"}]},
  {"tags":"vegetation","stylers":[{"visibility":"off"}]},
  {"tags":"park","stylers":[{"visibility":"off"}]},
  {"tags":"national_park","stylers":[{"visibility":"off"}]},
  {"tags":"cemetery","stylers":[{"visibility":"off"}]},
  {"tags":"beach","stylers":[{"visibility":"off"}]},

  // === Земля / фон карты — bg-light #ECEEF5 ===
  {"tags":"land","elements":"geometry.fill","stylers":[{"color":"#ECEEF5"}]},
  {"tags":"landscape","elements":"geometry.fill","stylers":[{"color":"#ECEEF5"}]},
  {"tags":"terrain","elements":"geometry.fill","stylers":[{"color":"#E3E5F0"}]},
  {"tags":"residential","elements":"geometry.fill","stylers":[{"color":"#ECEEF5"}]},

  // === Страна / регионы ===
  {"tags":"country","elements":"geometry.fill","stylers":[{"color":"#ECEEF5"}]},
  {"tags":"country","elements":"geometry.outline","stylers":[{"color":"#C8BBFF"},{"opacity":0.4}]},
  {"tags":"region","elements":"geometry.fill","stylers":[{"color":"#ECEEF5"}]},
  {"tags":"region","elements":"geometry.outline","stylers":[{"color":"#D5D8E8"},{"opacity":0.5}]},
  {"tags":"district","elements":"geometry.fill","stylers":[{"color":"#ECEEF5"}]},
  {"tags":"district","elements":"geometry.outline","stylers":[{"color":"#D5D8E8"},{"opacity":0.3}]},
  {"tags":"locality","elements":"geometry.fill","stylers":[{"color":"#E3E5F0"}]},

  // === Вода — приглушённый accent ===
  {"tags":"water","elements":"geometry.fill","stylers":[{"color":"#C8BBFF"},{"opacity":0.35}]},
  {"tags":"water","elements":"geometry.outline","stylers":[{"color":"#B0A3F0"},{"opacity":0.2}]},
  {"tags":"bathymetry","elements":"geometry.fill","stylers":[{"color":"#C8BBFF"},{"opacity":0.2}]},

  // === Дороги — белые, чистые ===
  {"tags":"road","elements":"geometry.fill","stylers":[{"color":"#FFFFFF"}]},
  {"tags":"road","elements":"geometry.outline","stylers":[{"color":"#D5D8E8"},{"opacity":0.5}]},
  {"tags":"road_limited","elements":"geometry.fill","stylers":[{"color":"#F5F5FA"}]},
  {"tags":"road_limited","elements":"geometry.outline","stylers":[{"color":"#D5D8E8"},{"opacity":0.3}]},
  {"tags":"road_construction","elements":"geometry.fill","stylers":[{"color":"#F5F5FA"},{"opacity":0.5}]},

  // === Здания — чуть темнее фона ===
  {"tags":"building","elements":"geometry.fill","stylers":[{"color":"#DDDFE9"}]},
  {"tags":"building","elements":"geometry.outline","stylers":[{"color":"#D0D2DE"},{"opacity":0.5}]},

  // === Структуры / ограждения ===
  {"tags":"structure","elements":"geometry.fill","stylers":[{"color":"#E3E5F0"}]},
  {"tags":"fence","elements":"geometry.fill","stylers":[{"color":"#D5D8E8"},{"opacity":0.3}]},

  // === Лейблы — тёмные, читаемые ===
  {"tags":"country","elements":"label.text.fill","stylers":[{"color":"#2D2E42"}]},
  {"tags":"region","elements":"label.text.fill","stylers":[{"color":"#2D2E42"},{"opacity":0.7}]},
  {"tags":"district","elements":"label.text.fill","stylers":[{"color":"#2D2E42"},{"opacity":0.6}]},
  {"tags":"locality","elements":"label.text.fill","stylers":[{"color":"#2D2E42"}]},
  {"tags":"road","elements":"label.text.fill","stylers":[{"color":"#6B6B80"}]},
  {"tags":"water","elements":"label.text.fill","stylers":[{"color":"#7F5FFF"},{"opacity":0.6}]},
  {"tags":"address","elements":"label.text.fill","stylers":[{"color":"#6B6B80"},{"opacity":0.6}]},

  // === Иконки лейблов ===
  {"tags":"locality","elements":"label.icon","stylers":[{"color":"#7F5FFF"},{"opacity":0.7}]},
  {"tags":"country","elements":"label.icon","stylers":[{"visibility":"off"}]},

  // === Географические линии ===
  {"tags":"geographic_line","elements":"geometry.fill","stylers":[{"color":"#D5D8E8"},{"opacity":0.2}]}
];
