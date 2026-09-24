(function () {
  var NAV = [
    { label: 'home', href: '/', color: 'green', strong: true },
    { label: 'projects', href: '/projects/', color: 'lilac', children: [
      { label: 'games', href: '/projects/#games', children: [
        { label: 'sandsong', href: '/projects/#sandsong' },
        { label: 'kami hovani', href: '/projects/#kami-hovani' },
        { label: 'pingala', href: '/projects/#pingala' },
        { label: 'khali', href: '/projects/#khali' },
        { label: 'bebe heist', href: '/projects/#bebe-heist' },
        { label: 'disco market', href: '/projects/#disco-market' }
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
    { label: 'anilist', href: 'https://anilist.co/user/karmirarev/animelist', newTab: true },
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
  }

  render();
  placeGuy();
  guy.addEventListener('load', placeGuy);
  window.addEventListener('load', placeGuy);
  window.addEventListener('resize', placeGuy);
  window.addEventListener('hashchange', function () { render(); placeGuy(); });
})();
