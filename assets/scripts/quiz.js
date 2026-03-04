(function() {
  var stepsSection = document.getElementById('steps');
  if (!stepsSection) return;
  var answers = [];
  var screens = {
    step1: document.getElementById('step1'),
    step2: document.getElementById('step2'),
    step3: document.getElementById('step3'),
    result: document.getElementById('result')
  };
  var steps = [screens.step1, screens.step2, screens.step3];
  var resultData = [
    { segmentName: 'Малый бизнес', segmentDesc: 'Вы бронируете поездки сами или с 1–2 коллегами, поездок немного, решения по расходам принимаете гибко.', benefits: ['Цена со скидкой видна сразу — не нужно сравнивать десяток сайтов.', 'Закрывающие документы по ЭДО: не копите чеки и не собирайте бумажки для бухгалтерии.', 'Скидки до 40% на жильё. Без договоров и минимального оборота — подключаете компанию и бронируете как обычно.'], activation: 'Один сервис вместо разрозненных бронирований и ручной отчётности.' },
    { segmentName: 'Средний бизнес', segmentDesc: 'Поездками занимается координатор или ответственный, поездки регулярные, расходы согласуете с руководством.', benefits: ['Все бронирования и заявки в одном месте — кто куда едет, на какую сумму, согласовано или нет.', 'Сводка для руководства без сбора данных из почты и Excel.', 'Скидки до 40%. Бронирования, согласования и отчёты в одном месте — видно сразу, укладываетесь ли в лимиты.'], activation: 'Всё в одном месте: бронируйте, согласовывайте и смотрите отчёты без переключения между разными системами.' },
    { segmentName: 'Крупный бизнес', segmentDesc: 'Командировки организует отдел или корпоративный сервис, поездок много, расходы регулируются политикой и согласованиями.', benefits: ['При выборе отеля сразу видно — в лимите или нужна заявка на согласование.', 'Согласующие видят очередь заявок с приоритетом; отчёты по подразделениям и направлениям — без выгрузок из разных систем.', 'Корпоративные условия и скидки до 40%, интеграции с T&E. Лимиты отображаются при бронировании.'], activation: 'Compliance и отчётность без ручных проверок и ручных выгрузок.' }
  ];

  function show(screenEl) {
    stepsSection.querySelectorAll('.screen').forEach(function(el) { el.classList.remove('active'); });
    if (screenEl) screenEl.classList.add('active');
  }

  function goStep(stepIndex) {
    if (stepIndex >= 0 && stepIndex < 3) show(steps[stepIndex]);
  }

  function finishQuiz() {
    var a0 = answers[0], a1 = answers[1], a2 = answers[2];
    var segment = (a0 === 2 || a1 === 2 || a2 === 2) ? 2 : (a0 === 1 || a1 === 1 || a2 === 1) ? 1 : 0;
    var r = resultData[segment];
    var listEl = document.getElementById('result-benefits');
    listEl.innerHTML = '';
    r.benefits.forEach(function(text) {
      var li = document.createElement('li');
      li.textContent = text;
      listEl.appendChild(li);
    });
    document.getElementById('result-activation').textContent = r.activation;
    document.getElementById('result-segment-note').innerHTML =
      'По вашим ответам: <strong>' + r.segmentName + '</strong>. ' + r.segmentDesc;
    show(screens.result);
  }

  stepsSection.querySelectorAll('.quiz-option').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var seg = parseInt(this.getAttribute('data-segment'), 10);
      var stepId = this.closest('.screen').id;
      var stepIndex = stepId === 'step1' ? 0 : (stepId === 'step2' ? 1 : 2);
      answers[stepIndex] = seg;
      if (stepIndex === 2) finishQuiz(); else goStep(stepIndex + 1);
    });
  });

  stepsSection.querySelectorAll('.quiz-prev').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var screen = this.closest('.screen');
      var i = screen.id === 'step2' ? 0 : 1;
      goStep(i);
    });
  });

  var restartBtn = stepsSection.querySelector('.restart-quiz');
  if (restartBtn) restartBtn.addEventListener('click', function() { answers = []; show(screens.step1); });

  var ctaHotels = document.getElementById('cta-show-hotels');
  var ctaConnect = document.getElementById('cta-connect');
  if (ctaHotels) ctaHotels.addEventListener('click', function(e) { e.preventDefault(); });
  if (ctaConnect) ctaConnect.addEventListener('click', function(e) { e.preventDefault(); });
})();
