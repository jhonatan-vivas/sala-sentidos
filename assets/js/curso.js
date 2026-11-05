/* Curso de LSC: pestañas de nivel, lista de clases y videos de cada clase */
(function () {
  'use strict';
  var pestanas = Array.prototype.slice.call(document.querySelectorAll('[data-tab-nivel]'));
  var paneles = Array.prototype.slice.call(document.querySelectorAll('[data-panel-nivel]'));
  if (!pestanas.length) return;

  function mostrarNivel(n) {
    pestanas.forEach(function (t) {
      var sel = t.dataset.tabNivel === String(n);
      t.setAttribute('aria-selected', sel ? 'true' : 'false');
      t.tabIndex = sel ? 0 : -1;
    });
    paneles.forEach(function (p) { p.hidden = p.dataset.panelNivel !== String(n); });
  }

  function mostrarClase(id, desplazar) {
    var art = id && document.getElementById(id);
    if (!art || !art.hasAttribute('data-clase')) return false;
    var panel = art.closest('[data-panel-nivel]');
    mostrarNivel(panel.dataset.panelNivel);
    panel.querySelectorAll('[data-clase]').forEach(function (a) { a.hidden = a !== art; });
    panel.querySelectorAll('.lateral [data-ir-clase]').forEach(function (l) {
      if (l.dataset.irClase === id) l.setAttribute('aria-current', 'page'); else l.removeAttribute('aria-current');
    });
    if (desplazar) art.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return true;
  }

  function primeraDe(n) {
    var panel = paneles.filter(function (p) { return p.dataset.panelNivel === String(n); })[0];
    var a = panel && panel.querySelector('[data-clase]');
    if (a) mostrarClase(a.id, false); else mostrarNivel(n);
  }

  pestanas.forEach(function (t, i) {
    t.addEventListener('click', function () {
      primeraDe(t.dataset.tabNivel);
      history.replaceState(null, '', '#nivel-' + t.dataset.tabNivel);
    });
    t.addEventListener('keydown', function (e) {
      var j = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : null;
      if (j === null) return;
      e.preventDefault();
      var dest = pestanas[(j + pestanas.length) % pestanas.length];
      dest.focus(); dest.click();
    });
  });

  document.addEventListener('click', function (e) {
    var l = e.target.closest('[data-ir-clase]');
    if (!l) return;
    e.preventDefault();
    mostrarClase(l.dataset.irClase, true);
    history.replaceState(null, '', '#' + l.dataset.irClase);
  });

  function desdeAncla() {
    var h = decodeURIComponent(location.hash.slice(1));
    var m = /^nivel-(\d+)$/.exec(h);
    if (m) { primeraDe(m[1]); return; }
    if (!mostrarClase(h, true)) primeraDe(1);
  }
  desdeAncla();
  window.addEventListener('hashchange', desdeAncla);

  /* Videos de cada clase */
  function ytIframe(id, titulo) {
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?rel=0&autoplay=1';
    f.title = titulo || 'Video en LSC';
    f.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen');
    f.setAttribute('allowfullscreen', '');
    return f;
  }
  document.querySelectorAll('[data-clase]').forEach(function (art) {
    var reproductor = art.querySelector('[data-reproductor]');
    var botones = art.querySelectorAll('.boton-video');
    botones.forEach(function (b) {
      b.addEventListener('click', function () {
        botones.forEach(function (o) { o.removeAttribute('aria-current'); });
        b.setAttribute('aria-current', 'true');
        var caja = document.createElement('div');
        if (b.dataset.yt) {
          caja.className = 'video';
          caja.appendChild(ytIframe(b.dataset.yt, b.dataset.titulo));
        } else {
          caja.className = 'video video--pendiente';
          caja.setAttribute('role', 'img');
          caja.setAttribute('aria-label', b.dataset.titulo + ': video pendiente');
          var nota = document.createElement('span');
          nota.className = 'video__nota';
          nota.textContent = b.dataset.titulo + ' · video pendiente';
          caja.appendChild(nota);
        }
        var sello = document.createElement('span');
        sello.className = 'sello'; sello.setAttribute('aria-hidden', 'true'); sello.textContent = 'LSC';
        caja.appendChild(sello);
        reproductor.innerHTML = '';
        reproductor.appendChild(caja);
      });
    });
  });
})();
