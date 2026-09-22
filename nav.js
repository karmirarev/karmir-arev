(function () {
  var NAV = [
    { label: 'home', href: '/', color: 'green' },
    { label: 'projects', href: '/projects/', color: 'orange', children: [
      { label: 'games', href: '/projects/#games', children: [
        { label: 'bebe heist', href: '/projects/games/bebe-heist/' },
        { label: 'pingala', href: '/projects/games/pingala/' }
      ]},
      { label: 'other', href: '/projects/#other', children: [
        { label: 'mini me and u', href: '/projects/other/mini-me-and-you/' }
      ]}
    ]},
    { label: 'arts-and-crafts', href: '/arts-and-crafts/', color: 'pink', children: [
      { label: 'digital-mixed-media', href: '/arts-and-crafts/#digital-mixed-media' },
      { label: 'clay', href: '/arts-and-crafts/#clay' },
      { label: 'papercraft', href: '/arts-and-crafts/#papercraft' },
      { label: '3d-model-painting', href: '/arts-and-crafts/#3d-model-painting' },
      { label: 'events-markets-exhibits', href: '/arts-and-crafts/#events-markets-exhibits' }
    ]},
    { label: 'thinking-out-loud', href: '/thinking-out-loud/', color: 'blue', children: [
      { label: 'on-art-evolution-ai-and-consciousness', href: '/thinking-out-loud/#on-art-evolution-ai-and-consciousness' },
      { label: 'positive-outlook-on-reality', href: '/thinking-out-loud/#positive-outlook-on-reality' },
      { label: 'reflections-on-armenian-paganism', href: '/thinking-out-loud/#reflections-on-armenian-paganism' },
      { label: 'my-elden-ring-experience', href: '/thinking-out-loud/#my-elden-ring-experience' },
      { label: 'cool-animals-i-have-yet-to-see', href: '/thinking-out-loud/#cool-animals-i-have-yet-to-see' }
    ]}
  ];

  var LINKS = [
    { label: 'instagram', href: 'https://www.instagram.com/karmirarev__' },
    { label: 'itch.io', href: 'https://karmirarev.itch.io/' },
    { label: 'letterboxd', href: 'https://letterboxd.com/karmirarev/' },
    { label: 'buymeacoffee', href: 'https://buymeacoffee.com/karmirarev' }
  ];

  var menu = document.getElementById('menu');
  if (!menu) return;

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

  function parentOf(cur) {
    if (cur.indexOf('#') !== -1) return cur.split('#')[0];
    if (cur === '/') return null;
    return cur.replace(/[^\/]+\/$/, '');
  }

  function build(items, open, current) {
    var ul = document.createElement('ul');
    items.forEach(function (it) {
      var li = document.createElement('li');
      if (it.color) li.className = 'c-' + it.color;
      var a = document.createElement('a');
      a.href = it.href;
      a.textContent = it.label;
      if (it === current) a.className = 'current';
      li.appendChild(a);
      if (it.children) {
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

    var back = parentOf(cur);
    if (back !== null) {
      var b = document.createElement('p');
      b.className = 'nav-back';
      b.innerHTML = '<a href="' + back + '">&lt;- back</a>';
      menu.appendChild(b);
    }

    var tree = build(NAV, path, current);
    tree.className = 'nav';
    menu.appendChild(tree);

    var hr = document.createElement('hr');
    menu.appendChild(hr);
    var lt = document.createElement('p');
    lt.className = 'nav-title c-yellow';
    lt.textContent = 'links';
    menu.appendChild(lt);
    var links = build(LINKS, [], null);
    links.className = 'nav';
    menu.appendChild(links);
  }

  render();
  window.addEventListener('hashchange', render);
})();
