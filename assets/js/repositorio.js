/* Repositorio de señas: filtros por área/subárea, búsqueda y ficha de la seña */
(function () {
  'use strict';
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-sena]'));
  if (!items.length) return;

  var filtros = document.querySelectorAll('.filtro');
  var titulo = document.querySelector('[data-repo-titulo]');
  var conteo = document.querySelector('[data-repo-conteo]');
  var vacio = document.querySelector('[data-repo-vacio]');
  var vacioQ = document.querySelector('[data-repo-q]');
  var form = document.querySelector('[data-repo-buscar]');
  var input = form && form.querySelector('input');
  var ficha = document.getElementById('ficha-sena');
  var fichaVideo = ficha.querySelector('[data-ficha-video]');
  var fichaTexto = ficha.querySelector('[data-ficha-texto]');
  var botonVel = ficha.querySelector('[data-velocidad]');

  var estado = { area: '', sub: '', q: '' };

  function normalizar(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
  }

  function aplicar() {
    var q = normalizar(estado.q);
    var visibles = 0;
    items.forEach(function (li) {
      var ver;
      if (q) {
        ver = normalizar(li.dataset.termino).indexOf(q) >= 0 || normalizar(li.dataset.etiquetas).indexOf(q) >= 0;
      } else {
        ver = (!estado.area || li.dataset.area === estado.area) && (!estado.sub || li.dataset.sub === estado.sub);
      }
      li.hidden = !ver;
      if (ver) visibles++;
    });
    filtros.forEach(function (f) {
      var on = !q && f.dataset.area === estado.area && f.dataset.sub === estado.sub;
      f.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    titulo.textContent = q ? 'Resultados de búsqueda' : (!estado.area ? 'Todas las áreas' : (estado.sub ? estado.area + ' › ' + estado.sub : estado.area));
    conteo.textContent = visibles + (visibles === 1 ? ' seña' : ' señas');
    vacio.hidden = visibles > 0;
    if (vacioQ) vacioQ.textContent = estado.q;
  }

  function abrir(li, desplazar) {
    items.forEach(function (o) { o.querySelector('.tarjeta-sena').setAttribute('aria-pressed', o === li ? 'true' : 'false'); });
    fichaVideo.innerHTML = '';
    var yt = li.dataset.yt;
    var caja = document.createElement('div');
    if (yt) {
      caja.className = 'video';
      var f = document.createElement('iframe');
      /* loop=1 + playlist=id repite la seña; enablejsapi permite cambiar la velocidad */
      f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(yt) + '?rel=0&loop=1&playlist=' + encodeURIComponent(yt) + '&enablejsapi=1';
      f.title = 'Seña en LSC: ' + li.dataset.termino;
      f.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen');
      f.setAttribute('allowfullscreen', '');
      caja.appendChild(f);
      botonVel.hidden = false;
    } else {
      caja.className = 'video video--pendiente';
      caja.setAttribute('role', 'img');
      caja.setAttribute('aria-label', 'Video de la seña pendiente');
      caja.innerHTML = '<span class="video__nota">Video de la seña pendiente</span>';
      botonVel.hidden = true;
    }
    var sello = document.createElement('span');
    sello.className = 'sello'; sello.setAttribute('aria-hidden', 'true'); sello.textContent = 'LSC';
    caja.appendChild(sello);
    fichaVideo.appendChild(caja);
    botonVel.setAttribute('aria-pressed', 'false');
    fichaTexto.innerHTML = '';
    fichaTexto.appendChild(li.querySelector('template').content.cloneNode(true));
    ficha.hidden = false;
    if (history.replaceState) history.replaceState(null, '', '#' + li.dataset.id);
    if (desplazar) ficha.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  botonVel.addEventListener('click', function () {
    var lenta = botonVel.getAttribute('aria-pressed') !== 'true';
    botonVel.setAttribute('aria-pressed', lenta ? 'true' : 'false');
    var f = fichaVideo.querySelector('iframe');
    if (f && f.contentWindow) {
      f.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'setPlaybackRate', args: [lenta ? 0.5 : 1] }), '*');
    }
  });

  filtros.forEach(function (f) {
    f.addEventListener('click', function () {
      estado.area = f.dataset.area; estado.sub = f.dataset.sub; estado.q = '';
      if (input) input.value = '';
      aplicar();
    });
  });
  items.forEach(function (li) {
    li.querySelector('.tarjeta-sena').addEventListener('click', function () { abrir(li, true); });
  });
  if (form) {
    form.addEventListener('submit', function (e) { e.preventDefault(); estado.q = input.value; aplicar(); });
    input.addEventListener('input', function () { estado.q = input.value; aplicar(); });
  }

  /* Enlace directo a una seña: /repositorio/#derivada */
  function desdeAncla() {
    var li = location.hash && items.filter(function (o) { return '#' + o.dataset.id === decodeURIComponent(location.hash); })[0];
    if (li) abrir(li, true);
  }
  aplicar();
  desdeAncla();
  window.addEventListener('hashchange', desdeAncla);
})();
