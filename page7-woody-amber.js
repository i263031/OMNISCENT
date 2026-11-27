(() => {
  const CART_KEY = "omniscent_cart";

  const catalog = [
    { name: "Woody Amber Extrait", url: "page7-woody-amber.html", tags: "oud amber saffron unisex men" },
    { name: "Signature Floral EDP", url: "page6-signature-floral.html", tags: "rose peony floral women" },
    { name: "Fragrance Quiz / Scents Finder", url: "page8-fragrance-quiz.html", tags: "quiz finder profile" },
    { name: "Sauvage Elixir", url: "page7-woody-amber.html", tags: "spicy amber men" }
  ];

  const layersData = {
    top: {
      time: "FIRST 25 MINUTES",
      title: "Kashmiri Saffron & Crushed Cardamom",
      desc: "A dry, glowing veil of red saffron threads, green cardamom pods, and bitter blood orange peel creates an immediate aura of quiet authority.",
      ingredients: [
        { name: "Kashmiri Saffron", note: "Warm metallic spice" },
        { name: "Black Cardamom", note: "Aromatic smoke" },
        { name: "Bitter Bergamot", note: "Crisp lift" }
      ]
    },
    heart: {
      time: "HOURS 1 TO 6",
      title: "Smoked Labdanum & Velvet Rose",
      desc: "Balsamic Spanish cistus labdanum melts into dark Turkish rose petals and toasted nutmeg, building a rich, velvety midnight core.",
      ingredients: [
        { name: "Spanish Labdanum", note: "Leathery amber" },
        { name: "Dark Turkish Rose", note: "Velvet contrast" },
        { name: "Toasted Nutmeg", note: "Dry warmth" }
      ]
    },
    base: {
      time: "HOURS 6 TO 14+",
      title: "Aged Agarwood, Golden Amber & Sandalwood",
      desc: "Aged Assam oud, creamy Mysore sandalwood, and Madagascar benzoin anchor the extrait into a resonant, skin-hugging finish.",
      ingredients: [
        { name: "Assam Agarwood", note: "Resinous depth" },
        { name: "Golden Amber Resin", note: "Glowing sweetness" },
        { name: "Mysore Sandalwood", note: "Creamy wood trail" }
      ]
    }
  };

  const state = {
    size: "50 ml",
    unitPrice: 26499,
    qty: 1,
    monogram: "",
    wishlist: false
  };

  const els = {
    shopMenuBtn: document.getElementById("shopMenuBtn"),
    shopDropdown: document.getElementById("shopDropdown"),
    searchToggleBtn: document.getElementById("searchToggleBtn"),
    searchDrawer: document.getElementById("searchDrawer"),
    searchInput: document.getElementById("searchInput"),
    searchResults: document.getElementById("searchResults"),
    cartToggleBtn: document.getElementById("cartToggleBtn"),
    cartDrawer: document.getElementById("cartDrawer"),
    cartBackdrop: document.getElementById("cartBackdrop"),
    closeCartBtn: document.getElementById("closeCartBtn"),
    cartCountBadge: document.getElementById("cartCountBadge"),
    cartItemsList: document.getElementById("cartItemsList"),
    cartSubtotalDisplay: document.getElementById("cartSubtotalDisplay"),
    checkoutStubBtn: document.getElementById("checkoutStubBtn"),
    unitPriceDisplay: document.getElementById("unitPriceDisplay"),
    sizeNoteDisplay: document.getElementById("sizeNoteDisplay"),
    monogramInput: document.getElementById("monogramInput"),
    engravingStatus: document.getElementById("engravingStatus"),
    svgMonogramText: document.getElementById("svgMonogramText"),
    qtyValue: document.getElementById("qtyValue"),
    qtyMinus: document.getElementById("qtyMinus"),
    qtyPlus: document.getElementById("qtyPlus"),
    addToCartBtn: document.getElementById("addToCartBtn"),
    wishlistBtn: document.getElementById("wishlistBtn"),
    layerTime: document.getElementById("layerTime"),
    layerTitle: document.getElementById("layerTitle"),
    layerDesc: document.getElementById("layerDesc"),
    layerIngredients: document.getElementById("layerIngredients"),
    newsletterForm: document.getElementById("newsletterForm"),
    newsletterEmail: document.getElementById("newsletterEmail"),
    newsletterMsg: document.getElementById("newsletterMsg"),
    toast: document.getElementById("toast")
  };

  const formatRs = (n) => `Rs. ${Number(n).toLocaleString("en-PK")}`;
  const escapeHtml = (str) =>
    String(str).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

  function showToast(msg) {
    els.toast.textContent = msg;
    els.toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => els.toast.classList.remove("show"), 2600);
  }

  function loadCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCart();
  }

  function addItemToCart(name, size, price, qty = 1, monogram = "") {
    const label = monogram ? `${size} · Engraved "${monogram}"` : size;
    const cart = loadCart();
    const existing = cart.find((i) => i.name === name && i.size === label);
    if (existing) existing.qty += qty;
    else cart.push({ name, size: label, price, qty });
    saveCart(cart);
    showToast(`Added ${qty} × ${name} (${label}) to your bag`);
  }

  function renderCart() {
    const cart = loadCart();
    els.cartCountBadge.textContent = cart.reduce((s, i) => s + i.qty, 0);
    els.cartSubtotalDisplay.textContent = formatRs(cart.reduce((s, i) => s + i.price * i.qty, 0));

    if (!cart.length) {
      els.cartItemsList.innerHTML = `<p style="color:var(--text-muted);font-size:0.9rem;">Your shopping bag is currently empty.</p>`;
      return;
    }

    els.cartItemsList.innerHTML = cart
      .map(
        (item, idx) => `
      <div class="cart-item">
        <div>
          <strong>${escapeHtml(item.name)}</strong>
          <span>${escapeHtml(item.size)} · Qty ${item.qty} · ${formatRs(item.price * item.qty)}</span>
        </div>
        <button type="button" class="remove-item-btn" data-remove-idx="${idx}">Remove</button>
      </div>`
      )
      .join("");
  }

  function toggleCartDrawer(open) {
    els.cartDrawer.classList.toggle("open", open);
    els.cartDrawer.setAttribute("aria-hidden", String(!open));
  }

  // Nav & Search
  els.shopMenuBtn.addEventListener("click", () => {
    const open = els.shopDropdown.classList.toggle("open");
    els.shopMenuBtn.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav-dropdown")) {
      els.shopDropdown.classList.remove("open");
      els.shopMenuBtn.setAttribute("aria-expanded", "false");
    }
  });
  function renderSearchResults() {
    const q = els.searchInput.value.trim().toLowerCase();
    const list = q ? catalog.filter((c) => c.name.toLowerCase().includes(q) || c.tags.includes(q)) : catalog;
    els.searchResults.innerHTML = list.map((m) => `<a class="search-chip" href="${m.url}">${m.name} →</a>`).join("");
  }

  els.searchToggleBtn.addEventListener("click", () => {
    els.searchDrawer.hidden = !els.searchDrawer.hidden;
    if (!els.searchDrawer.hidden) {
      renderSearchResults();
      els.searchInput.focus();
    }
  });
  els.searchInput.addEventListener("input", renderSearchResults);

  // Volume Selector
  document.querySelectorAll(".size-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".size-pill").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.size = btn.dataset.size;
      state.unitPrice = Number(btn.dataset.price);
      els.unitPriceDisplay.textContent = formatRs(state.unitPrice);
      els.sizeNoteDisplay.textContent = btn.dataset.note;
    });
  });

  // Live Bottle Monogram
  els.monogramInput.addEventListener("input", () => {
    const clean = els.monogramInput.value.replace(/[^a-zA-Z.]/g, "").toUpperCase();
    els.monogramInput.value = clean;
    state.monogram = clean;
    els.engravingStatus.textContent = clean ? `Previewing: "${clean}"` : "No engraving";
    els.svgMonogramText.textContent = clean;
  });

  // Quantity & Purchase
  els.qtyMinus.addEventListener("click", () => {
    if (state.qty > 1) {
      state.qty -= 1;
      els.qtyValue.textContent = state.qty;
    }
  });
  els.qtyPlus.addEventListener("click", () => {
    if (state.qty < 10) {
      state.qty += 1;
      els.qtyValue.textContent = state.qty;
    }
  });

  els.addToCartBtn.addEventListener("click", () => {
    addItemToCart("Woody Amber Extrait", state.size, state.unitPrice, state.qty, state.monogram);
    toggleCartDrawer(true);
  });

  els.wishlistBtn.addEventListener("click", () => {
    state.wishlist = !state.wishlist;
    els.wishlistBtn.classList.toggle("saved", state.wishlist);
    els.wishlistBtn.textContent = state.wishlist ? "♥" : "♡";
    els.wishlistBtn.setAttribute("aria-pressed", String(state.wishlist));
    showToast(state.wishlist ? "Saved to your Wishlist" : "Removed from Wishlist");
  });

  document.querySelectorAll(".quick-add").forEach((btn) => {
    btn.addEventListener("click", () => {
      addItemToCart(btn.dataset.name, btn.dataset.size, Number(btn.dataset.price), 1);
    });
  });

  // Olfactory Layer Tabs
  document.querySelectorAll(".pyramid-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".pyramid-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const layer = layersData[tab.dataset.layer];
      els.layerTime.textContent = layer.time;
      els.layerTitle.textContent = layer.title;
      els.layerDesc.textContent = layer.desc;
      els.layerIngredients.innerHTML = layer.ingredients
        .map((ing) => `<div class="ing-pill"><strong>${ing.name}</strong><span>${ing.note}</span></div>`)
        .join("");
    });
  });

  // Accordion
  document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".accordion-item");
      const opening = !item.classList.contains("open");
      item.classList.toggle("open", opening);
      trigger.setAttribute("aria-expanded", String(opening));
      trigger.querySelector(".acc-icon").textContent = opening ? "−" : "+";
    });
  });

  // Cart Drawer
  els.cartToggleBtn.addEventListener("click", () => toggleCartDrawer(true));
  els.closeCartBtn.addEventListener("click", () => toggleCartDrawer(false));
  els.cartBackdrop.addEventListener("click", () => toggleCartDrawer(false));
  els.cartItemsList.addEventListener("click", (e) => {
    const idx = e.target.dataset.removeIdx;
    if (idx !== undefined) {
      const cart = loadCart();
      cart.splice(Number(idx), 1);
      saveCart(cart);
    }
  });
  els.checkoutStubBtn.addEventListener("click", () => {
    showToast("Proceeding with your Omniscent Atelier order...");
  });

  // Newsletter
  els.newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = els.newsletterEmail.value.trim();
    if (!email) return;
    els.newsletterMsg.textContent = `Welcome to Omniscent Inner Circle — ${email} is subscribed.`;
    els.newsletterForm.reset();
  });

  renderCart();
})();
