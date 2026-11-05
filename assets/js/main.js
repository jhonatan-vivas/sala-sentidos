/* Sala Conectando Sentidos · UTP — comportamiento común a todas las páginas */
(function () {
  'use strict';

  var doc = document.documentElement;
  var movil = window.matchMedia('(max-width: 760px)');

  function guardar(clave, valor) { try { localStorage.setItem(clave, valor); } catch (e) {} }
  function leer(clave) { try { return localStorage.getItem(clave); } catch (e) { return null; } }

  function ytIframe(id, titulo, autoplay) {
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?rel=0' + (autoplay ? '&autoplay=1' : '');
    f.title = titulo || 'Video en LSC';
    f.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen');
    f.setAttribute('allowfullscreen', '');
    return f;
  }

  /* ── 1. Menú en celular ─────────────────────────────────── */
  var botonMenu = document.querySelector('.boton-menu');
  var lista = document.getElementById('menu-principal');
  if (botonMenu && lista) {
    botonMenu.addEventListener('click', function () {
      var abierto = lista.classList.toggle('abierto');
      botonMenu.setAttribute('aria-expanded', abierto ? 'true' : 'false');
      botonMenu.querySelector('.boton-menu__texto').textContent = abierto ? 'Cerrar' : 'Menú';
    });
  }

  /* ── 2. Seña en LSC de cada opción del menú ─────────────── */
  var senasActivas = leer('sala-senas') !== '0';
  doc.classList.toggle('sin-senas', !senasActivas);

  function crearClip(src, titulo) {
    if (!src) {
      var p = document.createElement('div');
      p.className = 'sena-pendiente';
      p.textContent = 'La seña de «' + titulo + '» estará disponible pronto.';
      return p;
    }
    var v = document.createElement('video');
    v.className = 'sena-clip';
    v.src = src;
    v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true;
    v.setAttribute('playsinline', '');
    v.setAttribute('aria-label', 'Seña en LSC de ' + titulo);
    v.addEventListener('error', function () { v.replaceWith(crearClip('', titulo)); });
    return v;
  }

  var nav = document.querySelector('.nav');
  var panel = document.querySelector('.sena-panel');
  if (nav && panel) {
    var panelTitulo = panel.querySelector('.sena-panel__titulo');
    var panelVideo = panel.querySelector('.sena-panel__video');
    var botonFijar = panel.querySelector('.sena-panel__fijar');
    var fijado = false;
    var actual = null;
    var temporizador = null;

    function mostrar(item) {
      if (!senasActivas || movil.matches) return;
      clearTimeout(temporizador);
      if (actual === item && !panel.hidden) return;
      actual = item;
      panelTitulo.textContent = item.dataset.titulo;
      panelVideo.innerHTML = '';
      panelVideo.appendChild(crearClip(item.dataset.clip, item.dataset.titulo));
      panel.hidden = false;
    }
    function ocultar() {
      fijado = false;
      botonFijar.setAttribute('aria-pressed', 'false');
      botonFijar.textContent = 'Fijar';
      panel.hidden = true;
      panelVideo.innerHTML = '';
      actual = null;
    }

    nav.querySelectorAll('.nav__item').forEach(function (item) {
      var enlace = item.querySelector('.nav__enlace');
      enlace.addEventListener('mouseenter', function () { if (!fijado) mostrar(item); });
      enlace.addEventListener('focus', function () { if (!fijado) mostrar(item); });

      /* Celular: la mano abre la seña debajo de la opción */
      var mano = item.querySelector('.nav__mano');
      var zona = item.querySelector('.nav__sena');
      mano.addEventListener('click', function () {
        var abrir = zona.hidden;
        nav.querySelectorAll('.nav__sena').forEach(function (z) { z.hidden = true; z.innerHTML = ''; });
        nav.querySelectorAll('.nav__mano').forEach(function (m) { m.setAttribute('aria-expanded', 'false'); });
        if (abrir) {
          zona.appendChild(crearClip(item.dataset.clip, item.dataset.titulo));
          zona.hidden = false;
          mano.setAttribute('aria-expanded', 'true');
        }
      });
    });

    nav.addEventListener('mouseleave', function () {
      if (fijado) return;
      temporizador = setTimeout(ocultar, 450);
    });
    nav.addEventListener('mouseenter', function () { clearTimeout(temporizador); });
    nav.addEventListener('focusout', function (e) {
      if (!fijado && !nav.contains(e.relatedTarget)) ocultar();
    });
    botonFijar.addEventListener('click', function () {
      fijado = !fijado;
      botonFijar.setAttribute('aria-pressed', fijado ? 'true' : 'false');
      botonFijar.textContent = fijado ? 'Fijada' : 'Fijar';
    });
    panel.querySelector('.sena-panel__cerrar').addEventListener('click', ocultar);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) ocultar(); });
    movil.addEventListener && movil.addEventListener('change', ocultar);
    window.__salaOcultarSena = ocultar;
  }

  /* ── 3. Panel de accesibilidad ──────────────────────────── */
  var a11yBoton = document.querySelector('.a11y__boton');
  var a11yPanel = document.getElementById('panel-accesibilidad');
  if (a11yBoton && a11yPanel) {
    a11yBoton.addEventListener('click', function () {
      var abrir = a11yPanel.hidden;
      a11yPanel.hidden = !abrir;
      a11yBoton.setAttribute('aria-expanded', abrir ? 'true' : 'false');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !a11yPanel.hidden) { a11yPanel.hidden = true; a11yBoton.setAttribute('aria-expanded', 'false'); a11yBoton.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (!a11yPanel.hidden && !e.target.closest('.a11y')) { a11yPanel.hidden = true; a11yBoton.setAttribute('aria-expanded', 'false'); }
    });
  }

  var tamanos = [87.5, 100, 112.5, 125, 137.5];
  function tamanoActual() { var t = parseFloat(leer('sala-letra')); return tamanos.indexOf(t) >= 0 ? t : 100; }
  function ponerTamano(t) { doc.style.fontSize = t + '%'; guardar('sala-letra', t); }

  var botonContraste = document.querySelector('[data-a11y="contraste"]');
  if (botonContraste) botonContraste.setAttribute('aria-pressed', doc.classList.contains('alto-contraste') ? 'true' : 'false');
  var interruptorSenas = document.querySelector('[data-a11y="senas"]');
  function pintarInterruptor() {
    if (!interruptorSenas) return;
    interruptorSenas.setAttribute('aria-checked', senasActivas ? 'true' : 'false');
    interruptorSenas.querySelector('.a11y__estado').textContent = senasActivas ? 'Sí' : 'No';
  }
  pintarInterruptor();

  /* Lectura en voz alta (descripción audible) con la voz del navegador */
  var voz = window.speechSynthesis;
  var leyendo = false;
  function botonesEscuchar() { return document.querySelectorAll('[data-a11y="escuchar"]'); }
  function marcarEscuchar(on) {
    leyendo = on;
    botonesEscuchar().forEach(function (b) {
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      var t = b.childNodes[b.childNodes.length - 1];
      if (t && t.nodeType === 3) t.textContent = on ? ' Detener lectura' : (b.closest('.a11y') ? 'Escuchar página' : ' Escuchar esta página');
    });
  }
  function escuchar() {
    if (!voz) { alert('Tu navegador no permite la lectura en voz alta.'); return; }
    if (leyendo) { voz.cancel(); marcarEscuchar(false); return; }
    var main = document.getElementById('contenido');
    var texto = main ? main.innerText : document.body.innerText;
    var frase = new SpeechSynthesisUtterance(texto);
    frase.lang = 'es-CO';
    var voces = voz.getVoices().filter(function (v) { return /^es/i.test(v.lang); });
    var co = voces.filter(function (v) { return /CO|419|MX|US/i.test(v.lang); })[0];
    if (co || voces[0]) frase.voice = co || voces[0];
    frase.onend = frase.onerror = function () { marcarEscuchar(false); };
    voz.cancel();
    voz.speak(frase);
    marcarEscuchar(true);
  }
  window.addEventListener('beforeunload', function () { if (voz) voz.cancel(); });

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-a11y]');
    if (!b) return;
    var accion = b.getAttribute('data-a11y');
    var i = tamanos.indexOf(tamanoActual());
    if (accion === 'letra-mas') ponerTamano(tamanos[Math.min(i + 1, tamanos.length - 1)]);
    else if (accion === 'letra-menos') ponerTamano(tamanos[Math.max(i - 1, 0)]);
    else if (accion === 'contraste') {
      var on = doc.classList.toggle('alto-contraste');
      guardar('sala-contraste', on ? '1' : '0');
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    } else if (accion === 'escuchar') escuchar();
    else if (accion === 'senas') {
      senasActivas = !senasActivas;
      guardar('sala-senas', senasActivas ? '1' : '0');
      doc.classList.toggle('sin-senas', !senasActivas);
      pintarInterruptor();
      if (window.__salaOcultarSena) window.__salaOcultarSena();
      document.querySelectorAll('.nav__sena').forEach(function (z) { z.hidden = true; z.innerHTML = ''; });
    }
  });

  /* ── 4. Videos livianos: la miniatura se vuelve reproductor ─ */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('button.video-lite[data-yt]');
    if (!b) return;
    var cont = document.createElement('div');
    cont.className = 'video-lite es-video';
    cont.appendChild(ytIframe(b.dataset.yt, b.dataset.titulo, true));
    b.replaceWith(cont);
    cont.querySelector('iframe').focus();
  });

  /* ── 5. Filtros por categoría (Comunidad Sorda) ─────────── */
  document.querySelectorAll('[data-filtrable]').forEach(function (zona) {
    var chips = zona.querySelectorAll('.chip[data-filtro]');
    var items = zona.querySelectorAll('[data-categoria]');
    var vacio = zona.querySelector('[data-sin-resultados]');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var f = chip.dataset.filtro;
        chips.forEach(function (c) { c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });
        var visibles = 0;
        items.forEach(function (it) {
          var ver = !f || it.dataset.categoria === f;
          it.hidden = !ver;
          if (ver) visibles++;
        });
        if (vacio) vacio.hidden = visibles > 0;
      });
    });
  });

  /* ── 6. Clase: cambiar entre los videos de la clase ─────── */
  var reproductor = document.querySelector('[data-reproductor]');
  if (reproductor) {
    var botones = document.querySelectorAll('.boton-video[data-yt]');
    botones.forEach(function (b) {
      b.addEventListener('click', function () {
        botones.forEach(function (o) { o.removeAttribute('aria-current'); });
        b.setAttribute('aria-current', 'true');
        var caja = document.createElement('div');
        if (b.dataset.yt) {
          caja.className = 'video';
          caja.appendChild(ytIframe(b.dataset.yt, b.dataset.titulo, true));
        } else {
          caja.className = 'video video--pendiente';
          caja.setAttribute('role', 'img');
          caja.setAttribute('aria-label', b.dataset.titulo + ': video pendiente');
          caja.innerHTML = '<span class="video__nota"></span>';
          caja.querySelector('.video__nota').textContent = b.dataset.titulo + ' · video pendiente';
        }
        var sello = document.createElement('span');
        sello.className = 'sello'; sello.setAttribute('aria-hidden', 'true'); sello.textContent = 'LSC';
        caja.appendChild(sello);
        reproductor.innerHTML = '';
        reproductor.appendChild(caja);
        reproductor.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });
  }
})();
