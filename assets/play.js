/* Mochi play page — headpat clicker + "which critter are you" quiz */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function burst(x, y, n) {
    if (reduce) return;
    var emo = ['💗', '🌸', '✨', '🍡', '🩷', '💕'];
    for (var i = 0; i < n; i++) {
      var s = document.createElement('span');
      s.className = 'float-heart';
      s.textContent = emo[Math.floor(Math.random() * emo.length)];
      s.style.left = (x + (Math.random() * 60 - 30)) + 'px';
      s.style.top = (y + (Math.random() * 40 - 20)) + 'px';
      s.style.animationDuration = (0.8 + Math.random() * 0.6) + 's';
      document.body.appendChild(s);
      s.addEventListener('animationend', function () { s.remove(); });
    }
  }

  /* ---- headpat clicker ---- */
  var pat = document.getElementById('pat-btn');
  var patCount = document.getElementById('pat-count');
  var patMsg = document.getElementById('pat-msg');
  var PAT_KEY = 'mochi_pats';
  var msgs = ['mochi purrs 🐱', 'soft boop 💕', 'mochi blushes 🩷', 'happy mochi ✨', 'more please~ 🍡'];

  function getPats() { return parseInt(localStorage.getItem(PAT_KEY) || '0', 10) || 0; }
  if (patCount) patCount.textContent = getPats();

  if (pat) {
    pat.addEventListener('click', function (e) {
      var n = getPats() + 1;
      localStorage.setItem(PAT_KEY, String(n));
      if (patCount) patCount.textContent = n;
      if (patMsg) patMsg.textContent = msgs[Math.floor(Math.random() * msgs.length)];
      burst(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2, 8);
      pat.classList.remove('bounce'); void pat.offsetWidth; pat.classList.add('bounce');
    });
  }

  /* ---- quiz ---- */
  var quizData = [
    { q: 'A perfect sunday involves…', opts: [
      { t: 'napping in a sunbeam', c: 'cat' },
      { t: 'exploring a cozy dark cave', c: 'bat' },
      { t: 'reading a wise old book', c: 'owl' },
      { t: 'zooming through the forest', c: 'fox' } ] },
    { q: 'Pick a snack', opts: [
      { t: 'warm milk', c: 'cat' },
      { t: 'moonberries', c: 'bat' },
      { t: 'honey toast', c: 'owl' },
      { t: 'a sweet bun', c: 'fox' } ] },
    { q: 'Your coding style is…', opts: [
      { t: 'soft & cuddly', c: 'cat' },
      { t: 'quiet & mysterious', c: 'bat' },
      { t: 'thoughtful & tidy', c: 'owl' },
      { t: 'fast & playful', c: 'fox' } ] }
  ];
  var results = {
    cat: { emoji: '🐱', name: 'The Cozy Cat', desc: 'You love cat-ascii-faces and snug little repos. Soft, warm, and impossible not to love.' },
    bat: { emoji: '🦇', name: 'The Night Bat', desc: 'Like sharkdp/bat, you shine in the dark with style. A little mysterious, very cool.' },
    owl: { emoji: '🦉', name: 'The Wise Owl', desc: 'Like exercism, you help others learn. Patient, kind, and full of gentle wisdom.' },
    fox: { emoji: '🦊', name: 'The Playful Fox', desc: 'Quick, clever, and full of mischief. You make even boring code feel like a game.' }
  };

  var quizBox = document.getElementById('quiz');
  var step = 0, scores = { cat: 0, bat: 0, owl: 0, fox: 0 };

  function renderQuiz() {
    if (!quizBox) return;
    if (step >= quizData.length) return showResult();
    var item = quizData[step];
    quizBox.innerHTML =
      '<p class="quiz-step">question ' + (step + 1) + ' of ' + quizData.length + '</p>' +
      '<h3 class="quiz-q">' + item.q + '</h3>' +
      '<div class="quiz-opts">' +
        item.opts.map(function (o) {
          return '<button class="quiz-opt" data-c="' + o.c + '">' + o.t + '</button>';
        }).join('') +
      '</div>';
    quizBox.querySelectorAll('.quiz-opt').forEach(function (b) {
      b.addEventListener('click', function () {
        scores[b.getAttribute('data-c')]++;
        step++; renderQuiz();
      });
    });
  }

  function showResult() {
    var best = 'cat', max = -1;
    Object.keys(scores).forEach(function (k) {
      if (scores[k] > max) { max = scores[k]; best = k; }
    });
    var r = results[best];
    quizBox.innerHTML =
      '<div class="quiz-result">' +
        '<div class="result-emoji">' + r.emoji + '</div>' +
        '<h3>You are… ' + r.name + '!</h3>' +
        '<p>' + r.desc + '</p>' +
        '<button class="btn" id="quiz-again">play again 🔁</button>' +
      '</div>';
    var again = document.getElementById('quiz-again');
    if (again) again.addEventListener('click', function () {
      step = 0; scores = { cat: 0, bat: 0, owl: 0, fox: 0 }; renderQuiz();
    });
    burst(window.innerWidth / 2, window.innerHeight / 2, 14);
  }

  renderQuiz();
})();
