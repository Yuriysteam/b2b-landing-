// ============================================================
// Layout pins on static maps (no external data)
// - positions are computed from existing DOM order + heuristics
// - CV: avoids placing pins on water (canvas sampling)
// - heatmap: center-biased distribution
// - does NOT touch existing .map-pin-dot nodes
// ============================================================
function layoutPins(mapWrapper, pinSelector = '.map-pin[data-hotel]', extraDotsCount = 40) {
  if (!mapWrapper) return;

  const pinLayer = mapWrapper.querySelector('.map-pins') || mapWrapper;
  const city = mapWrapper.getAttribute('data-city') || '';
  const img = mapWrapper.querySelector('img.map-image');
  if (!img) return;

  // Wait for image to be fully available for canvas sampling
  if (!img.complete || !img.naturalWidth) {
    img.addEventListener(
      'load',
      () => {
        layoutPins(mapWrapper, pinSelector, extraDotsCount);
      },
      { once: true }
    );
    return;
  }

  // Use snippets text (DOM only) for simple "geo" heuristics
  const group = document.querySelector(`.hotel-snippets-group[data-city="${city}"]`);
  const getHotelName = (hotelId) => {
    if (!group) return '';
    const el = group.querySelector(`.hotel-snippet[data-hotel="${hotelId}"] .hotel-snippet__name`);
    return (el?.textContent || '').trim();
  };

  const normalize = (s) => String(s || '').toLowerCase();
  const regionFromName = (name) => {
    const n = normalize(name);
    if (!n) return 'center';

    // Moscow hints
    if (city === 'moscow') {
      if (/(кремл|тверск|лубян|арбат|метропол|национал|савой|балчуг|ритц|парк хая|арарат|пекин)/.test(n)) return 'center';
      if (/(павелец|замосквор|холмы|плющиха)/.test(n)) return 'south';
      if (/(киев|славян|фили|украин)/.test(n)) return 'west';
      if (/(вднх|космос|олимпик|сущ[её]в)/.test(n)) return 'north';
      if (/(ленинград|яуза)/.test(n)) return 'east';
      return 'center';
    }

    // Saint-Petersburg hints
    if (city === 'spb') {
      if (/(невск|европ|астор|англетер|мойка|таллион|казанск|адмирал)/.test(n)) return 'center';
      if (/(васильев|прибал|порт|морск)/.test(n)) return 'west';
      if (/(пулков|аэропорт|московск(ие)? ворота)/.test(n)) return 'south';
      return 'center';
    }

    // Kazan hints
    if (city === 'kazan') {
      if (/(центр|кремл|бауман|ногай|джузепп|шаляпин)/.test(n)) return 'center';
      if (/(ривьер)/.test(n)) return 'north';
      if (/(корстон)/.test(n)) return 'south';
      return 'center';
    }

    return 'center';
  };

  const pins = Array.from(mapWrapper.querySelectorAll(pinSelector));
  if (!pins.length) return;

  const width = pinLayer.clientWidth || mapWrapper.clientWidth;
  const height = pinLayer.clientHeight || mapWrapper.clientHeight;
  if (!width || !height) return;

  // ---- CV sampler (water mask via canvas) ----
  function rgbToHsv(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    if (d !== 0) {
      if (max === r) h = ((g - b) / d) % 6;
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
      if (h < 0) h += 360;
    }
    const s = max === 0 ? 0 : d / max;
    const v = max;
    return { h, s, v };
  }

  function buildSampler() {
    const cache = mapWrapper.__cvSampler;
    if (cache && cache.w === width && cache.h === height && cache.src === img.currentSrc) {
      return cache;
    }
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;

    // Draw like object-fit: cover to match the visible map area
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    const scale = Math.max(width / nw, height / nh);
    const dw = nw * scale;
    const dh = nh * scale;
    const dx = (width - dw) / 2;
    const dy = (height - dh) / 2;
    ctx.drawImage(img, dx, dy, dw, dh);

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    const sampler = {
      w: width,
      h: height,
      src: img.currentSrc,
      data,
      isWater(x, y) {
        const xi = Math.max(0, Math.min(width - 1, Math.round(x)));
        const yi = Math.max(0, Math.min(height - 1, Math.round(y)));
        const idx = (yi * width + xi) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        // Water on this map style is more saturated blue-violet and quite uniform.
        const { h, s, v } = rgbToHsv(r, g, b);
        const isBlueViolet = h >= 200 && h <= 290 && s >= 0.16 && v >= 0.55;

        // Extra guard: very "flat" pixels are likely water fill.
        const flat = Math.abs(r - g) + Math.abs(g - b) + Math.abs(r - b) < 38;

        return isBlueViolet && flat;
      },
      roadScore(x, y) {
        // Prefer areas with local contrast (streets/labels) vs flat water.
        const xi = Math.max(2, Math.min(width - 3, Math.round(x)));
        const yi = Math.max(2, Math.min(height - 3, Math.round(y)));
        let acc = 0;
        let cnt = 0;
        const lum = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
        const centerIdx = (yi * width + xi) * 4;
        const cL = lum(data[centerIdx], data[centerIdx + 1], data[centerIdx + 2]);
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            if (dx === 0 && dy === 0) continue;
            const idx = ((yi + dy) * width + (xi + dx)) * 4;
            const l = lum(data[idx], data[idx + 1], data[idx + 2]);
            acc += Math.abs(l - cL);
            cnt++;
          }
        }
        return cnt ? acc / cnt : 0;
      }
    };

    mapWrapper.__cvSampler = sampler;
    return sampler;
  }

  const sampler = buildSampler();
  if (!sampler) return;

  function snapToLand(x, y) {
    if (!sampler.isWater(x, y)) return { x, y };
    const steps = [8, 14, 20, 28, 36, 44];
    const dirs = [
      [1, 0], [-1, 0], [0, 1], [0, -1],
      [1, 1], [1, -1], [-1, 1], [-1, -1]
    ];
    for (let i = 0; i < steps.length; i++) {
      const r = steps[i];
      for (let d = 0; d < dirs.length; d++) {
        const nx = x + dirs[d][0] * r;
        const ny = y + dirs[d][1] * r;
        if (nx < 0 || ny < 0 || nx > width || ny > height) continue;
        if (!sampler.isWater(nx, ny)) return { x: nx, y: ny };
      }
    }
    return { x, y }; // fallback: keep as-is (rare)
  }

  // Grid setup (cloud-like distribution)
  const cols = 6;
  const rows = 6;
  const cellW = width / cols;
  const cellH = height / rows;
  const edgePad = Math.max(12, Math.round(Math.min(width, height) * 0.04));
  const gap = 4; // minimal spacing between pin boxes (4px по ТЗ)

  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x1 = c * cellW;
      const y1 = r * cellH;
      const x2 = x1 + cellW;
      const y2 = y1 + cellH;
      cells.push({ r, c, x1, y1, x2, y2 });
    }
  }

  const centerR = Math.floor(rows / 2);
  const centerC = Math.floor(cols / 2);
  const isCenterCell = (cell) => Math.abs(cell.r - centerR) <= 1 && Math.abs(cell.c - centerC) <= 1;
  const isNorthCell = (cell) => cell.r <= 1;
  const isSouthCell = (cell) => cell.r >= rows - 2;
  const isWestCell = (cell) => cell.c <= 1;
  const isEastCell = (cell) => cell.c >= cols - 2;

  // Heatmap weights: closer to center => higher probability
  const SIGMA = 1.25;
  const heatWeight = (cell) => {
    const dr = cell.r - centerR;
    const dc = cell.c - centerC;
    const d2 = dr * dr + dc * dc;
    return Math.exp(-d2 / (2 * SIGMA * SIGMA));
  };

  const pickCellPool = (region) => {
    if (region === 'center') return cells.filter(isCenterCell);
    if (region === 'north') return cells.filter(isNorthCell);
    if (region === 'south') return cells.filter(isSouthCell);
    if (region === 'west') return cells.filter(isWestCell);
    if (region === 'east') return cells.filter(isEastCell);
    return cells;
  };

  function weightedPick(list, weights, rnd) {
    let sum = 0;
    for (let i = 0; i < weights.length; i++) sum += weights[i];
    if (sum <= 0) return list[Math.floor(rnd() * list.length)];
    let x = rnd() * sum;
    for (let i = 0; i < list.length; i++) {
      x -= weights[i];
      if (x <= 0) return list[i];
    }
    return list[list.length - 1];
  }

  // Small deterministic random (stable layout per city + hotelId)
  function hash32(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  function mulberry32(seed) {
    return function () {
      let t = (seed += 0x6D2B79F5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const placed = [];
  const intersects = (a, b) =>
    !(a.x2 + gap <= b.x1 || a.x1 >= b.x2 + gap || a.y2 + gap <= b.y1 || a.y1 >= b.y2 + gap);

  // Place pins: center-biased “heatmap”, avoid water, avoid overlaps
  pins.forEach((pin, idx) => {
    const hotelId = pin.getAttribute('data-hotel') || String(idx);
    const name = getHotelName(hotelId);
    const region = regionFromName(name);

    const seed = hash32(`${city}:${hotelId}`);
    const rnd = mulberry32(seed);

    const pw = pin.offsetWidth || 72;
    const ph = pin.offsetHeight || 28;

    const preferCenter = idx < Math.ceil(pins.length * 0.65);
    const basePool = preferCenter ? cells : pickCellPool(region);
    const finalPool = basePool.length ? basePool : cells;

    // Build weights once per pin (heatmap + soft region bias)
    const weights = finalPool.map((cell) => {
      let w = heatWeight(cell);
      if (!preferCenter) {
        // for non-center pins, let regions breathe a bit
        if (region === 'west' && isWestCell(cell)) w *= 1.35;
        if (region === 'east' && isEastCell(cell)) w *= 1.35;
        if (region === 'north' && isNorthCell(cell)) w *= 1.35;
        if (region === 'south' && isSouthCell(cell)) w *= 1.35;
      }
      return w;
    });

    let x = width / 2;
    let y = height / 2;

    // Limited attempts: keep simple but avoid overlaps reliably
    for (let attempt = 0; attempt < 14; attempt++) {
      const cell = weightedPick(finalPool, weights, rnd);
      const innerPad = Math.max(10, Math.round(Math.min(cellW, cellH) * 0.18));
      const minX = Math.max(edgePad, cell.x1 + innerPad);
      const maxX = Math.min(width - edgePad, cell.x2 - innerPad);
      const minY = Math.max(edgePad, cell.y1 + innerPad);
      const maxY = Math.min(height - edgePad, cell.y2 - innerPad);

      // Try a few candidates inside the cell, pick the best "roadScore" ON LAND
      let best = null;
      for (let k = 0; k < 4; k++) {
        const cx = minX + rnd() * Math.max(1, maxX - minX);
        const cy = minY + rnd() * Math.max(1, maxY - minY);
        if (sampler.isWater(cx, cy)) continue;
        const s = sampler.roadScore(cx, cy);
        const candidate = { x: cx, y: cy, score: s };
        if (!best || candidate.score > best.score) best = candidate;
      }
      if (!best) continue;
      x = best.x;
      y = best.y;

      // clamp for pin size
      x = Math.max(pw / 2 + edgePad, Math.min(width - pw / 2 - edgePad, x));
      y = Math.max(ph / 2 + edgePad, Math.min(height - ph / 2 - edgePad, y));

      // Snap away from water (safety)
      const snapped = snapToLand(x, y);
      x = snapped.x;
      y = snapped.y;

      const box = { x1: x - pw / 2, y1: y - ph / 2, x2: x + pw / 2, y2: y + ph / 2 };
      const hit = placed.some((p) => intersects(box, p));
      if (!hit) {
        placed.push(box);
        pin.style.left = `${x}px`;
        pin.style.top = `${y}px`;
        return;
      }
    }

    // Fallback: if no free spot found, place near center but still avoid water
    const fallback = snapToLand(width * 0.5, height * 0.48);
    pin.style.left = `${fallback.x}px`;
    pin.style.top = `${fallback.y}px`;
  });

  // ---- Redistribute dots evenly, avoid water (only for moscow) ----
  if (city === 'moscow') {
    const dots = Array.from(pinLayer.querySelectorAll('.map-pin-dot'));
    const dotCount = dots.length;
    if (dotCount > 0) {
      // Build a simple grid for even distribution
      const dotCols = Math.ceil(Math.sqrt(dotCount * (width / height)));
      const dotRows = Math.ceil(dotCount / dotCols);
      const dotCellW = width / dotCols;
      const dotCellH = height / dotRows;
      const dotPad = 12;

      dots.forEach((dot, idx) => {
        const col = idx % dotCols;
        const row = Math.floor(idx / dotCols);
        // Deterministic jitter per dot
        const dotSeed = hash32(`moscow:dot:${idx}`);
        const dotRnd = mulberry32(dotSeed);
        const jitterX = (dotRnd() - 0.5) * (dotCellW * 0.6);
        const jitterY = (dotRnd() - 0.5) * (dotCellH * 0.6);

        let dotX = dotPad + col * dotCellW + dotCellW / 2 + jitterX;
        let dotY = dotPad + row * dotCellH + dotCellH / 2 + jitterY;

        // Clamp inside map
        dotX = Math.max(dotPad, Math.min(width - dotPad, dotX));
        dotY = Math.max(dotPad, Math.min(height - dotPad, dotY));

        // Avoid water
        if (sampler.isWater(dotX, dotY)) {
          const snapped = snapToLand(dotX, dotY);
          dotX = snapped.x;
          dotY = snapped.y;
        }

        dot.style.left = `${dotX}px`;
        dot.style.top = `${dotY}px`;
      });
    }
  }
}

function layoutAllVisibleMaps() {
  document.querySelectorAll('.map-image-wrapper').forEach((wrapper) => {
    if (wrapper.style.display === 'none') return;
    // Only Moscow for now (по ТЗ)
    const city = wrapper.getAttribute('data-city');
    if (city === 'moscow') {
      layoutPins(wrapper, '.map-pin[data-hotel]', 40);
    }
  });
}

// Initial layout + relayout on resize (light debounce)
(function () {
  let t = null;
  function schedule() {
    window.clearTimeout(t);
    t = window.setTimeout(() => {
      requestAnimationFrame(() => {
        layoutAllVisibleMaps();
      });
    }, 80);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule);
  } else {
    schedule();
  }
  window.addEventListener('load', schedule);
  window.addEventListener('resize', schedule);
})();

// Переключение табов карты (основная секция)
(function() {
  const mapTabs = document.querySelectorAll('.map-tab:not([data-section])');
  const mapWrappers = document.querySelectorAll('.map-image-wrapper:not([data-section])');
  const hotelGroups = document.querySelectorAll('.hotel-snippets-group');
  
  mapTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const city = tab.getAttribute('data-city');
      
      // Обновляем активный таб
      mapTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      
      // Показываем/скрываем карты
      mapWrappers.forEach(wrapper => {
        if (wrapper.getAttribute('data-city') === city) {
          wrapper.style.display = 'block';
        } else {
          wrapper.style.display = 'none';
        }
      });
      
      // Показываем/скрываем группы карточек отелей
      hotelGroups.forEach(group => {
        if (group.getAttribute('data-city') === city) {
          group.style.display = 'flex';
        } else {
          group.style.display = 'none';
        }
      });
      
      // Переинициализируем связь пинов и карточек для текущего города
      setTimeout(() => {
        // re-layout pins for active city (keeps "cloud" + no heavy overlaps)
        const activeWrapper = Array.from(mapWrappers).find(w => w.getAttribute('data-city') === city);
        if (activeWrapper && (city === 'moscow' || city === 'spb' || city === 'kazan')) {
          layoutPins(activeWrapper, '.map-pin[data-hotel]', 40);
        }
        initPinSnippetLinks();
      }, 100);
    });
  });
})();

