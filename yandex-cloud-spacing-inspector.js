// Yandex Cloud Spacing Inspector
// Run this in browser console on https://yandex.cloud/ru

function getComputedPadding(element) {
  const computed = window.getComputedStyle(element);
  return {
    top: computed.paddingTop,
    right: computed.paddingRight,
    bottom: computed.paddingBottom,
    left: computed.paddingLeft
  };
}

function getComputedGap(element) {
  const computed = window.getComputedStyle(element);
  return {
    rowGap: computed.rowGap,
    columnGap: computed.columnGap,
    gap: computed.gap
  };
}

function getComputedMargin(element) {
  const computed = window.getComputedStyle(element);
  return {
    top: computed.marginTop,
    right: computed.marginRight,
    bottom: computed.marginBottom,
    left: computed.marginLeft
  };
}

function getMaxWidth(element) {
  const computed = window.getComputedStyle(element);
  return {
    maxWidth: computed.maxWidth,
    width: computed.width
  };
}

console.log('=== YANDEX CLOUD SPACING ANALYSIS ===\n');

// Find sections by their heading text
const headings = {
  'services': 'Наши сервисы',
  'clients': 'Помогаем внедрять инновации',
  'start': 'Начните уже сейчас',
  'security': 'Защищаем ваши данные',
  'infrastructure': 'Инфраструктура',
  'support': 'Мы всегда рядом',
  'footer_cta': 'От первого шага'
};

// 1. SECTION SPACING
console.log('1. SECTION SPACING (padding-top/bottom):');
for (const [key, text] of Object.entries(headings)) {
  const heading = Array.from(document.querySelectorAll('h1, h2, h3')).find(h => h.textContent.includes(text));
  if (heading) {
    const section = heading.closest('section') || heading.closest('[class*="Section"]') || heading.parentElement;
    const padding = getComputedPadding(section);
    console.log(`  ${key} (${text}):`, padding);
  }
}

// 2. CONTAINER MAX-WIDTH
console.log('\n2. CONTAINER/CONTENT MAX-WIDTH:');
const containers = document.querySelectorAll('[class*="container"], [class*="Container"], [class*="wrapper"], [class*="Wrapper"]');
containers.forEach((container, idx) => {
  const dims = getMaxWidth(container);
  if (dims.maxWidth !== 'none' && dims.maxWidth !== '0px') {
    console.log(`  Container ${idx + 1}:`, dims);
  }
});

// 3. CARD GAPS - "Начните уже сейчас" (3 cards)
console.log('\n3. CARD GAPS - "Начните уже сейчас":');
const startHeading = Array.from(document.querySelectorAll('h2, h3')).find(h => h.textContent.includes('Начните уже сейчас'));
if (startHeading) {
  const cardsContainer = startHeading.parentElement.querySelector('[class*="grid"], [class*="Grid"], [class*="cards"], [class*="Cards"]') || 
                         startHeading.nextElementSibling;
  if (cardsContainer) {
    const gap = getComputedGap(cardsContainer);
    console.log('  Cards container gap:', gap);
  }
}

// 4. CARD GAPS - "Мы всегда рядом" (4 cards)
console.log('\n4. CARD GAPS - "Мы всегда рядом":');
const supportHeading = Array.from(document.querySelectorAll('h2, h3')).find(h => h.textContent.includes('Мы всегда рядом'));
if (supportHeading) {
  const cardsContainer = supportHeading.parentElement.querySelector('[class*="grid"], [class*="Grid"], [class*="cards"], [class*="Cards"]') || 
                         supportHeading.nextElementSibling;
  if (cardsContainer) {
    const gap = getComputedGap(cardsContainer);
    console.log('  Cards container gap:', gap);
  }
}

// 5. CARD INTERNAL PADDING
console.log('\n5. CARD INTERNAL PADDING:');
const cards = document.querySelectorAll('[class*="Card"]:not([class*="Container"]):not([class*="Wrapper"]), [class*="card"]:not([class*="container"])');
const uniquePaddings = new Set();
Array.from(cards).slice(0, 10).forEach((card, idx) => {
  const padding = getComputedPadding(card);
  const paddingStr = JSON.stringify(padding);
  if (!uniquePaddings.has(paddingStr)) {
    uniquePaddings.add(paddingStr);
    console.log(`  Card ${idx + 1}:`, padding);
  }
});

// 6. SPACING BETWEEN TITLE AND CONTENT
console.log('\n6. SPACING BETWEEN SECTION TITLE AND CONTENT:');
for (const [key, text] of Object.entries(headings)) {
  const heading = Array.from(document.querySelectorAll('h1, h2, h3')).find(h => h.textContent.includes(text));
  if (heading) {
    const margin = getComputedMargin(heading);
    console.log(`  ${key} (${text}) heading margin:`, margin);
    const nextElement = heading.nextElementSibling;
    if (nextElement) {
      const nextMargin = getComputedMargin(nextElement);
      console.log(`    Next element margin:`, nextMargin);
    }
  }
}

// 7. EYEBROW/LABEL TO TITLE SPACING
console.log('\n7. EYEBROW/LABEL TO TITLE SPACING:');
const labels = document.querySelectorAll('[class*="label"], [class*="Label"], [class*="eyebrow"], [class*="Eyebrow"], [class*="subtitle"], [class*="Subtitle"]');
Array.from(labels).slice(0, 5).forEach((label, idx) => {
  const margin = getComputedMargin(label);
  console.log(`  Label ${idx + 1}:`, margin);
});

// 8. TITLE TO SUBTITLE SPACING
console.log('\n8. TITLE TO SUBTITLE GAP:');
const titles = document.querySelectorAll('h1, h2, h3');
Array.from(titles).slice(0, 5).forEach((title, idx) => {
  const margin = getComputedMargin(title);
  const sibling = title.nextElementSibling;
  if (sibling && (sibling.tagName.match(/P|DIV/) && sibling.textContent.length < 200)) {
    const siblingMargin = getComputedMargin(sibling);
    console.log(`  Title ${idx + 1} margin-bottom: ${margin.bottom}, Subtitle margin-top: ${siblingMargin.top}`);
  }
});

// 9. GAPS INSIDE CARDS
console.log('\n9. GAPS INSIDE CARDS (title -> description -> link):');
Array.from(cards).slice(0, 5).forEach((card, idx) => {
  const gap = getComputedGap(card);
  console.log(`  Card ${idx + 1} gap:`, gap);
  
  const cardTitle = card.querySelector('h1, h2, h3, h4, h5, h6');
  if (cardTitle) {
    const titleMargin = getComputedMargin(cardTitle);
    console.log(`    Card title margin:`, titleMargin);
  }
});

console.log('\n=== END OF ANALYSIS ===');
