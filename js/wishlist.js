/**
 * OMNISCENT — Page 14: Wishlist & Saved Scents Logic
 * Supports dynamic rendering from localStorage, category filter, sort, search,
 * 50ml/100ml bottle size toggle, notes modal, move-to-cart, undo on remove,
 * and a bundle/promo savings + shipping calculator.
 */

(function () {
  'use strict';

  var Store = window.OmniscentStore;
  if (!Store) return;

  var state = {
    category: 'All',
    sortBy: 'recent',
    search: '',
    promoCode: '',
    promoError: '',
    lastRemoved: null
  };

  var PROMO_CODES = {
    OMNI10: { rate: 0.10, label: '10% Atelier Promo (OMNI10)' },
    WELCOME5: { rate: 0.05, label: '5% Welcome Code (WELCOME5)' }
  };

  function getHydratedWishlist() {
    var saved = Store.getWishlist();
    var merged = [];
    for (var i = 0; i < saved.length; i++) {
      var product = Store.findFragrance(saved[i].productId);
      if (product) {
        var size = saved[i].size === '50ml' ? '50ml' : '100ml';
        merged.push({
          product: product,
          size: size,
          price: Store.getPriceForSize(product, size),
          addedAt: saved[i].addedAt
        });
      }
    }
    return merged;
  }

  function renderWishlist() {
    var grid = document.getElementById('wishlist-grid');
    var countHeading = document.getElementById('wishlist-count-label');
    if (!grid) return;

    var allSaved = getHydratedWishlist();
    if (countHeading) {
      countHeading.textContent = allSaved.length + (allSaved.length === 1 ? ' saved scent' : ' saved scents');
    }

    var query = state.search.trim().toLowerCase();
    var filtered = allSaved.filter(function (entry) {
      var catMatch = state.category === 'All' || entry.product.category === state.category;
      if (!catMatch) return false;
      if (!query) return true;
      return (
        entry.product.name.toLowerCase().indexOf(query) !== -1 ||
        entry.product.notes.top.toLowerCase().indexOf(query) !== -1 ||
        entry.product.notes.heart.toLowerCase().indexOf(query) !== -1
      );
    });

    if (state.sortBy === 'price-asc') {
      filtered.sort(function (a, b) { return a.price - b.price; });
    } else if (state.sortBy === 'price-desc') {
      filtered.sort(function (a, b) { return b.price - a.price; });
    }

    if (allSaved.length === 0) {
      grid.innerHTML =
        '<div class="empty-state" style="grid-column:1/-1">' +
        '<h3 class="section-heading" style="font-size:1.5rem">Your Wishlist is Empty</h3>' +
        '<p class="lead-text" style="margin:0 auto 1.25rem">Save your favorite Omniscent fragrances below to compare notes, switch bottle sizes, or unlock our 3-bottle Curator Bundle discount.</p>' +
        '<a href="#discover-more" class="btn btn-primary btn-sm">Browse Signature Scents</a>' +
        '</div>';
      renderSummary(allSaved);
      renderDiscoverCatalog();
      return;
    }

    if (filtered.length === 0) {
      grid.innerHTML =
        '<div class="empty-state" style="grid-column:1/-1">' +
        '<h3 class="section-heading" style="font-size:1.35rem">No saved scents match that filter</h3>' +
        '<p class="lead-text" style="margin:0 auto 1rem">Try resetting your category or search query.</p>' +
        '<button type="button" class="btn btn-outline btn-sm" id="reset-wish-filters">Reset Filters</button>' +
        '</div>';
      var resetBtn = document.getElementById('reset-wish-filters');
      if (resetBtn) {
        resetBtn.addEventListener('click', function () {
          state.category = 'All';
          state.search = '';
          var searchEl = document.getElementById('wishlist-search');
          if (searchEl) searchEl.value = '';
          syncCategoryPills();
          renderWishlist();
        });
      }
      renderSummary(allSaved);
      renderDiscoverCatalog();
      return;
    }

    grid.innerHTML = filtered
      .map(function (entry) {
        var p = entry.product;
        return (
          '<article class="scent-card">' +
          '<div class="scent-thumb">' +
          '<img src="' + Store.escapeHtml(p.image) + '" alt="' + Store.escapeHtml(p.alt) + '">' +
          '<span class="scent-tag">' + Store.escapeHtml(p.category) + '</span>' +
          '<button type="button" class="scent-heart-btn" aria-label="Remove ' + Store.escapeHtml(p.name) + ' from wishlist" data-remove-wish="' + Store.escapeHtml(p.id) + '">♥</button>' +
          '</div>' +
          '<div class="scent-title-row">' +
          '<h3 class="scent-name">' + Store.escapeHtml(p.name) + '</h3>' +
          '<span class="scent-price">' + Store.formatPKR(entry.price) + '</span>' +
          '</div>' +
          '<p class="scent-notes-mini">' + Store.escapeHtml(p.concentration) + ' · ' + Store.escapeHtml(p.notes.top) + '</p>' +
          '<div style="display:flex;align-items:center;justify-content:space-between;gap:0.5rem">' +
          '<div class="size-toggle-group" role="group" aria-label="Bottle size for ' + Store.escapeHtml(p.name) + '">' +
          '<button type="button" class="size-chip ' + (entry.size === '50ml' ? 'active' : '') + '" data-wish-size="50ml" data-product-id="' + Store.escapeHtml(p.id) + '">50ml</button>' +
          '<button type="button" class="size-chip ' + (entry.size === '100ml' ? 'active' : '') + '" data-wish-size="100ml" data-product-id="' + Store.escapeHtml(p.id) + '">100ml</button>' +
          '</div>' +
          '<button type="button" class="btn btn-outline btn-sm" data-notes-modal="' + Store.escapeHtml(p.id) + '">Notes</button>' +
          '</div>' +
          '<button type="button" class="btn btn-primary btn-sm" data-move-cart="' + Store.escapeHtml(p.id) + '">Move to Bag →</button>' +
          '</article>'
        );
      })
      .join('');

    renderSummary(allSaved);
    renderDiscoverCatalog();
  }

  function renderSummary(savedEntries) {
    var subtotal = 0;
    for (var i = 0; i < savedEntries.length; i++) {
      subtotal += savedEntries[i].price;
    }

    // Automatic 10% Curator Bundle if 3+ items, or applied promo code (whichever is better)
    var discount = 0;
    var discountLabel = 'Bundle / Promo Discount';
    if (savedEntries.length >= 3) {
      discount = Math.round(subtotal * 0.10);
      discountLabel = '3+ Scents Bundle (10% Off)';
    } else if (state.promoCode && PROMO_CODES[state.promoCode]) {
      var promo = PROMO_CODES[state.promoCode];
      discount = Math.round(subtotal * promo.rate);
      discountLabel = promo.label;
    }

    var afterDiscount = Math.max(0, subtotal - discount);
    var shipping = afterDiscount === 0 || afterDiscount >= 25000 ? 0 : 350;
    var finalTotal = afterDiscount + shipping;

    var subEl = document.getElementById('summary-subtotal');
    var discLabelEl = document.getElementById('summary-discount-label');
    var discValEl = document.getElementById('summary-discount');
    var shipEl = document.getElementById('summary-shipping');
    var totalEl = document.getElementById('summary-total');
    var bundleHintEl = document.getElementById('bundle-hint');
    var moveAllBtn = document.getElementById('move-all-btn');
    var clearBtn = document.getElementById('clear-wishlist-btn');

    if (subEl) subEl.textContent = Store.formatPKR(subtotal);
    if (discLabelEl) discLabelEl.textContent = discountLabel;
    if (discValEl) discValEl.textContent = '-' + Store.formatPKR(discount);
    if (shipEl) shipEl.textContent = afterDiscount === 0 ? 'Rs. 0' : shipping === 0 ? 'Complimentary' : Store.formatPKR(shipping);
    if (totalEl) totalEl.textContent = Store.formatPKR(finalTotal);

    if (bundleHintEl) {
      if (savedEntries.length === 0) {
        bundleHintEl.textContent = 'Save 3 fragrances to unlock an automatic 10% Curator Bundle discount.';
      } else if (savedEntries.length < 3) {
        var needed = 3 - savedEntries.length;
        bundleHintEl.textContent = 'Add ' + needed + ' more ' + (needed === 1 ? 'scent' : 'scents') + ' to unlock 10% off automatically (or try code OMNI10).';
      } else {
        bundleHintEl.textContent = 'Curator Bundle unlocked! You save ' + Store.formatPKR(discount) + ' on your saved collection.';
      }
    }

    if (moveAllBtn) moveAllBtn.disabled = savedEntries.length === 0;
    if (clearBtn) clearBtn.disabled = savedEntries.length === 0;
  }

  function renderDiscoverCatalog() {
    var container = document.getElementById('discover-grid');
    if (!container) return;

    container.innerHTML = Store.FRAGRANCES.map(function (p) {
      var saved = Store.isWishlisted(p.id);
      return (
        '<article class="scent-card">' +
        '<div class="scent-thumb">' +
        '<img src="' + Store.escapeHtml(p.image) + '" alt="' + Store.escapeHtml(p.alt) + '">' +
        '<span class="scent-tag">' + Store.escapeHtml(p.category) + '</span>' +
        '</div>' +
        '<div class="scent-title-row">' +
        '<h3 class="scent-name" style="font-size:1.02rem">' + Store.escapeHtml(p.name) + '</h3>' +
        '<span class="scent-price">' + Store.formatPKR(p.price100) + '</span>' +
        '</div>' +
        '<p class="scent-notes-mini">' + Store.escapeHtml(p.notes.top) + '</p>' +
        '<button type="button" class="btn ' + (saved ? 'btn-soft' : 'btn-outline') + ' btn-sm" data-toggle-wish="' + Store.escapeHtml(p.id) + '">' +
        (saved ? '♥ Saved in Wishlist' : '♡ Save to Wishlist') +
        '</button>' +
        '</article>'
      );
    }).join('');
  }

  function removeWishlistItem(productId) {
    var list = Store.getWishlist();
    var removedItem = null;
    var next = [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].productId === productId) {
        removedItem = list[i];
      } else {
        next.push(list[i]);
      }
    }
    if (!removedItem) return;
    Store.saveWishlist(next);
    renderWishlist();

    var product = Store.findFragrance(productId);
    Store.showToast(
      (product ? product.name : 'Scent') + ' removed from wishlist.',
      'Undo',
      function () {
        var current = Store.getWishlist();
        current.unshift(removedItem);
        Store.saveWishlist(current);
        renderWishlist();
      }
    );
  }

  function openNotesModal(productId) {
    var p = Store.findFragrance(productId);
    var modal = document.getElementById('notes-modal');
    var title = document.getElementById('notes-modal-title');
    var body = document.getElementById('notes-modal-body');
    if (!p || !modal || !title || !body) return;

    title.textContent = p.name + ' — Fragrance Pyramid';
    body.innerHTML =
      '<p class="lead-text" style="margin-bottom:1rem">' + Store.escapeHtml(p.category) + ' · ' + Store.escapeHtml(p.concentration) + '</p>' +
      '<div class="soft-surface" style="display:grid;gap:0.75rem">' +
      '<div><strong>Top Notes:</strong> <span class="lead-text">' + Store.escapeHtml(p.notes.top) + '</span></div>' +
      '<div><strong>Heart Notes:</strong> <span class="lead-text">' + Store.escapeHtml(p.notes.heart) + '</span></div>' +
      '<div><strong>Base Notes:</strong> <span class="lead-text">' + Store.escapeHtml(p.notes.base) + '</span></div>' +
      '</div>' +
      '<p class="lead-text" style="font-size:0.84rem;margin-top:1rem">Available in 50ml (' + Store.formatPKR(p.price50) + ') and 100ml (' + Store.formatPKR(p.price100) + ').</p>';

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeNotesModal() {
    var modal = document.getElementById('notes-modal');
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  function syncCategoryPills() {
    var pills = document.querySelectorAll('[data-wish-cat]');
    for (var i = 0; i < pills.length; i++) {
      pills[i].classList.toggle('active', pills[i].getAttribute('data-wish-cat') === state.category);
    }
  }

  function bindEvents() {
    // Category pills
    var pills = document.querySelectorAll('[data-wish-cat]');
    for (var i = 0; i < pills.length; i++) {
      pills[i].addEventListener('click', function () {
        state.category = this.getAttribute('data-wish-cat');
        syncCategoryPills();
        renderWishlist();
      });
    }

    // Sort select
    var sortSelect = document.getElementById('wishlist-sort');
    if (sortSelect) {
      sortSelect.addEventListener('change', function () {
        state.sortBy = sortSelect.value;
        renderWishlist();
      });
    }

    // Search input
    var searchInput = document.getElementById('wishlist-search');
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        state.search = searchInput.value;
        renderWishlist();
      });
    }

    // Promo code form
    var promoForm = document.getElementById('promo-form');
    var promoInput = document.getElementById('promo-input');
    var promoMsg = document.getElementById('promo-message');
    if (promoForm && promoInput && promoMsg) {
      promoForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var code = promoInput.value.trim().toUpperCase();
        if (!code) {
          promoMsg.textContent = 'Enter a promo code (try OMNI10 or WELCOME5).';
          promoMsg.style.color = 'var(--danger)';
          return;
        }
        if (!PROMO_CODES[code]) {
          promoMsg.textContent = 'Code "' + code + '" is invalid. Valid codes: OMNI10, WELCOME5.';
          promoMsg.style.color = 'var(--danger)';
          return;
        }
        state.promoCode = code;
        promoMsg.textContent = PROMO_CODES[code].label + ' applied!';
        promoMsg.style.color = 'var(--success)';
        renderSummary(getHydratedWishlist());
      });
    }

    // Move all to bag
    var moveAllBtn = document.getElementById('move-all-btn');
    if (moveAllBtn) {
      moveAllBtn.addEventListener('click', function () {
        var saved = Store.getWishlist();
        if (saved.length === 0) return;
        for (var i = 0; i < saved.length; i++) {
          Store.addToCart(saved[i].productId, saved[i].size, 1);
        }
        Store.saveWishlist([]);
        renderWishlist();
        Store.showToast(saved.length + ' saved fragrance(s) moved to your bag.');
      });
    }

    // Clear wishlist
    var clearBtn = document.getElementById('clear-wishlist-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        var backup = Store.getWishlist();
        if (backup.length === 0) return;
        Store.saveWishlist([]);
        renderWishlist();
        Store.showToast('Wishlist cleared.', 'Undo', function () {
          Store.saveWishlist(backup);
          renderWishlist();
        });
      });
    }

    // Share wishlist link
    var shareBtn = document.getElementById('share-wishlist-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', function () {
        var url = window.location.href;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(function () {
            Store.showToast('Wishlist link copied to clipboard.');
          });
        } else {
          Store.showToast('Wishlist URL ready to share: ' + url);
        }
      });
    }

    // Delegated card actions
    document.addEventListener('click', function (event) {
      var removeId = event.target.getAttribute('data-remove-wish');
      if (removeId) {
        removeWishlistItem(removeId);
        return;
      }

      var sizeChoice = event.target.getAttribute('data-wish-size');
      if (sizeChoice) {
        var pid = event.target.getAttribute('data-product-id');
        var list = Store.getWishlist();
        for (var i = 0; i < list.length; i++) {
          if (list[i].productId === pid) {
            list[i].size = sizeChoice;
            break;
          }
        }
        Store.saveWishlist(list);
        renderWishlist();
        return;
      }

      var moveId = event.target.getAttribute('data-move-cart');
      if (moveId) {
        var current = Store.getWishlist();
        var size = '100ml';
        for (var k = 0; k < current.length; k++) {
          if (current[k].productId === moveId) {
            size = current[k].size;
            break;
          }
        }
        Store.addToCart(moveId, size, 1);
        var filtered = current.filter(function (item) {
          return item.productId !== moveId;
        });
        Store.saveWishlist(filtered);
        renderWishlist();
        var prod = Store.findFragrance(moveId);
        Store.showToast((prod ? prod.name : 'Item') + ' (' + size + ') moved to bag.');
        return;
      }

      var notesId = event.target.getAttribute('data-notes-modal');
      if (notesId) {
        openNotesModal(notesId);
        return;
      }

      var toggleId = event.target.getAttribute('data-toggle-wish');
      if (toggleId) {
        var added = Store.toggleWishlist(toggleId, '100ml');
        renderWishlist();
        var item = Store.findFragrance(toggleId);
        Store.showToast((item ? item.name : 'Scent') + (added ? ' saved to wishlist.' : ' removed from wishlist.'));
      }
    });

    // Notes modal close
    var closeBtn = document.getElementById('notes-modal-close');
    var backdrop = document.getElementById('notes-modal');
    if (closeBtn) closeBtn.addEventListener('click', closeNotesModal);
    if (backdrop) {
      backdrop.addEventListener('click', function (event) {
        if (event.target === backdrop) closeNotesModal();
      });
    }
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeNotesModal();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    Store.initSharedShell();
    renderWishlist();
    bindEvents();
  });
})();
