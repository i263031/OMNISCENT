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


/* ===== Page 15: Contact us / support ===== */
(function () {
  function $(id) { return document.getElementById(id); }
  var form = $('contactForm'), wrap = $('formWrap'), done = $('formDone');
  var msg = $('message'), count = $('msgCount');

  msg.addEventListener('input', function () {
    count.textContent = msg.value.length + ' / ' + msg.maxLength;
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var n = $('cName'), m = $('cEmail'), p = $('cPhone'), t = $('cTopic'), ok = true;
    ok = Omni.check(n, n.value.trim().length >= 2, 'Enter your full name.') && ok;
    ok = Omni.check(m, Omni.isEmail(m.value.trim()), 'Enter a valid email address.') && ok;
    ok = Omni.check(p, p.value.trim() === '' || Omni.isPhone(p.value.trim()), 'Enter a valid phone number or leave it empty.') && ok;
    ok = Omni.check(t, t.value !== '', 'Choose a topic.') && ok;
    ok = Omni.check(msg, msg.value.trim().length >= 10, 'Write at least 10 characters.') && ok;
    if (!ok) {
      var firstBad = form.querySelector('.field.invalid input, .field.invalid select, .field.invalid textarea');
      if (firstBad) firstBad.focus();
      return;
    }
    /* send {name, email, phone, topic, message} to your backend here */
    $('doneText').textContent = 'Thank you, ' + n.value.trim().split(' ')[0] + '. We will reply to ' + m.value.trim() + ' within one working day.';
    wrap.hidden = true;
    done.hidden = false;
    done.focus();
    form.reset();
    count.textContent = '0 / ' + msg.maxLength;
  });

  $('againBtn').addEventListener('click', function () {
    done.hidden = true;
    wrap.hidden = false;
    $('cName').focus();
  });

  /* FAQ accordion: one answer open at a time */
  var qs = document.querySelectorAll('.faq-q');
  qs.forEach(function (b) {
    b.addEventListener('click', function () {
      var wasOpen = b.getAttribute('aria-expanded') === 'true';
      qs.forEach(function (x) {
        x.setAttribute('aria-expanded', 'false');
        $(x.getAttribute('aria-controls')).hidden = true;
      });
      if (!wasOpen) {
        b.setAttribute('aria-expanded', 'true');
        $(b.getAttribute('aria-controls')).hidden = false;
      }
    });
  });
})();
