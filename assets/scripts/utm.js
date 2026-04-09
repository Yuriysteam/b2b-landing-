(function () {
  'use strict';

  var LINK_SELECTOR = 'a[href*="passport.yandex.ru/auth/reg/org"]';
  var UTM_KEYS = ['utm_medium', 'utm_campaign', 'utm_source', 'utm_term', 'utm_content'];

  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? match[1] : null;
  }

  function getUtmsFromUrl() {
    var result = {};
    var params = new URLSearchParams(window.location.search);
    UTM_KEYS.forEach(function (key) {
      var val = params.get(key);
      if (val) result[key] = val;
    });
    return result;
  }

  function getUtmsFromCookies() {
    var result = {};
    var cookieNames = ['utms', 'ya_travel_attribution_session'];
    cookieNames.forEach(function (cookieName) {
      var raw = getCookie(cookieName);
      if (!raw) return;
      try {
        var parsed = JSON.parse(decodeURIComponent(raw));
        if (parsed && typeof parsed === 'object') {
          UTM_KEYS.forEach(function (key) {
            if (parsed[key]) result[key] = parsed[key];
          });
        }
      } catch (e) { /* ignore malformed cookie */ }
    });
    return result;
  }

  function getUtms() {
    var urlUtms = getUtmsFromUrl();
    if (Object.keys(urlUtms).length > 0) return urlUtms;
    return getUtmsFromCookies();
  }

  function appendUtmsToHref(href) {
    var utms = getUtms();
    var keys = Object.keys(utms);
    if (!keys.length) return href;

    var separator = href.indexOf('?') === -1 ? '?' : '&';
    var params = keys.map(function (k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(utms[k]);
    }).join('&');

    return href + separator + params;
  }

  function enrichAllLinks() {
    var links = document.querySelectorAll(LINK_SELECTOR);
    links.forEach(function (link) {
      link.href = appendUtmsToHref(link.href);
    });
  }

  // Public API for quiz.js
  window.appendUtmsToHref = appendUtmsToHref;

  // Enrich static links on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enrichAllLinks);
  } else {
    enrichAllLinks();
  }
})();
