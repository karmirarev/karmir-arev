(function () {
  var NAV = [
    { label: 'home', href: '/', color: 'green', strong: true },
    { label: 'projects', href: '/projects/', color: 'lilac', children: [
      { label: 'games', href: '/projects/#games', children: [
        { label: 'sandsong', href: '/projects/#games' },
        { label: 'kami hovani', href: '/projects/#games' },
        { label: 'bebe heist', href: '/projects/games/bebe-heist/', newTab: true },
        { label: 'pingala', href: '/projects/games/pingala/', newTab: true },
        { label: 'khali', href: '/projects/#games' }
      ]},
      { label: 'other', href: '/projects/#other', children: [
        { label: 'mini me and u', href: '/projects/other/mini-me-and-you/' }
      ]}
    ]},
    { label: 'arts-and-crafts', href: '/arts-and-crafts/', color: 'lime', children: [
      { label: 'drawings', href: '/arts-and-crafts/#drawings' },
      { label: 'clay', href: '/arts-and-crafts/#clay' },
      { label: 'papercraft', href: '/arts-and-crafts/#papercraft' },
      { label: '3d-model-painting', href: '/arts-and-crafts/#3d-model-painting' },
      { label: 'events-markets-exhibits', href: '/arts-and-crafts/#events-markets-exhibits' }
    ]},
    { label: 'thinking-out-loud', href: '/thinking-out-loud/', color: 'lilac', children: [
      { label: 'on-art-evolution-ai-and-consciousness', href: '/thinking-out-loud/#on-art-evolution-ai-and-consciousness' }
    ]}
  ];

  var LINKS = [
    { label: 'instagram', href: 'https://www.instagram.com/karmirarev__', newTab: true },
    { label: 'itch.io', href: 'https://karmirarev.itch.io/', newTab: true },
    { label: 'letterboxd', href: 'https://letterboxd.com/karmirarev/', newTab: true },
    { label: 'buymeacoffee', href: 'https://buymeacoffee.com/karmirarev', newTab: true }
  ];

  var menu = document.getElementById('menu');
  if (!menu) return;
  var side = document.createElement('div');
  side.className = 'side';
  menu.parentNode.insertBefore(side, menu);
  side.appendChild(menu);
  var linksBox = document.createElement('div');
  linksBox.className = 'links-box';
  side.appendChild(linksBox);

  function here() {
    var p = location.pathname;
    if (!/\/$/.test(p)) p = p.replace(/[^\/]*$/, '');
    return p + location.hash;
  }

  function trail(items, target, path) {
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      var mine = path.concat([it]);
      if (it.href === target) return mine;
      if (it.children) {
        var deeper = trail(it.children, target, mine);
        if (deeper) return deeper;
      }
    }
    return null;
  }

  function build(items, open, current) {
    var ul = document.createElement('ul');
    items.forEach(function (it) {
      var li = document.createElement('li');
      if (it.color) li.className = 'c-' + it.color;
      var a = document.createElement('a');
      a.href = it.href;
      a.textContent = it.label;
      if (it.newTab) {
        a.target = '_blank';
        a.rel = 'noopener';
      }
      if (it.strong) a.className = 'strong';
      if (it === current) a.className += ' current';
      li.appendChild(a);
      if (it.children) {
        li.className += ' has-kids';
        var isOpen = open.indexOf(it) !== -1;
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'toggle';
        btn.textContent = isOpen ? '-' : '+';
        li.insertBefore(btn, a);
        var sub = build(it.children, open, current);
        sub.hidden = !isOpen;
        li.appendChild(sub);
        btn.onclick = function () {
          sub.hidden = !sub.hidden;
          btn.textContent = sub.hidden ? '+' : '-';
        };
      }
      ul.appendChild(li);
    });
    return ul;
  }

  function render() {
    var cur = here();
    var path = trail(NAV, cur, []) || trail(NAV, cur.split('#')[0], []) || [];
    var current = path[path.length - 1] || null;
    menu.innerHTML = '';

    var tree = build(NAV, path, current);
    tree.className = 'nav';
    menu.appendChild(tree);

    var wrap = document.createElement('div');
    wrap.className = 'map-wrap';
    var map = document.createElement('img');
    map.className = 'menu-map';
    map.src = '/tiles/map2.jpg';
    map.alt = '';
    wrap.appendChild(map);
    var walker = document.createElement('img');
    walker.className = 'walker';
    walker.alt = '';
    wrap.appendChild(walker);
    menu.appendChild(wrap);
    startWalker(walker);

    linksBox.innerHTML = '';
    var lt = document.createElement('p');
    lt.className = 'nav-title c-green';
    lt.textContent = 'elsewhere';
    linksBox.appendChild(lt);
    var links = build(LINKS, [], null);
    links.className = 'nav links';
    linksBox.appendChild(links);
  }

  var SPOTS = {
    home: [30, 24],
    projects: [80, 22],
    arts: [33, 50],
    thinking: [33, 78]
  };
  function sectionOfPath() {
    var p = location.pathname;
    if (p.indexOf('/projects') === 0) return 'projects';
    if (p.indexOf('/arts-and-crafts') === 0) return 'arts';
    if (p.indexOf('/thinking-out-loud') === 0) return 'thinking';
    return 'home';
  }
  var CLIPS = {
    idle: { src: "/walker/idle.gif", w: 23, ax: 45 },
    run:  { src: "/walker/run.gif",  w: 23, ax: 45 },
    jump: { src: "/walker/jump.gif", w: 43, ax: 70, ms: 800 }
  };
  function startWalker(el) {
    var target = SPOTS[sectionOfPath()];
    var from = null;
    try { from = JSON.parse(localStorage.getItem('walker') || 'null'); } catch (e) {}
    if (!from) from = target;
    var facing = 1, clip = null, jumpTimer = null;
    function show(name) {
      if (clip === name) return;
      clip = name;
      var c = CLIPS[name];
      el.src = c.src + (name === 'jump' ? '?t=' + Date.now() : '');
      el.style.width = c.w + '%';
      el.style.transform = 'translate(-' + c.ax + '%, -100%) scaleX(' + facing + ')';
      el.style.transformOrigin = c.ax + '% 100%';
    }
    function face(dir) {
      facing = dir;
      var c = CLIPS[clip || 'idle'];
      el.style.transform = 'translate(-' + c.ax + '%, -100%) scaleX(' + dir + ')';
    }
    function put(x, y) { el.style.left = x + '%'; el.style.top = y + '%'; }
    function goTo(x, y, cb) {
      var cur = [parseFloat(el.style.left), parseFloat(el.style.top)];
      var dist = Math.hypot(x - cur[0], y - cur[1]);
      if (dist < 0.5) { cb(); return; }
      show('run');
      if (x !== cur[0]) face(x < cur[0] ? -1 : 1);
      var ms = dist * 55;
      el.style.transition = 'left ' + ms + 'ms linear, top ' + ms + 'ms linear';
      put(x, y);
      setTimeout(cb, ms + 30);
    }
    function land(cb) {
      show('jump');
      clearTimeout(jumpTimer);
      jumpTimer = setTimeout(function () { show('idle'); cb && cb(); }, CLIPS.jump.ms);
    }
    el.style.transition = 'none';
    show('idle');
    put(from[0], from[1]);
    try { localStorage.setItem('walker', JSON.stringify(target)); } catch (e) {}
    var side = 0;
    function wander() {
      side = side ? 0 : 1;
      var dx = side ? 6 : 0;
      setTimeout(function () {
        goTo(target[0] + dx, target[1], function () {
          show('idle');
          setTimeout(wander, 3000 + Math.random() * 3000);
        });
      }, 0);
    }
    setTimeout(function () {
      goTo(target[0], target[1], function () {
        land(function () { setTimeout(wander, 2500); });
      });
    }, 300);
  }

  render();
  window.addEventListener('hashchange', render);
})();
