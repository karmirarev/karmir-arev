(function () {
  var SEGS = [
    { s: 1.2 },
    { k: 'd', to: 0, s: 1.1 }, { s: 0.35 },
    { k: 'c', to: 0, s: 1 }, { s: 0.35 },
    { k: 'b', to: 0, s: 1 }, { s: 0.35 },
    { k: 'a', to: 0, s: 1 },
    { s: 2.2 },
    { k: 'a', to: 1, s: 0.9 }, { s: 0.2 },
    { k: 'b', to: 1, s: 0.9 }, { s: 0.2 },
    { k: 'c', to: 1, s: 0.9 }, { s: 0.2 },
    { k: 'd', to: 1, s: 1 }
  ];
  var LOOP = SEGS.reduce(function (n, g) { return n + g.s; }, 0);
  var PI = Math.PI;

  function state(t) {
    var f = { a: 1, b: 1, c: 1, d: 1 }, tilt = 0;
    t = ((t % LOOP) + LOOP) % LOOP;
    for (var i = 0; i < SEGS.length; i++) {
      var g = SEGS[i];
      if (t < g.s) {
        if (g.k) {
          var from = f[g.k], q = t / g.s;
          f[g.k] = from + (g.to - from) * (0.5 - 0.5 * Math.cos(PI * q));
          tilt = Math.sin(PI * q);
        }
        break;
      }
      if (g.k) f[g.k] = g.to;
      t -= g.s;
    }
    return { f: f, tilt: tilt };
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

  function init(el) {
    if (el._zine) return;
    var scene = document.createElement('div'), faces = [];
    el._zine = true;
    el.style.position = 'relative';
    el.style.width = '100%';
    el.style.aspectRatio = '25 / 18';
    scene.style.cssText = 'position:absolute;left:0;top:0;width:0;height:0;transform-style:preserve-3d';
    for (var r = 0; r < 2; r++) for (var c = 0; c < 4; c++) for (var side = 0; side < 2; side++) {
      var d = document.createElement('div');
      d.style.cssText = 'position:absolute;left:0;top:0;transform-origin:0 0;backface-visibility:hidden;-webkit-backface-visibility:hidden;background-repeat:no-repeat';
      d.style.backgroundImage = 'url("' + (side ? el.dataset.outside : el.dataset.poster) + '")';
      faces.push({ el: d, r: r, c: c, back: side === 1 });
      scene.appendChild(d);
    }
    el.appendChild(scene);

    var W, H, EW, EH, g;
    function size() {
      EW = el.clientWidth;
      EH = el.clientHeight;
      var ratio = 1191 / 2 / (1684 / 4);
      var w0 = Math.min(EW * 0.9 / 4, EH * 0.86 / 2 / ratio);
      W = Math.min(EW * 0.9, EH * 0.86 / ratio, w0 * 1.7);
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

    function draw(t) {
      var st = state(t), f = st.f;
      var col = [[1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]];
      col[1] = rotV(W, 1.5 * g, PI * f.c);
      col[2] = mul(col[1], rotV(2 * W, g, PI * f.b));
      col[3] = mul(col[2], rotV(3 * W, 0.5 * g, PI * f.a));
      var top = rotH(H, 3.5 * g, PI * f.d);
      faces.forEach(function (fc) {
        var cell = fc.r ? col[fc.c] : mul(top, col[fc.c]);
        var local = fc.back
          ? [-1, 0, 0, 0, 1, 0, 0, 0, -1, (fc.c + 1) * W, fc.r * H, 0]
          : [1, 0, 0, 0, 1, 0, 0, 0, 1, fc.c * W, fc.r * H, 0];
        fc.el.style.transform = css(mul(cell, local));
      });
      var bw = W * (4 - f.a - f.b - f.c), y0 = H * f.d, bh = 2 * H - y0;
      var s = Math.min(EW * 0.9 / bw, EH * 0.86 / bh, 1);
      scene.style.transform = 'translate(' + EW / 2 + 'px,' + EH / 2 + 'px) rotateX(' + (8 * st.tilt) + 'deg) rotateY(' + (-6 * st.tilt) + 'deg) scale3d(' + s + ',' + s + ',' + s + ') translate(' + (-bw / 2) + 'px,' + (-(y0 + bh / 2)) + 'px)';
    }

    var fixed = parseFloat(new URLSearchParams(location.search).get('zine'));
    var clock = 0, last = 0, running = false, seen = false;
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) fixed = 7.5;
    function frame(now) {
      if (!el.isConnected) {
        io.disconnect();
        ro.disconnect();
        document.removeEventListener('visibilitychange', wake);
        running = false;
        return;
      }
      if (!seen || document.hidden || !isNaN(fixed)) { running = false; return; }
      clock += Math.min(0.1, (now - last) / 1000);
      last = now;
      draw(clock);
      requestAnimationFrame(frame);
    }
    function wake() {
      if (running || !seen || document.hidden) return;
      running = true;
      last = performance.now();
      requestAnimationFrame(frame);
    }
    var io = new IntersectionObserver(function (es) { seen = es[0].isIntersecting; wake(); });
    var ro = new ResizeObserver(function () { size(); draw(isNaN(fixed) ? clock : fixed); });
    document.addEventListener('visibilitychange', wake);
    size();
    draw(isNaN(fixed) ? 0 : fixed);
    io.observe(el);
    ro.observe(el);
    el.zineAt = function (t) { fixed = t; draw(t); };
  }

  window.zineFold = function () {
    document.querySelectorAll('.zine-fold[data-outside][data-poster]').forEach(init);
  };
  window.zineFold();
})();