// Переключение табов карты (секция экономии - savings)
(function() {
  const savingsTabs = document.querySelectorAll('.map-tab[data-section="savings"]');
  const savingsWrappers = document.querySelectorAll('.map-image-wrapper[data-section="savings"]');
  
  savingsTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const city = tab.getAttribute('data-city');
      
      // Обновляем активный таб только в секции savings
      savingsTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      
      // Показываем/скрываем карты только в секции savings
      savingsWrappers.forEach(wrapper => {
        if (wrapper.getAttribute('data-city') === city) {
          wrapper.style.display = 'block';
          if (window.savingsMaps && window.savingsMaps[city]) {
            var map = window.savingsMaps[city];
            setTimeout(function() {
              if (map.container && typeof map.container.fitToViewport === 'function') {
                map.container.fitToViewport();
              }
              if (map.container && typeof map.container.invalidateSize === 'function') {
                map.container.invalidateSize();
              }
              map.setCenter(map.getCenter(), map.getZoom(), { checkZoomRange: true });
            }, 150);
          }
        } else {
          wrapper.style.display = 'none';
        }
      });
    });
  });
})();

// Связь пинов и карточек отелей
function initPinSnippetLinks() {
  const activeMapWrapper = document.querySelector('.map-image-wrapper[style*="block"], .map-image-wrapper:not([style*="none"])');
  if (!activeMapWrapper) return;
  
  const city = activeMapWrapper.getAttribute('data-city');
  const pins = activeMapWrapper.querySelectorAll('.map-pin');
  const activeGroup = document.querySelector(`.hotel-snippets-group[data-city="${city}"]`);
  if (!activeGroup) return;
  
  const snippets = activeGroup.querySelectorAll('.hotel-snippet');
  
  // Удаляем старые обработчики
  pins.forEach(pin => {
    const newPin = pin.cloneNode(true);
    pin.parentNode.replaceChild(newPin, pin);
  });
  
  const newPins = activeMapWrapper.querySelectorAll('.map-pin');
  const newSnippets = activeGroup.querySelectorAll('.hotel-snippet');
  
  // Добавляем обработчики для пинов
  newPins.forEach((pin, index) => {
    const hotelId = pin.getAttribute('data-hotel');
    const snippet = Array.from(newSnippets).find(s => s.getAttribute('data-hotel') === hotelId);
    
    if (snippet) {
      pin.addEventListener('mouseenter', () => {
        snippet.style.boxShadow = '0 8px 24px rgba(127, 95, 255, 0.3)';
        snippet.style.transform = 'translateX(-4px)';
        snippet.style.transition = 'all 0.2s ease';
      });
      
      pin.addEventListener('mouseleave', () => {
        snippet.style.boxShadow = '';
        snippet.style.transform = '';
      });
      
      pin.addEventListener('click', () => {
        snippet.scrollIntoView({ behavior: 'smooth', block: 'center' });
        snippet.style.boxShadow = '0 8px 24px rgba(127, 95, 255, 0.5)';
        setTimeout(() => {
          snippet.style.boxShadow = '';
        }, 1000);
      });
    }
  });
  
  // Добавляем обработчики для карточек
  newSnippets.forEach((snippet) => {
    const hotelId = snippet.getAttribute('data-hotel');
    const pin = Array.from(newPins).find(p => p.getAttribute('data-hotel') === hotelId);
    
    if (pin) {
      snippet.addEventListener('mouseenter', () => {
        pin.style.transform = 'translate(-50%, -50%) scale(1.01)';
        pin.style.transition = 'all 0.2s ease';
        pin.style.zIndex = '100';
      });
      
      snippet.addEventListener('mouseleave', () => {
        pin.style.transform = 'translate(-50%, -50%)';
        pin.style.zIndex = '';
      });
      
      snippet.addEventListener('click', () => {
        pin.style.transform = 'translate(-50%, -50%) scale(1.01)';
        pin.style.boxShadow = '0px 12px 8px rgba(0, 0, 0, 0.25)';
        setTimeout(() => {
          pin.style.transform = 'translate(-50%, -50%)';
          pin.style.boxShadow = '';
        }, 500);
      });
    }
  });
}

// Инициализация при загрузке
(function() {
  initPinSnippetLinks();
})();
  </script>

  <!-- Кастомные стили карты (customization.json) -->
