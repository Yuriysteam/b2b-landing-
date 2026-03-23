(function() {
  var btn = document.getElementById('copyShareBtn');
  var msg = document.getElementById('shareMessage');
  var status = document.getElementById('copyStatus');
  if (!btn || !msg) return;

  function showCopied() {
    status.textContent = 'Скопировано';
    status.classList.add('share-card__copy-status--visible');
    setTimeout(function() { status.classList.remove('share-card__copy-status--visible'); }, 2000);
  }

  btn.addEventListener('click', function() {
    var paras = msg.querySelectorAll('p');
    var text = paras.length
      ? Array.prototype.map.call(paras, function(p) { return p.textContent; }).join('\n\n')
      : msg.textContent;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(showCopied);
    } else {
      var ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showCopied();
    }
  });
})();
