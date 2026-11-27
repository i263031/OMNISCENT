/* ===== Omniscent shared helpers ===== */
(function () {
  var KEYS = { cart: 'omniscent_cart', wish: 'omniscent_wishlist' };

  var Omni = window.Omni = {
    keys: KEYS,
    get: function (k, fallback) {
      try { var v = JSON.parse(localStorage.getItem(k)); return v === null ? fallback : v; }
      catch (e) { return fallback; }
    },
    set: function (k, v) {
      try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
    },
    money: function (n) { return 'Rs. ' + Number(n).toLocaleString('en-US'); },
    esc: function (s) {
      var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
      return String(s).replace(/[&<>"']/g, function (c) { return map[c]; });
    },
    toast: function (msg) {
      var t = document.getElementById('toast');
      if (!t) return;
      t.textContent = msg;
      t.classList.add('show');
      clearTimeout(Omni._t);
      Omni._t = setTimeout(function () { t.classList.remove('show'); }, 2600);
    },
    badges: function () {
      var cart = Omni.get(KEYS.cart, []), n = 0;
      cart.forEach(function (i) { n += i.qty; });
      var cb = document.getElementById('cartBadge'), wb = document.getElementById('wishBadge');
      if (cb) cb.textContent = n;
      if (wb) wb.textContent = Omni.get(KEYS.wish, []).length;
    },
    addToCart: function (id, qty) {
      var cart = Omni.get(KEYS.cart, []), found = false;
      cart.forEach(function (i) { if (i.id === id) { i.qty += qty || 1; found = true; } });
      if (!found) cart.push({ id: id, qty: qty || 1 });
      Omni.set(KEYS.cart, cart);
      Omni.badges();
    },
    check: function (el, ok, msg) {
      var f = el.closest('.field');
      f.classList.toggle('invalid', !ok);
      var e = f.querySelector('.err');
      if (e) e.textContent = ok ? '' : msg;
      el.setAttribute('aria-invalid', ok ? 'false' : 'true');
      return ok;
    },
    isEmail: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); },
    isPhone: function (v) { return /^\+?[0-9\s-]{10,16}$/.test(v); }
  };

  /* demo data: seeds the wishlist the first time any page loads */
  if (Omni.get(KEYS.wish, null) === null) {
    Omni.set(KEYS.wish, ['bleu', 'miss', 'sauvage', 'si', 'oud', 'br540']);
  }

  /* header, mobile menu, footer year, newsletter */
  var header = document.getElementById('siteHeader');
  var toggle = document.getElementById('menuToggle');
  var menu = document.getElementById('mainNav');
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 8); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  toggle.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  document.getElementById('year').textContent = new Date().getFullYear();

  var nf = document.getElementById('newsForm'), ne = document.getElementById('newsEmail');
  nf.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!Omni.isEmail(ne.value.trim())) { Omni.toast('Enter a valid email address.'); ne.focus(); return; }
    Omni.toast('You are subscribed. Welcome to the loop.');
    nf.reset();
  });

  /* clear a field's error as soon as the person edits it */
  document.addEventListener('input', function (e) {
    var f = e.target.closest ? e.target.closest('.field.invalid') : null;
    if (!f) return;
    f.classList.remove('invalid');
    var er = f.querySelector('.err');
    if (er) er.textContent = '';
  });

  Omni.badges();
})();
/* ===== /shared helpers ===== */


