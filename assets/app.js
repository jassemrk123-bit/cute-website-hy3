/* Mochi — shared behaviours: nav, heart trail, reveals, year */
(function () {
  'use strict';

  // footer year
  document.querySelectorAll('.year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? '✕' : '☰';
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = '☰';
      });
    });
  }

  // highlight current page in nav
  var here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-nav a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === here) a.classList.add('active');
  });

  // heart cursor / tap trail
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hearts = ['💗', '💕', '🩷', '🌸', '✨', '🍡'];
  function spawnHeart(x, y) {
    if (reduce) return;
    var h = document.createElement('span');
    h.className = 'float-heart';
    h.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    h.style.left = x + 'px';
    h.style.top = y + 'px';
    document.body.appendChild(h);
    h.addEventListener('animationend', function () { h.remove(); });
  }
  window.addEventListener('pointerdown', function (e) {
    spawnHeart(e.clientX, e.clientY);
  }, { passive: true });

  // scroll reveal
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-visible');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (r) { io.observe(r); });
  } else {
    reveals.forEach(function (r) { r.classList.add('is-visible'); });
  }
})();
