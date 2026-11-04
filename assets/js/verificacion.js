/* Genera el código QR a partir del mismo enlace del botón (botón y QR siempre coinciden) */
(function () {
  'use strict';
  if (typeof window.qrcode !== 'function') return;
  document.querySelectorAll('[data-qr]').forEach(function (caja) {
    var qr = window.qrcode(0, 'M');
    qr.addData(caja.getAttribute('data-qr'));
    qr.make();
    caja.innerHTML = qr.createSvgTag({ cellSize: 6, margin: 2, scalable: true });
    var svg = caja.querySelector('svg');
    if (svg) svg.setAttribute('aria-hidden', 'true');

    var enlace = caja.parentElement.querySelector('[data-qr-descargar]');
    if (!enlace) return;
    enlace.addEventListener('click', function (e) {
      e.preventDefault();
      /* Exporta en PNG de alta resolución para imprimir */
      var n = qr.getModuleCount(), escala = 20, margen = 4;
      var lado = (n + margen * 2) * escala;
      var c = document.createElement('canvas');
      c.width = c.height = lado;
      var ctx = c.getContext('2d');
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, lado, lado);
      ctx.fillStyle = '#000000';
      for (var f = 0; f < n; f++) for (var k = 0; k < n; k++) {
        if (qr.isDark(f, k)) ctx.fillRect((k + margen) * escala, (f + margen) * escala, escala, escala);
      }
      var a = document.createElement('a');
      a.href = c.toDataURL('image/png');
      a.download = enlace.getAttribute('data-qr-descargar');
      document.body.appendChild(a); a.click(); a.remove();
    });
  });
})();