/* ===== Page 14: Wishlist / saved scents ===== */
(function () {
  /* sample catalogue - swap the svg bottle for <img src="..."> when you have product photos */
  var P = [
    { id: 'bleu',    name: 'Bleu de Chanel',      brand: 'Chanel',          price: 24999, cat: 'men',    tone: 'dark' },
    { id: 'miss',    name: 'Miss Dior',           brand: 'Dior',            price: 22999, cat: 'women',  tone: 'rose' },
    { id: 'sauvage', name: 'Sauvage Elixir',      brand: 'Dior',            price: 26499, cat: 'men',    tone: 'dark' },
    { id: 'si',      name: 'Si Eau de Parfum',    brand: 'Giorgio Armani',  price: 20999, cat: 'women',  tone: 'peach' },
    { id: 'oud',     name: 'Oud Wood',            brand: 'Tom Ford',        price: 38999, cat: 'unisex', tone: 'dark' },
    { id: 'br540',   name: 'Baccarat Rouge 540',  brand: 'Maison Francis Kurkdjian', price: 42999, cat: 'unisex', tone: 'rose' }
  ];
  var COLORS = { dark: ['#0a0808', '#17100f'], rose: ['#a8a0a2', '#ee8f9a'], peach: ['#1a1212', '#f2b49c'] };
  var HEART = 'M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z';
  var BASKET = '<path d="M4 8h16l-1.5 11a2 2 0 0 1-2 1.7H7.5a2 2 0 0 1-2-1.7L4 8z"/><path d="M8 8a4 4 0 0 1 8 0"/>';
  var state = { cat: 'all', sort: 'recent' };
  var esc = Omni.esc;
  var grid = document.getElementById('grid'), empty = document.getElementById('empty');

  function bottle(tone) {
    var c = COLORS[tone];
    return '<svg viewBox="0 0 120 150" aria-hidden="true">' +
      '<rect x="46" y="8" width="28" height="22" rx="3" fill="' + c[0] + '"/>' +
      '<rect x="54" y="30" width="12" height="10" fill="' + c[0] + '"/>' +
      '<rect x="22" y="40" width="76" height="100" rx="10" fill="' + c[1] + '"/>' +
      '<rect x="30" y="48" width="8" height="84" rx="4" fill="rgba(255,255,255,.18)"/>' +
      '<rect x="44" y="82" width="42" height="22" rx="3" fill="rgba(255,255,255,.28)"/></svg>';
  }
  function saved() {
    return Omni.get(Omni.keys.wish, []).map(function (id) {
      return P.filter(function (p) { return p.id === id; })[0];
    }).filter(Boolean);
  }
  function visible() {
    var l = saved().filter(function (p) { return state.cat === 'all' || p.cat === state.cat; });
    if (state.sort === 'low') l.sort(function (a, b) { return a.price - b.price; });
    if (state.sort === 'high') l.sort(function (a, b) { return b.price - a.price; });
    if (state.sort === 'name') l.sort(function (a, b) { return a.name.localeCompare(b.name); });
    return l;
  }
  function card(p) {
    return '<article class="p-card" data-id="' + p.id + '">' +
      '<div class="p-img tone-' + p.tone + '">' +
      '<button type="button" class="heart-btn" data-act="remove" aria-label="Remove ' + esc(p.name) + ' from wishlist"><svg viewBox="0 0 24 24"><path d="' + HEART + '"/></svg></button>' +
      bottle(p.tone) + '</div>' +
      '<div class="p-body"><div><h3>' + esc(p.name) + '</h3><p class="p-brand">' + esc(p.brand) + '</p><p class="price">' + Omni.money(p.price) + '</p></div>' +
      '<button type="button" class="cart-btn" data-act="cart" aria-label="Add ' + esc(p.name) + ' to bag"><svg viewBox="0 0 24 24" aria-hidden="true">' + BASKET + '</svg></button></div></article>';
  }
  function render() {
    var all = saved(), v = visible();
    document.querySelectorAll('[data-cat]').forEach(function (b) {
      var c = b.dataset.cat, on = c === state.cat;
      var n = c === 'all' ? all.length : all.filter(function (p) { return p.cat === c; }).length;
      b.querySelector('.n').textContent = '(' + n + ')';
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', on);
    });
    grid.innerHTML = v.map(card).join('');
    document.getElementById('resultCount').textContent = v.length + (v.length === 1 ? ' saved scent' : ' saved scents');
    document.getElementById('addAll').disabled = v.length === 0;
    empty.hidden = v.length > 0;
    if (!v.length) {
      var none = all.length === 0;
      document.getElementById('emptyTitle').textContent = none ? 'Your wishlist is empty' : 'Nothing saved here yet';
      document.getElementById('emptyText').textContent = none ? 'Tap the heart on any fragrance to save it here.' : 'You have no saved scents in this category.';
    }
  }

  document.getElementById('catFilters').addEventListener('click', function (e) {
    var b = e.target.closest('[data-cat]');
    if (b) { state.cat = b.dataset.cat; render(); }
  });
  document.getElementById('sortSel').addEventListener('change', function (e) { state.sort = e.target.value; render(); });

  grid.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]');
    if (!b) return;
    var id = b.closest('.p-card').dataset.id;
    var p = P.filter(function (x) { return x.id === id; })[0];
    if (b.dataset.act === 'remove') {
      Omni.set(Omni.keys.wish, Omni.get(Omni.keys.wish, []).filter(function (x) { return x !== id; }));
      Omni.badges(); render();
      Omni.toast(p.name + ' removed from your wishlist.');
    } else {
      Omni.addToCart(id, 1);
      Omni.toast(p.name + ' added to your bag.');
    }
  });

  document.getElementById('addAll').addEventListener('click', function () {
    var v = visible();
    v.forEach(function (p) { Omni.addToCart(p.id, 1); });
    Omni.toast(v.length + (v.length === 1 ? ' item' : ' items') + ' added to your bag.');
  });

  render();
})();
