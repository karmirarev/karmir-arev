(function () {
  var content = document.getElementById('content');
  if (!content) return;
  var KEY = 'deco-positions:' + location.pathname;
  var saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(KEY) || localStorage.getItem('deco-positions') || '{}');
  } catch (e) {}

  document.querySelectorAll('.deco').forEach(function (img) {
    img.draggable = false;
    var id = img.dataset.id;
    if (saved[id]) {
      img.style.left = saved[id].x + 'px';
      img.style.top = saved[id].y + 'px';
      img.style.bottom = 'auto';
    }
  });

  var drag = null;
  content.addEventListener('pointerdown', function (e) {
    var img = e.target.closest('.deco');
    if (!img) return;
    var box = content.getBoundingClientRect();
    var r = img.getBoundingClientRect();
    drag = { img: img, dx: e.clientX - r.left, dy: e.clientY - r.top, box: box, w: r.width, h: r.height };
    img.classList.add('dragging');
    img.setPointerCapture(e.pointerId);
    e.preventDefault();
  });
  content.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var x = e.clientX - drag.box.left - drag.dx;
    var y = e.clientY - drag.box.top - drag.dy;
    x = Math.max(0, Math.min(x, drag.box.width - drag.w));
    y = Math.max(0, Math.min(y, drag.box.height - drag.h));
    drag.img.style.left = x + 'px';
    drag.img.style.top = y + 'px';
    drag.img.style.bottom = 'auto';
  });
  function stop() {
    if (!drag) return;
    var img = drag.img;
    img.classList.remove('dragging');
    saved[img.dataset.id] = { x: parseFloat(img.style.left), y: parseFloat(img.style.top) };
    try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) {}
    drag = null;
  }
  content.addEventListener('pointerup', stop);
  content.addEventListener('pointercancel', stop);
})();
