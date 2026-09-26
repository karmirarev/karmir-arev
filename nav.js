(function () {
  var NAV = [
    { label: 'home', href: '/', color: 'green', strong: true },
    { label: 'projects', href: '/projects/', color: 'lilac', children: [
      { label: 'games', href: '/projects/#games', updated: '2026-09-24', children: [
        { label: 'sandsong', href: '/projects/#sandsong' },
        { label: 'kami hovani', href: '/projects/#kami-hovani' },
        { label: 'pingala', href: '/projects/#pingala' },
        { label: 'khali', href: '/projects/#khali' },
        { label: 'bebe heist', href: '/projects/#bebe-heist' },
        { label: 'disco market', href: '/projects/#disco-market' }
      ]},
      { label: 'other', href: '/projects/#other', updated: '2026-04-07', children: [
        { label: 'mini me and u', href: '/projects/other/mini-me-and-you/' }
      ]}
    ]},
    { label: 'arts-and-crafts', href: '/arts-and-crafts/', color: 'lime', children: [
      { label: 'drawings', href: '/arts-and-crafts/#drawings', updated: '2026-04-21' },
      { label: 'clay', href: '/arts-and-crafts/#clay', tint: '#9da06a' },
      { label: 'papercraft', href: '/arts-and-crafts/#papercraft', updated: '2026-04-07' },
      { label: '3d-model-painting', href: '/arts-and-crafts/#3d-model-painting', updated: '2026-09-24' },
      { label: 'events-markets-exhibits', href: '/arts-and-crafts/#events-markets-exhibits', tint: '#e0a9a0', updated: '2025-11' }
    ]},
    { label: 'thinking-out-loud', href: '/thinking-out-loud/', color: 'lilac', children: [
      { label: 'on-art-evolution-ai-and-consciousness', href: '/thinking-out-loud/#on-art-evolution-ai-and-consciousness', updated: '2026-04-07' }
    ]}
  ];

  var LINKS = [
    { label: 'instagram', href: 'https://www.instagram.com/karmirarev__', newTab: true },
    { label: 'itch.io', href: 'https://karmirarev.itch.io/', newTab: true },
    { label: 'letterboxd', href: 'https://letterboxd.com/karmirarev/', newTab: true },
    { label: 'anilist', href: 'https://anilist.co/user/karmirarev/animelist', newTab: true },
    { label: 'goodreads', href: 'https://www.goodreads.com/user/show/156882035-marita', newTab: true }
  ];

  var SUPPORT = [
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
  var guy = document.createElement('img');
  guy.className = 'guy';
  guy.src = '/guy.gif';
  guy.alt = '';
  side.appendChild(guy);

  function placeGuy() {
    var cur = menu.querySelector('a.current');
    if (!cur || !cur.offsetParent || !guy.offsetHeight) { guy.hidden = !cur || !cur.offsetParent; return; }
    guy.hidden = false;
    var r = cur.getBoundingClientRect(), box = side.getBoundingClientRect();
    guy.style.top = (r.top - box.top + r.height / 2 - guy.offsetHeight * 0.63) + 'px';
  }

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
          placeGuy();
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
    menu.appendChild(linksBox);

    linksBox.innerHTML = '';
    var lt = document.createElement('p');
    lt.className = 'nav-title c-green';
    lt.textContent = 'elsewhere';
    linksBox.appendChild(lt);
    var links = build(LINKS, [], null);
    links.className = 'nav links';
    linksBox.appendChild(links);

    var st = document.createElement('p');
    st.className = 'nav-title c-green support-title';
    st.textContent = 'support me here';
    if (location.pathname === '/' || location.pathname === '/index.html') st.classList.add('rainbow');
    linksBox.appendChild(st);
    var sup = build(SUPPORT, [], null);
    sup.className = 'nav links';
    linksBox.appendChild(sup);
  }

  var M = '#52222b';
  var COLORS = ['#b8b09a', '#b98d7e', '#e2c77a', '#9da06a', '#d9b98a', '#e0a9a0', '#c98a5e', '#c49aa6',
    '#d8cf9a', '#d8c190', '#c9a58c'];

  var SHOULDER = '<svg class="shoulder" viewBox="0 0 22 32"><path fill="var(--c)" d="M0 32C12 32 6 1 17 .5H22V32Z"/>' +
    '<path fill="none" stroke="' + M + '" d="M0 31.5C12 31.5 6 1 17 .5H22"/></svg>';

  function hash(s) {
    var h = 0;
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h;
  }

  var MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

  function newest(it) {
    return (it.children || []).reduce(function (d, k) {
      var n = newest(k);
      return n > d ? n : d;
    }, it.updated || '');
  }

  function nice(d) {
    var p = d.split('-');
    return MONTHS[p[1] - 1] + ' ' + (p[2] ? +p[2] + ', ' : '') + p[0];
  }

  function count(it) {
    if (it.children) return it.children.length;
    var html = typeof sections !== 'undefined' && sections[it.href.split('#')[1]];
    if (!html) return null;
    var n = (html.match(/gallery-item/g) || []).length || (html.match(/<model-viewer/g) || []).length ||
      (html.match(/class="event"/g) || []).length - (html.match(/empty-note/g) || []).length;
    return n || /empty-note|class="gallery"/.test(html) ? n : null;
  }

  function folders() {
    document.querySelectorAll('.folders[data-folders]').forEach(function (box) {
      var key = box.getAttribute('data-folders');
      var parent = trail(NAV, key, []);
      var kids = key === '/' ? NAV.filter(function (it) { return it.href !== '/'; })
        : parent ? parent[parent.length - 1].children || [] : [];
      var h = hash(key);
      box.innerHTML = '';
      kids.forEach(function (it, i) {
        var a = document.createElement('a');
        a.className = 'folder';
        a.href = it.href;
        a.style.setProperty('--c', it.tint || COLORS[(h + i * 3) % COLORS.length]);
        a.style.setProperty('--t', kids.length > 1 ? (i / (kids.length - 1)).toFixed(2) : 0);
        var tab = document.createElement('span');
        tab.className = 'folder-tab';
        var name = document.createElement('span');
        name.className = 'folder-name';
        name.textContent = it.label;
        tab.innerHTML = SHOULDER;
        tab.appendChild(name);
        tab.insertAdjacentHTML('beforeend', SHOULDER);
        var n = count(it), d = newest(it), bits = [];
        if (n !== null) bits.push(n ? '(' + n + (n === 1 ? ' item)' : ' items)') : '(empty)');
        if (d) bits.push('updated ' + nice(d));
        if (bits.length) tab.insertAdjacentHTML('beforeend', '<span class="folder-info"><i></i><span><span>' + bits.join('</span><span>') + '</span></span></span>');
        a.appendChild(tab);
        box.appendChild(a);
      });
    });
  }

  var clickSound = null, audio = null, soundDone = null;
  try {
    audio = new (window.AudioContext || window.webkitAudioContext)();
    fetch('/click-hard.mp3').then(function (r) { return r.arrayBuffer(); })
      .then(function (b) { return audio.decodeAudioData(b); })
      .then(function (buf) { clickSound = buf; })
      .catch(function () {});
  } catch (e) {}

  var CLICKABLE = 'a[href], button, summary, label, input, select, [onclick], [role="button"], .gallery-item img, .shot, canvas[data-toy], .lightbox, model-viewer';
  function playClick(e) {
    if (!audio || !clickSound) return;
    var t = e && e.target;
    if (!t || !t.closest || !t.closest(CLICKABLE)) return;
    if (audio.state === 'suspended') audio.resume();
    var src = audio.createBufferSource(), vol = audio.createGain();
    vol.gain.value = 0.6;
    src.buffer = clickSound;
    src.playbackRate.value = 0.97 + Math.random() * 0.06;
    src.connect(vol).connect(audio.destination);
    soundDone = new Promise(function (ok) { src.onended = ok; });
    src.start();
  }
  document.addEventListener('pointerdown', playClick, true);

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target && a.target !== '_self') return;
    var url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.search === location.search && url.hash) return;
    e.preventDefault();
    var go = function () { location.href = url.href; go = function () {}; };
    var lag = audio ? ((audio.outputLatency || 0) + (audio.baseLatency || 0)) * 1000 : 0;
    if (soundDone) soundDone.then(function () { setTimeout(function () { go(); }, 30 + lag); });
    setTimeout(function () { go(); }, 500);
  });

  render();
  folders();
  placeGuy();
  guy.addEventListener('load', placeGuy);
  window.addEventListener('load', placeGuy);
  window.addEventListener('resize', placeGuy);
  window.addEventListener('hashchange', function () { render(); placeGuy(); });
})();
