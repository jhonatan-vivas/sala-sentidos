/* Búsqueda sencilla en el navegador sobre clases, señas y recursos */
(function () {
  'use strict';
  var datos = [];
  try { datos = JSON.parse(document.getElementById('indice-busqueda').textContent); } catch (e) {}
  var form = document.querySelector('[data-buscar]');
  var input = form.querySelector('input');
  var estado = document.querySelector('[data-buscar-estado]');
  var lista = document.querySelector('[data-buscar-resultados]');

  function normalizar(s) { return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

  function buscar(q) {
    lista.innerHTML = '';
    var nq = normalizar(q).trim();
    if (!nq) { estado.textContent = 'Escribe una palabra para buscar.'; return; }
    var palabras = nq.split(/\s+/);
    var res = datos.filter(function (d) {
      var t = normalizar(d.titulo + ' ' + d.tipo + ' ' + d.texto);
      return palabras.every(function (p) { return t.indexOf(p) >= 0; });
    });
    estado.textContent = res.length ? res.length + (res.length === 1 ? ' resultado' : ' resultados') + ' para «' + q + '»' : 'No encontramos resultados para «' + q + '». Prueba con otra palabra.';
    res.forEach(function (d) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = d.url;
      var s = document.createElement('strong'); s.textContent = d.titulo;
      var t = document.createElement('span'); t.className = 'texto-suave'; t.textContent = d.tipo;
      a.appendChild(s); a.appendChild(t); li.appendChild(a); lista.appendChild(li);
    });
  }

  var q = new URLSearchParams(location.search).get('q') || '';
  input.value = q;
  buscar(q);
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    history.replaceState(null, '', '?q=' + encodeURIComponent(input.value));
    buscar(input.value);
  });
})();
