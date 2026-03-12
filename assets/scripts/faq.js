(function () {
  document.querySelector('.faq').addEventListener('click', function (e) {
    var btn = e.target.closest('.faq-item__question');
    if (!btn) return;

    var item = btn.parentElement;
    var isOpen = item.classList.contains('faq-item--open');

    btn.setAttribute('aria-expanded', String(!isOpen));
    item.classList.toggle('faq-item--open');
  });
})();
