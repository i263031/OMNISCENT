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


/* ===== Page 13: User account / dashboard ===== */
(function () {
  var K = { addr: 'omniscent_addresses', prof: 'omniscent_profile' };
  var esc = Omni.esc, money = Omni.money;
  function $(id) { return document.getElementById(id); }

  /* sample data - replace with your backend / API responses */
  var ORDERS = [
    { id: 'OMN-10482', date: '2026-11-18', status: 'Processing', items: [{ id: 'miss', n: 'Miss Dior', q: 1, p: 22999 }] },
    { id: 'OMN-10417', date: '2026-11-02', status: 'Shipped', items: [{ id: 'sauvage', n: 'Sauvage Elixir', q: 1, p: 26499 }, { id: 'si', n: 'Si Eau de Parfum', q: 1, p: 20999 }] },
    { id: 'OMN-10331', date: '2026-09-21', status: 'Delivered', items: [{ id: 'bleu', n: 'Bleu de Chanel', q: 1, p: 24999 }] },
    { id: 'OMN-10208', date: '2026-07-05', status: 'Cancelled', items: [{ id: 'oud', n: 'Oud Wood', q: 1, p: 38999 }] }
  ];
  var profile = Omni.get(K.prof, { first: 'Guest', last: '', email: '', phone: '' });
  var addrs = Omni.get(K.addr, [
    { id: 1, label: 'Home', name: 'Ayesha Khan', phone: '+92 300 0000000', line: 'House 14, Street 6, F-7/2', city: 'Islamabad', def: true },
    { id: 2, label: 'Work', name: 'Ayesha Khan', phone: '+92 300 0000000', line: 'Office 3, Blue Area', city: 'Islamabad', def: false }
  ]);
  var STATUSES = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  var filter = 'All';

  function fmt(d) {
    return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  function total(o) { return o.items.reduce(function (s, i) { return s + i.p * i.q; }, 0); }

  /* ---- profile ---- */
  function renderProfile() {
    $('heroName').textContent = profile.first;
    $('sideName').textContent = profile.first + ' ' + profile.last;
    $('sideEmail').textContent = profile.email;
    $('avatar').textContent = (profile.first.charAt(0) + profile.last.charAt(0)).toUpperCase();
    $('pFirst').value = profile.first;
    $('pLast').value = profile.last;
    $('pEmail').value = profile.email;
    $('pPhone').value = profile.phone;
  }
  $('profileForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = $('pFirst'), l = $('pLast'), m = $('pEmail'), p = $('pPhone');
    var ok = true;
    ok = Omni.check(f, f.value.trim().length >= 2, 'Enter your first name.') && ok;
    ok = Omni.check(l, l.value.trim().length >= 2, 'Enter your last name.') && ok;
    ok = Omni.check(m, Omni.isEmail(m.value.trim()), 'Enter a valid email address.') && ok;
    ok = Omni.check(p, Omni.isPhone(p.value.trim()), 'Enter a valid phone number, e.g. +92 300 1234567.') && ok;
    if (!ok) return;
    profile = { first: f.value.trim(), last: l.value.trim(), email: m.value.trim(), phone: p.value.trim() };
    Omni.set(K.prof, profile);
    renderProfile();
    Omni.toast('Profile saved.');
  });

  /* ---- orders ---- */
  function orderHTML(o) {
    var rows = o.items.map(function (i) {
      return '<li><span>' + esc(i.n) + ' &times; ' + i.q + '</span><span>' + money(i.p * i.q) + '</span></li>';
    }).join('');
    return '<article class="card order">' +
      '<div class="order-top"><div><h3>Order #' + o.id + '</h3><p class="muted">' + fmt(o.date) + '</p></div>' +
      '<span class="status s-' + o.status.toLowerCase() + '">' + o.status + '</span></div>' +
      '<ul class="order-items">' + rows + '</ul>' +
      '<div class="order-foot"><strong>Total ' + money(total(o)) + '</strong>' +
      '<button type="button" class="btn btn-outline btn-sm" data-reorder="' + o.id + '">Reorder</button></div></article>';
  }
  function renderOrders() {
    $('orderFilters').innerHTML = STATUSES.map(function (s) {
      return '<button type="button" class="chip' + (s === filter ? ' active' : '') + '" data-filter="' + s + '" aria-pressed="' + (s === filter) + '">' + s + '</button>';
    }).join('');
    var list = ORDERS.filter(function (o) { return filter === 'All' || o.status === filter; });
    $('orderList').innerHTML = list.length ? list.map(orderHTML).join('') : '<p class="muted">No ' + filter.toLowerCase() + ' orders yet.</p>';
  }
  function renderOverview() {
    $('stOrders').textContent = ORDERS.length;
    $('stOpen').textContent = ORDERS.filter(function (o) { return o.status === 'Processing' || o.status === 'Shipped'; }).length;
    $('stWish').textContent = Omni.get(Omni.keys.wish, []).length;
    $('recentOrders').innerHTML = ORDERS.slice(0, 2).map(orderHTML).join('');
  }

  /* ---- addresses ---- */
  function saveAddrs() { Omni.set(K.addr, addrs); renderAddrs(); }
  function renderAddrs() {
    $('addrGrid').innerHTML = addrs.map(function (a) {
      return '<article class="card addr"><div class="addr-top"><h3>' + esc(a.label) + '</h3>' +
        (a.def ? '<span class="status s-delivered">Default</span>' : '') + '</div>' +
        '<p>' + esc(a.name) + '<br>' + esc(a.line) + '<br>' + esc(a.city) + '</p>' +
        '<p class="muted">' + esc(a.phone) + '</p>' +
        '<div class="addr-actions"><button type="button" class="link-btn" data-edit="' + a.id + '">Edit</button>' +
        '<button type="button" class="link-btn" data-del="' + a.id + '">Delete</button>' +
        (a.def ? '' : '<button type="button" class="link-btn" data-def="' + a.id + '">Set as default</button>') +
        '</div></article>';
    }).join('') + '<button type="button" class="card addr-add" data-add="1">+ Add new address</button>';
  }
  var modal = $('addrModal'), aForm = $('addrForm'), lastFocus = null;
  function openModal(a) {
    lastFocus = document.activeElement;
    $('addrTitle').textContent = a ? 'Edit address' : 'Add address';
    $('aId').value = a ? a.id : '';
    $('aLabel').value = a ? a.label : 'Home';
    $('aName').value = a ? a.name : (profile.first + ' ' + profile.last);
    $('aPhone').value = a ? a.phone : profile.phone;
    $('aLine').value = a ? a.line : '';
    $('aCity').value = a ? a.city : '';
    $('aDef').checked = a ? a.def : addrs.length === 0;
    aForm.querySelectorAll('.field').forEach(function (f) { f.classList.remove('invalid'); f.querySelector('.err').textContent = ''; });
    modal.classList.add('open');
    $('aName').focus();
  }
  function closeModal() {
    modal.classList.remove('open');
    if (lastFocus) lastFocus.focus();
  }
  aForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var n = $('aName'), p = $('aPhone'), l = $('aLine'), c = $('aCity'), ok = true;
    ok = Omni.check(n, n.value.trim().length >= 2, 'Enter the recipient name.') && ok;
    ok = Omni.check(p, Omni.isPhone(p.value.trim()), 'Enter a valid phone number.') && ok;
    ok = Omni.check(l, l.value.trim().length >= 5, 'Enter your street address.') && ok;
    ok = Omni.check(c, c.value.trim().length >= 2, 'Enter your city.') && ok;
    if (!ok) return;
    var id = $('aId').value, makeDef = $('aDef').checked;
    var data = { label: $('aLabel').value, name: n.value.trim(), phone: p.value.trim(), line: l.value.trim(), city: c.value.trim() };
    if (id) {
      addrs.forEach(function (a) { if (String(a.id) === id) { for (var k in data) a[k] = data[k]; a.def = makeDef || a.def; } });
    } else {
      data.id = Date.now(); data.def = makeDef;
      addrs.push(data);
    }
    if (makeDef) {
      var keep = id || String(data.id);
      addrs.forEach(function (a) { a.def = String(a.id) === keep; });
    }
    if (!addrs.some(function (a) { return a.def; })) addrs[0].def = true;
    saveAddrs();
    closeModal();
    Omni.toast(id ? 'Address updated.' : 'Address added.');
  });
  $('aCancel').addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

  /* ---- panels ---- */
  function show(name) {
    if (!$('panel-' + name)) name = 'overview';
    document.querySelectorAll('.panel').forEach(function (p) { p.classList.toggle('active', p.id === 'panel-' + name); });
    document.querySelectorAll('.side-btn[data-panel]').forEach(function (b) {
      var on = b.dataset.panel === name;
      b.classList.toggle('active', on);
      if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
    if (name === 'overview') renderOverview();
    return name;
  }

  /* ---- one delegated click handler ---- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-panel],[data-filter],[data-reorder],[data-add],[data-edit],[data-del],[data-def]');
    if (!t) return;
    if (t.dataset.panel) {
      var name = show(t.dataset.panel);
      history.replaceState(null, '', '#' + name);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (t.dataset.filter) {
      filter = t.dataset.filter; renderOrders();
    } else if (t.dataset.reorder) {
      var o = ORDERS.filter(function (x) { return x.id === t.dataset.reorder; })[0];
      o.items.forEach(function (i) { Omni.addToCart(i.id, i.q); });
      Omni.toast('Order items added to your bag.');
    } else if (t.dataset.add) {
      openModal(null);
    } else if (t.dataset.edit) {
      openModal(addrs.filter(function (a) { return String(a.id) === t.dataset.edit; })[0]);
    } else if (t.dataset.del) {
      if (!window.confirm('Delete this address?')) return;
      var wasDef = addrs.filter(function (a) { return String(a.id) === t.dataset.del; })[0].def;
      addrs = addrs.filter(function (a) { return String(a.id) !== t.dataset.del; });
      if (wasDef && addrs.length) addrs[0].def = true;
      saveAddrs(); Omni.toast('Address deleted.');
    } else if (t.dataset.def) {
      addrs.forEach(function (a) { a.def = String(a.id) === t.dataset.def; });
      saveAddrs(); Omni.toast('Default address updated.');
    }
  });

  $('logoutBtn').addEventListener('click', function () {
    Omni.toast('You have been signed out.');
    setTimeout(function () { window.location.href = 'index.html'; }, 900);
  });

  /* ---- init ---- */
  renderProfile(); renderOrders(); renderAddrs();
  show(location.hash.slice(1) || 'overview');
})();
