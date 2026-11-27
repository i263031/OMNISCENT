/**
 * OMNISCENT — Shared Product Catalog, Store Data & LocalStorage State Manager
 * Used across Account (Page 13), Wishlist (Page 14), and Contact (Page 15).
 */

(function (global) {
  'use strict';

  var STORAGE_KEYS = {
    USER: 'omniscent_user',
    ORDERS: 'omniscent_orders',
    ADDRESSES: 'omniscent_addresses',
    WISHLIST: 'omniscent_wishlist',
    CART: 'omniscent_cart',
    INQUIRIES: 'omniscent_inquiries',
    NEWSLETTER: 'omniscent_newsletter'
  };

  var FRAGRANCES = [
    {
      id: 'bleu-de-chanel',
      name: 'Bleu de Chanel',
      category: 'Men',
      concentration: 'Eau de Parfum',
      price50: 19999,
      price100: 24999,
      image: '../images/perfume-bleu.svg',
      alt: 'Bleu de Chanel dark glass bottle on volcanic stone',
      notes: {
        top: 'Grapefruit, Lemon, Mint, Pink Pepper',
        heart: 'Ginger, Nutmeg, Jasmine',
        base: 'Incense, Vetiver, Cedar, Sandalwood'
      },
      inStock: true
    },
    {
      id: 'miss-dior',
      name: 'Miss Dior',
      category: 'Women',
      concentration: 'Eau de Parfum',
      price50: 18499,
      price100: 22999,
      image: '../images/perfume-miss-dior.svg',
      alt: 'Miss Dior blush pink bottle with signature silver bow',
      notes: {
        top: 'Iris, Peony, Lily of the Valley',
        heart: 'Centifolia Rose, Apricot, Peach',
        base: 'Vanilla, Tonka Bean, Benzoin, Musk'
      },
      inStock: true
    },
    {
      id: 'sauvage-elixir',
      name: 'Sauvage Elixir',
      category: 'Men',
      concentration: 'Elixir',
      price50: 22499,
      price100: 26499,
      image: '../images/perfume-sauvage.svg',
      alt: 'Sauvage Elixir midnight lacquered bottle',
      notes: {
        top: 'Cinnamon, Nutmeg, Cardamom, Grapefruit',
        heart: 'Lavender',
        base: 'Licorice, Sandalwood, Amber, Patchouli'
      },
      inStock: true
    },
    {
      id: 'si-edp',
      name: 'Si Eau de Parfum',
      category: 'Women',
      concentration: 'Eau de Parfum',
      price50: 16999,
      price100: 20999,
      image: '../images/perfume-si.svg',
      alt: 'Si Eau de Parfum amber glass bottle with black stone cap',
      notes: {
        top: 'Blackcurrant Nectar',
        heart: 'May Rose, Freesia',
        base: 'Patchouli, Vanilla, Ambroxan, Woods'
      },
      inStock: true
    },
    {
      id: 'velvet-rose',
      name: 'Omniscent Velvet Rose',
      category: 'Unisex',
      concentration: 'Extrait de Parfum',
      price50: 18500,
      price100: 23500,
      image: '../images/perfume-velvet.svg',
      alt: 'Omniscent Velvet Rose rose-gold signature bottle',
      notes: {
        top: 'Saffron, Bergamot, Pink Pepper',
        heart: 'Damask Rose, Praline',
        base: 'Amberwood, Cashmere Musk, White Oud'
      },
      inStock: true
    },
    {
      id: 'oud-royale',
      name: 'Omniscent Oud Royale',
      category: 'Unisex',
      concentration: 'Extrait de Parfum',
      price50: 23999,
      price100: 28999,
      image: '../images/perfume-oud.svg',
      alt: 'Omniscent Oud Royale deep espresso glass bottle with gold cap',
      notes: {
        top: 'Cardamom, Bergamot, Clove',
        heart: 'Smoky Agarwood, Labdanum',
        base: 'Leather, Ambergris, Madagascar Vanilla'
      },
      inStock: true
    }
  ];

  var STORES = [
    {
      id: 'isb-centaurus',
      city: 'Islamabad',
      name: 'Omniscent Flagship Boutique',
      address: 'Shop #12, Centaurus Mall, F-8, Islamabad, Pakistan',
      hours: 'Mon – Sun: 11:00 AM – 10:30 PM',
      phone: '+92 300 1234567',
      services: ['Private Scent Consultation', 'Bottle Engraving', 'In-Store Returns Desk']
    },
    {
      id: 'lhr-packages',
      city: 'Lahore',
      name: 'Omniscent Lahore Atelier',
      address: 'Level 1, Gate 3, Packages Mall, Walton Road, Lahore',
      hours: 'Mon – Sun: 11:30 AM – 11:00 PM',
      phone: '+92 321 7654321',
      services: ['Discovery Kit Bar', 'Gift Wrapping Studio', 'In-Store Returns Desk']
    },
    {
      id: 'khi-dolmen',
      city: 'Karachi',
      name: 'Omniscent Clifton Salon',
      address: 'Ground Floor, Dolmen Mall Clifton, Block 4, Karachi',
      hours: 'Mon – Sun: 12:00 PM – 11:00 PM',
      phone: '+92 333 9876543',
      services: ['Private Scent Consultation', 'Extrait Refill Station', 'Express Pickup']
    }
  ];

  var FAQS = [
    {
      id: 'faq-return',
      category: 'Returns',
      question: 'What is Omniscent’s return and exchange policy?',
      answer:
        'Unopened fragrances with the original cellophane seal intact may be returned or exchanged within 14 days of delivery. You can initiate a return through this Support page or at any Omniscent boutique desk.'
    },
    {
      id: 'faq-tester',
      category: 'Authenticity',
      question: 'Are all Omniscent fragrances 100% authentic?',
      answer:
        'Yes. Every bottle is sourced directly from authorized European perfume houses or crafted in our signature Atelier, complete with batch codes verifiable on delivery.'
    },
    {
      id: 'faq-shipping',
      category: 'Shipping',
      question: 'How long does delivery take across Pakistan?',
      answer:
        'Orders placed before 3:00 PM ship the same day. Delivery takes 1–2 working days in Islamabad, Rawalpindi, Lahore, and Karachi, and 3–4 working days nationwide. Orders above Rs. 25,000 qualify for complimentary express shipping.'
    },
    {
      id: 'faq-damaged',
      category: 'Returns',
      question: 'What if my bottle arrives damaged or leaking?',
      answer:
        'Please share a photo with your Order ID (e.g., OMN-2618) within 48 hours of delivery using the inquiry form above. We dispatch a free priority replacement immediately.'
    },
    {
      id: 'faq-storage',
      category: 'Care',
      question: 'How should I store my perfumes for longest longevity?',
      answer:
        'Keep bottles away from direct sunlight, humidity, and heat. Storing your Eau de Parfum or Extrait in a cool drawer or dressing cabinet preserves top notes for years.'
    }
  ];

  var DEFAULT_USER = {
    fullName: 'Ayesha Tariq',
    email: 'ayesha.tariq@omniscent.pk',
    phone: '+92 301 5548290',
    preferredNote: 'Floral & Warm Amber',
    memberSince: 'March 2025'
  };

  var DEFAULT_ORDERS = [
    {
      id: 'OMN-2618',
      date: '2026-11-22',
      status: 'Processing',
      paymentMethod: 'Cash on Delivery',
      shippingAddress: 'House 18, Street 7, F-7/3, Islamabad',
      shippingCost: 0,
      discount: 0,
      items: [
        { id: 'velvet-rose', name: 'Omniscent Velvet Rose', size: '100ml', qty: 1, unitPrice: 23500 },
        { id: 'si-edp', name: 'Si Eau de Parfum', size: '50ml', qty: 1, unitPrice: 16999 }
      ]
    },
    {
      id: 'OMN-2611',
      date: '2026-11-10',
      status: 'Delivered',
      paymentMethod: 'Card (Visa •••• 4412)',
      shippingAddress: 'House 18, Street 7, F-7/3, Islamabad',
      shippingCost: 0,
      discount: 2500,
      items: [
        { id: 'bleu-de-chanel', name: 'Bleu de Chanel', size: '100ml', qty: 1, unitPrice: 24999 },
        { id: 'miss-dior', name: 'Miss Dior', size: '100ml', qty: 1, unitPrice: 22999 }
      ]
    },
    {
      id: 'OMN-2589',
      date: '2026-10-04',
      status: 'Delivered',
      paymentMethod: 'Cash on Delivery',
      shippingAddress: 'Office 402, Blue Area, Jinnah Avenue, Islamabad',
      shippingCost: 350,
      discount: 0,
      items: [
        { id: 'sauvage-elixir', name: 'Sauvage Elixir', size: '50ml', qty: 1, unitPrice: 22499 }
      ]
    },
    {
      id: 'OMN-2540',
      date: '2026-08-19',
      status: 'Cancelled',
      paymentMethod: 'Card (Mastercard •••• 9011)',
      shippingAddress: 'House 18, Street 7, F-7/3, Islamabad',
      shippingCost: 0,
      discount: 0,
      items: [
        { id: 'oud-royale', name: 'Omniscent Oud Royale', size: '50ml', qty: 1, unitPrice: 23999 }
      ]
    }
  ];

  var DEFAULT_ADDRESSES = [
    {
      id: 'addr-home',
      label: 'Home',
      recipient: 'Ayesha Tariq',
      phone: '+92 301 5548290',
      street: 'House 18, Street 7, Sector F-7/3',
      city: 'Islamabad',
      postalCode: '44000',
      isDefault: true
    },
    {
      id: 'addr-office',
      label: 'Office',
      recipient: 'Ayesha Tariq',
      phone: '+92 301 5548290',
      street: 'Office 402, Emerald Tower, Blue Area',
      city: 'Islamabad',
      postalCode: '44010',
      isDefault: false
    }
  ];

  var DEFAULT_WISHLIST = [
    { productId: 'miss-dior', size: '100ml', addedAt: '2026-11-24T10:15:00Z' },
    { productId: 'bleu-de-chanel', size: '100ml', addedAt: '2026-11-21T16:40:00Z' },
    { productId: 'velvet-rose', size: '50ml', addedAt: '2026-11-18T12:05:00Z' }
  ];

  function load(key, fallback) {
    try {
      var raw = global.localStorage.getItem(key);
      if (raw === null) {
        return JSON.parse(JSON.stringify(fallback));
      }
      var parsed = JSON.parse(raw);
      return parsed !== null && parsed !== undefined ? parsed : JSON.parse(JSON.stringify(fallback));
    } catch (err) {
      return JSON.parse(JSON.stringify(fallback));
    }
  }

  function save(key, value) {
    try {
      global.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      return false;
    }
  }

  function formatPKR(amount) {
    var num = Math.round(Number(amount) || 0);
    return 'Rs. ' + num.toLocaleString('en-US');
  }

  function findFragrance(id) {
    for (var i = 0; i < FRAGRANCES.length; i++) {
      if (FRAGRANCES[i].id === id) {
        return FRAGRANCES[i];
      }
    }
    return null;
  }

  function getPriceForSize(product, size) {
    if (!product) return 0;
    return size === '50ml' ? product.price50 : product.price100;
  }

  function getCart() {
    return load(STORAGE_KEYS.CART, []);
  }

  function addToCart(productId, size, qty) {
    var product = findFragrance(productId);
    if (!product) return false;
    var cleanSize = size === '50ml' ? '50ml' : '100ml';
    var addQty = Math.max(1, Number(qty) || 1);
    var cart = getCart();
    var existing = null;

    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === productId && cart[i].size === cleanSize) {
        existing = cart[i];
        break;
      }
    }

    if (existing) {
      existing.qty += addQty;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        size: cleanSize,
        qty: addQty,
        unitPrice: getPriceForSize(product, cleanSize),
        image: product.image
      });
    }

    save(STORAGE_KEYS.CART, cart);
    syncHeaderBadges();
    return true;
  }

  function getWishlist() {
    var list = load(STORAGE_KEYS.WISHLIST, DEFAULT_WISHLIST);
    if (!Array.isArray(list)) return [];
    return list;
  }

  function saveWishlist(list) {
    save(STORAGE_KEYS.WISHLIST, list);
    syncHeaderBadges();
  }

  function isWishlisted(productId) {
    var list = getWishlist();
    for (var i = 0; i < list.length; i++) {
      if (list[i].productId === productId) return true;
    }
    return false;
  }

  function toggleWishlist(productId, size) {
    var list = getWishlist();
    var idx = -1;
    for (var i = 0; i < list.length; i++) {
      if (list[i].productId === productId) {
        idx = i;
        break;
      }
    }
    var added = false;
    if (idx > -1) {
      list.splice(idx, 1);
    } else {
      list.unshift({
        productId: productId,
        size: size === '50ml' ? '50ml' : '100ml',
        addedAt: new Date().toISOString()
      });
      added = true;
    }
    saveWishlist(list);
    return added;
  }

  function syncHeaderBadges() {
    var cart = getCart();
    var cartCount = 0;
    for (var i = 0; i < cart.length; i++) {
      cartCount += Number(cart[i].qty) || 1;
    }
    var wishlistCount = getWishlist().length;

    var cartBadges = document.querySelectorAll('[data-cart-badge]');
    for (var c = 0; c < cartBadges.length; c++) {
      cartBadges[c].textContent = String(cartCount);
    }
    var wishBadges = document.querySelectorAll('[data-wishlist-badge]');
    for (var w = 0; w < wishBadges.length; w++) {
      wishBadges[w].textContent = String(wishlistCount);
    }
  }

  function showToast(message, actionLabel, actionFn) {
    var region = document.getElementById('toast-region');
    if (!region) return;

    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');

    var span = document.createElement('span');
    span.textContent = message;
    toast.appendChild(span);

    if (actionLabel && typeof actionFn === 'function') {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'toast-undo';
      btn.textContent = actionLabel;
      btn.addEventListener('click', function () {
        actionFn();
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      });
      toast.appendChild(btn);
    }

    region.appendChild(toast);
    global.setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 4500);
  }

  function initSharedShell() {
    syncHeaderBadges();

    // Mobile hamburger drawer toggle
    var hamburger = document.getElementById('mobile-menu-toggle');
    var drawer = document.getElementById('mobile-drawer');
    if (hamburger && drawer) {
      hamburger.addEventListener('click', function () {
        var expanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', String(!expanded));
        drawer.classList.toggle('open', !expanded);
      });

      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && drawer.classList.contains('open')) {
          hamburger.setAttribute('aria-expanded', 'false');
          drawer.classList.remove('open');
          hamburger.focus();
        }
      });
    }

    // Newsletter subscription form ("Stay in the Loop")
    var newsletterForm = document.getElementById('newsletter-form');
    var newsletterInput = document.getElementById('newsletter-email');
    var newsletterMsg = document.getElementById('newsletter-feedback');
    if (newsletterForm && newsletterInput && newsletterMsg) {
      var savedEmails = load(STORAGE_KEYS.NEWSLETTER, []);
      newsletterForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var email = newsletterInput.value.trim().toLowerCase();
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
          newsletterMsg.textContent = 'Please enter your email address first.';
          newsletterInput.focus();
          return;
        }
        if (!emailRegex.test(email)) {
          newsletterMsg.textContent = 'Please enter a valid email address (e.g. name@example.com).';
          newsletterInput.focus();
          return;
        }
        if (savedEmails.indexOf(email) !== -1) {
          newsletterMsg.textContent = 'You are already subscribed to Omniscent updates.';
          return;
        }

        savedEmails.push(email);
        save(STORAGE_KEYS.NEWSLETTER, savedEmails);
        newsletterInput.value = '';
        newsletterMsg.textContent = 'Welcome to Omniscent Privé! Exclusive offers will arrive at ' + email + '.';
        showToast('Subscribed to Stay in the Loop');
      });
    }
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text === undefined || text === null ? '' : String(text);
    return div.innerHTML;
  }

  global.OmniscentStore = {
    STORAGE_KEYS: STORAGE_KEYS,
    FRAGRANCES: FRAGRANCES,
    STORES: STORES,
    FAQS: FAQS,
    DEFAULT_USER: DEFAULT_USER,
    DEFAULT_ORDERS: DEFAULT_ORDERS,
    DEFAULT_ADDRESSES: DEFAULT_ADDRESSES,
    DEFAULT_WISHLIST: DEFAULT_WISHLIST,
    load: load,
    save: save,
    formatPKR: formatPKR,
    findFragrance: findFragrance,
    getPriceForSize: getPriceForSize,
    getCart: getCart,
    addToCart: addToCart,
    getWishlist: getWishlist,
    saveWishlist: saveWishlist,
    isWishlisted: isWishlisted,
    toggleWishlist: toggleWishlist,
    syncHeaderBadges: syncHeaderBadges,
    showToast: showToast,
    initSharedShell: initSharedShell,
    escapeHtml: escapeHtml
  };
})(window);
