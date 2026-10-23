(function () {
  var PATH = [[0, 0], [1, 0], [1, 1], [0, 1], [0, 2], [1, 2], [1, 3], [0, 3]];
  var LAST = 7, LIFT = 0.15, PI = Math.PI;
  var I = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0];

  function folds(p) {
    var f = [1];
    for (var k = 1; k <= LAST; k++) {
      var a = p - (k - 1);
      f[k] = a <= 0 ? 1 : a <= 1 ? 1 - (1 - LIFT) * a : k === LAST ? LIFT : a >= 2 ? 0 : LIFT * (2 - a);
    }
    return f;
  }

  function mul(A, B) {
    var m = [];
    for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++)
      m.push(A[r * 3] * B[c] + A[r * 3 + 1] * B[3 + c] + A[r * 3 + 2] * B[6 + c]);
    for (r = 0; r < 3; r++)
      m.push(A[r * 3] * B[9] + A[r * 3 + 1] * B[10] + A[r * 3 + 2] * B[11] + A[9 + r]);
    return m;
  }
  function rotV(x0, z0, a) {
    var c = Math.cos(a), s = Math.sin(a);
    return [c, 0, -s, 0, 1, 0, s, 0, c, x0 - c * x0 + s * z0, 0, z0 - s * x0 - c * z0];
  }
  function rotH(y0, z0, a) {
    var c = Math.cos(a), s = Math.sin(a);
    return [1, 0, 0, 0, c, s, 0, -s, c, 0, y0 - c * y0 - s * z0, z0 + s * y0 - c * z0];
  }
  function css(m) {
    return 'matrix3d(' + [m[0], m[3], m[6], 0, m[1], m[4], m[7], 0, m[2], m[5], m[8], 0, m[9], m[10], m[11], 1].join(',') + ')';
  }
  function box(n) {
    var b = [4, 2, 0, 0];
    for (var i = n ? 0 : 1; i <= Math.max(1, n); i++) {
      var p = PATH[i];
      b = [Math.min(b[0], p[1]), Math.min(b[1], p[0]), Math.max(b[2], p[1] + 1), Math.max(b[3], p[0] + 1)];
    }
    return b;
  }

  function init(el) {
    if (el._zine) return;
    el._zine = true;
    el.style.position = 'relative';
    el.style.width = '100%';
    el.style.aspectRatio = '25 / 18';
    var scene = document.createElement('div'), faces = [];
    scene.style.cssText = 'position:absolute;left:0;top:0;width:0;height:0;transform-style:preserve-3d';
    for (var r = 0; r < 2; r++) for (var c = 0; c < 4; c++) for (var side = 0; side < 2; side++) {
      var d = document.createElement('div');
      d.style.cssText = 'position:absolute;left:0;top:0;transform-origin:0 0;backface-visibility:hidden;-webkit-backface-visibility:hidden;background-repeat:no-repeat';
      d.style.backgroundImage = 'url("' + (side ? el.dataset.outside : el.dataset.poster) + '")';
      faces.push({ el: d, r: r, c: c, back: side === 1, i: PATH.findIndex(function (p) { return p[0] === r && p[1] === c; }) });
      scene.appendChild(d);
    }
    var prev = document.createElement('button'), next = document.createElement('button');
    prev.type = next.type = 'button';
    prev.className = 'zine-arrow prev';
    next.className = 'zine-arrow next';
    prev.textContent = '<';
    next.textContent = '>';
    prev.title = 'fold back';
    next.title = 'unfold';
    el.append(scene, prev, next);

    var W, H, EW, EH, g;
    function size() {
      EW = el.clientWidth;
      EH = el.clientHeight;
      var ratio = 1191 / 2 / (1684 / 4), room = EW - 64;
      var w0 = Math.min(room / 4, EH * 0.86 / 2 / ratio);
      W = Math.min(room, EH * 0.86 / ratio, w0 * 1.7);
      H = W * ratio;
      g = Math.max(1.2, W * 0.008);
      el.style.perspective = (EW * 3) + 'px';
      faces.forEach(function (fc) {
        fc.el.style.width = W + 'px';
        fc.el.style.height = H + 'px';
        fc.el.style.backgroundSize = (4 * W) + 'px ' + (2 * H) + 'px';
        fc.el.style.backgroundPosition = (-(fc.back ? 3 - fc.c : fc.c) * W) + 'px ' + (-fc.r * H) + 'px';
      });
    }

    function draw(p) {
      var f = folds(p), T = [rotH(H, 3.5 * g, PI * f[1]), I];
      for (var i = 2; i <= LAST; i++) {
        var q = PATH[i], o = PATH[i - 1], a = PI * f[i], z0 = (8 - i) * g / 2;
        T[i] = mul(T[i - 1], q[0] !== o[0] ? rotH(H, z0, q[0] < o[0] ? a : -a) : rotV(q[1] * W, z0, a));
      }
      faces.forEach(function (fc) {
        var local = fc.back
          ? [-1, 0, 0, 0, 1, 0, 0, 0, -1, (fc.c + 1) * W, fc.r * H, 0]
          : [1, 0, 0, 0, 1, 0, 0, 0, 1, fc.c * W, fc.r * H, 0];
        fc.el.style.transform = css(mul(T[fc.i], local));
      });
      var n = Math.min(LAST - 1, Math.floor(p)), u = p - n, b0 = box(n), b1 = box(n + 1);
      var b = b0.map(function (v, j) { return v + (b1[j] - v) * u; });
      var bw = (b[2] - b[0]) * W, bh = (b[3] - b[1]) * H;
      var s = Math.min((EW - 64) / bw, EH * 0.86 / bh, 1), tilt = 0.45;
      scene.style.transform = 'translate(' + EW / 2 + 'px,' + EH / 2 + 'px) rotateX(' + (8 * tilt) + 'deg) rotateY(' + (-6 * tilt) + 'deg) scale3d(' + s + ',' + s + ',' + s + ') translate(' + (-(b[0] * W + bw / 2)) + 'px,' + (-(b[1] * H + bh / 2)) + 'px)';
    }

    var at = Math.max(0, Math.min(LAST, parseInt(new URLSearchParams(location.search).get('zine'), 10) || 0));
    function go(d) {
      at = (at + d + LAST + 1) % (LAST + 1);
      draw(at);
    }
    prev.addEventListener('click', function () { go(-1); });
    next.addEventListener('click', function () { go(1); });
    new ResizeObserver(function () { size(); draw(at); }).observe(el);
    size();
    draw(at);
  }

  window.zineFold = function () {
    document.querySelectorAll('.zine-fold[data-outside][data-poster]').forEach(init);
  };
  window.zineFold();
})();
