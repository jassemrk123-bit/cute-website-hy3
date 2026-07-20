/* Mochi gallery — filter, search, favorites (localStorage) */
(function () {
  'use strict';
  var data = window.MOCHI_DATA || [];
  var grid = document.getElementById('repo-grid');
  var search = document.getElementById('search');
  var favBar = document.getElementById('fav-count');
  var catWrap = document.getElementById('cats');
  var FAV_KEY = 'mochi_favs';

  function getFavs() {
    try { return JSON.parse(localStorage.getItem(FAV_KEY)) || []; }
    catch (e) { return []; }
  }
  function setFavs(a) {
    try { localStorage.setItem(FAV_KEY, JSON.stringify(a)); } catch (e) {}
  }
  function updateFavCount() { if (favBar) favBar.textContent = getFavs().length; }

  // initial category from ?cat= (supports "fav" too)
  var params = new URLSearchParams(location.search);
  var cats = ['all', 'fav'].concat(
    data.map(function (r) { return r.category; })
        .filter(function (v, i, a) { return a.indexOf(v) === i; })
  );
  var activeCat = params.get('cat');
  if (!activeCat || cats.indexOf(activeCat) === -1) activeCat = 'all';
  var query = '';

  function toggleFav(id) {
    var f = getFavs(), i = f.indexOf(id);
    if (i > -1) f.splice(i, 1); else f.push(id);
    setFavs(f); updateFavCount(); render();
  }

  function card(r, fav) {
    return '' +
      '<article class="repo-card">' +
        '<div class="repo-top">' +
          '<span class="repo-emoji">' + r.emoji + '</span>' +
          '<button class="fav-btn ' + (fav ? 'is-fav' : '') + '" data-id="' + r.id + '" ' +
            'aria-pressed="' + fav + '" aria-label="Save to favorites">' + (fav ? '💗' : '🤍') + '</button>' +
        '</div>' +
        '<h3 class="repo-name">' + r.name + '</h3>' +
        '<p class="repo-owner">by ' + r.owner + '</p>' +
        '<p class="repo-desc">' + r.desc + '</p>' +
        '<div class="repo-meta">' +
          '<span class="pill">' + r.category + '</span>' +
          '<span class="stars">★ ' + r.stars + '</span>' +
        '</div>' +
        '<a class="repo-link" href="' + r.url + '" target="_blank" rel="noopener">visit on GitHub ↗</a>' +
      '</article>';
  }

  function render() {
    if (!grid) return;
    var f = getFavs();
    var list = data.filter(function (r) {
      var okCat = activeCat === 'all' ||
        (activeCat === 'fav' ? f.indexOf(r.id) > -1 : r.category === activeCat);
      var hay = (r.name + ' ' + r.owner + ' ' + r.desc + ' ' + r.category).toLowerCase();
      var okQ = !query || hay.indexOf(query) > -1;
      return okCat && okQ;
    });
    if (!list.length) {
      grid.innerHTML = '<p class="empty">no cuties found 🥺 try another search~</p>';
      return;
    }
    grid.innerHTML = list.map(function (r) {
      return card(r, f.indexOf(r.id) > -1);
    }).join('');
    grid.querySelectorAll('.fav-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        toggleFav(btn.getAttribute('data-id'));
      });
    });
  }

  if (catWrap) {
    var labels = { all: 'All', fav: 'Favorites 💗' };
    catWrap.innerHTML = cats.map(function (c) {
      var label = labels[c] || ('#' + c);
      return '<button class="chip ' + (c === activeCat ? 'active' : '') + '" data-cat="' + c + '">' + label + '</button>';
    }).join('');
    catWrap.querySelectorAll('.chip').forEach(function (b) {
      b.addEventListener('click', function () {
        activeCat = b.getAttribute('data-cat');
        catWrap.querySelectorAll('.chip').forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        render();
      });
    });
  }

  if (search) {
    search.addEventListener('input', function () {
      query = search.value.trim().toLowerCase();
      render();
    });
  }

  updateFavCount();
  render();
})();
