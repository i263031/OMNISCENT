/**
 * ==========================================================================
 * OMNISCENT - LUXURY PERFUME WEBSITE
 * Script: js/script.js
 * Language: JavaScript (ECMAScript 6+)
 * Description: Client-side interactive logic for Omniscent Luxury Fragrance Website.
 *              Includes:
 *              1. Sticky header scroll behavior
 *              2. Persistent cart counter & luxury toast notification system
 *              3. Hero 4-slide carousel with synchronized text and imagery
 *              4. Full-screen search modal with trending scent tags
 *              5. Newsletter email validation with interactive feedback
 *              6. Mobile navigation drawer toggle
 *              7. Shop All interactive catalog (category tabs, scent family filter,
 *                 live search, multi-criteria sorting, URL param routing)
 *              8. Luxury product Quick-View modal with olfactory notes pyramid,
 *                 dynamic bottle size selection (50ml / 100ml), quantity counter,
 *                 and direct bag addition.
 * ==========================================================================
 */

// Execute logic when the DOM is fully loaded and parsed
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /* ==========================================================================
       HELPER: ASSET PATH RESOLUTION
       Detects if current page is in root or in a subdirectory (e.g. Pages/)
       ========================================================================== */
    const isSubdirectory = window.location.pathname.includes('/Pages/') || 
                           window.location.pathname.includes('\\Pages\\') || 
                           Boolean(document.querySelector('link[href^="../"]'));

    const getImgPrefix = () => isSubdirectory ? '../images/' : 'images/';
    const getPagePrefix = () => isSubdirectory ? '' : '';


    /* ==========================================================================
       MODULE 1: HEADER SCROLL BEHAVIOR
       Adds backdrop blur and background styling when user scrolls down.
       ========================================================================== */
    const siteHeader = document.querySelector('.site-header');

    const handleHeaderScroll = () => {
        if (!siteHeader) return;
        if (window.scrollY > 40) {
            siteHeader.classList.add('scrolled');
        } else {
            siteHeader.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll(); // Run immediately on load


    /* ==========================================================================
       MODULE 2: SHOPPING CART & NOTIFICATION SYSTEM
       Handles adding items, persisting bag & count in localStorage, animating
       cart badge, and displaying luxury toast notification.
       ========================================================================== */
    const CART_ITEMS_KEY = 'omniscent_cart_items';
    const CART_COUNT_KEY = 'omniscent_cart_count';

    const readCartItems = () => {
        try {
            const raw = localStorage.getItem(CART_ITEMS_KEY);
            if (raw === null) return null;
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return null;
        }
    };

    const writeCartItems = (items) => {
        const totalCount = items.reduce((sum, item) => sum + (parseInt(item.qty, 10) || 0), 0);
        cartItemCount = totalCount;
        try {
            localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(items));
            localStorage.setItem(CART_COUNT_KEY, String(totalCount));
        } catch (e) {}

        if (cartCountElement) {
            cartCountElement.textContent = totalCount;
        }
        return totalCount;
    };

    let cartItemCount = 0;
    const storedItems = readCartItems();
    if (storedItems !== null) {
        cartItemCount = storedItems.reduce((sum, item) => sum + (parseInt(item.qty, 10) || 0), 0);
    } else {
        try {
            const savedCount = localStorage.getItem(CART_COUNT_KEY);
            if (savedCount !== null) {
                cartItemCount = parseInt(savedCount, 10) || 0;
            }
        } catch (e) {
            cartItemCount = 0;
        }
    }

    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = cartItemCount;
    }

    const cartToast = document.getElementById('cartToast');
    const toastProductName = document.getElementById('toastProductName');
    let toastTimeout = null;

    /**
     * Show elegant toast notification when an item is added to cart
     * @param {string} productName 
     */
    const showCartToast = (productName) => {
        if (!cartToast) return;

        if (toastProductName) {
            toastProductName.textContent = productName;
        }

        cartToast.classList.add('active');

        if (toastTimeout) {
            clearTimeout(toastTimeout);
        }

        toastTimeout = setTimeout(() => {
            cartToast.classList.remove('active');
        }, 3600);
    };

    /**
     * Increment cart count and trigger bounce animation
     * @param {number} qty 
     */
    const updateCartCount = (qty = 1) => {
        cartItemCount += qty;
        try {
            localStorage.setItem(CART_COUNT_KEY, cartItemCount);
        } catch (e) {}

        if (cartCountElement) {
            cartCountElement.textContent = cartItemCount;
            cartCountElement.classList.remove('bounce');
            void cartCountElement.offsetWidth; // Reflow for CSS animation restart
            cartCountElement.classList.add('bounce');
        }
    };

    /**
     * Add or merge a product item into persistent cart storage
     * @param {Object} item
     */
    const addProductToBag = (item) => {
        const current = readCartItems() || [];
        const existingIndex = current.findIndex(
            entry => entry.name === item.name && entry.size === item.size
        );

        if (existingIndex >= 0) {
            current[existingIndex].qty = Math.min(20, (current[existingIndex].qty || 1) + (item.qty || 1));
        } else {
            current.push({
                id: item.id || Date.now(),
                name: item.name || 'Omniscent Fragrance',
                brand: item.brand || 'Omniscent',
                size: item.size || '50ml',
                price: Number(item.price) || 24999,
                img: item.img || 'product-signature-rose.png',
                qty: item.qty || 1
            });
        }

        writeCartItems(current);
        if (cartCountElement) {
            cartCountElement.classList.remove('bounce');
            void cartCountElement.offsetWidth;
            cartCountElement.classList.add('bounce');
        }
    };

    const parseNumericPrice = (priceText) => {
        const digits = String(priceText || '').replace(/[^0-9]/g, '');
        return parseInt(digits, 10) || 24999;
    };

    const extractImageFilename = (imgElement) => {
        const src = imgElement ? (imgElement.getAttribute('src') || '') : '';
        const parts = src.split('/');
        return parts[parts.length - 1] || 'product-signature-rose.png';
    };

    // Attach event listeners to all Add-to-Cart buttons in grids
    const bindAddToCartButtons = () => {
        const addToCartButtons = document.querySelectorAll('.btn-add-cart');
        addToCartButtons.forEach(button => {
            // Remove previous listener to avoid double attachment
            button.onclick = (event) => {
                event.preventDefault();
                event.stopPropagation();
                const productCard = button.closest('.product-card');
                const productName = productCard ? (productCard.querySelector('.product-name')?.textContent?.trim() || 'Perfume') : 'Perfume';
                const productBrand = productCard ? (productCard.querySelector('.product-brand')?.textContent?.trim() || 'Omniscent') : 'Omniscent';
                const priceAttr = productCard ? productCard.getAttribute('data-price') : null;
                const priceVal = priceAttr ? parseInt(priceAttr, 10) : parseNumericPrice(productCard?.querySelector('.product-price')?.textContent);
                const imgName = extractImageFilename(productCard?.querySelector('.product-img'));

                // Visual feedback on button
                const originalHTML = button.innerHTML;
                button.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                `;
                button.style.backgroundColor = 'var(--color-accent-rose)';
                button.style.color = '#FFFFFF';

                setTimeout(() => {
                    button.innerHTML = originalHTML;
                    button.style.backgroundColor = '';
                    button.style.color = '';
                }, 1200);

                addProductToBag({
                    id: productCard?.getAttribute('data-id') || productCard?.getAttribute('data-product-id'),
                    name: productName,
                    brand: productBrand,
                    size: '50ml',
                    price: priceVal,
                    img: imgName,
                    qty: 1
                });
                showCartToast(productName);
            };
        });
    };

    bindAddToCartButtons();


    /* ==========================================================================
       MODULE 3: HERO CAROUSEL CONTROLS (HOMEPAGE)
       Handles slides 01 / 04, updating slides, text content, and hero visual image.
       ========================================================================== */
    const heroSlidesData = [
        {
            tagline: "MORE THAN A FRAGRANCE",
            title: `A Signature<br>of <span class="accent-italic">You</span>`,
            description: "Discover luxury perfumes crafted to leave a lasting impression.",
            image: "hero-slide-1.png",
            alt: "Omniscent Signature Rose Perfume on Pedestal with Cherry Blossoms"
        },
        {
            tagline: "TIMELESS ELEGANCE",
            title: `The Art<br>of <span class="accent-italic">Essence</span>`,
            description: "Immerse yourself in rare botanicals and masterfully blended notes.",
            image: "hero-slide-2.png",
            alt: "Omniscent Midnight Sapphire Perfume Bottle in Luxury Archway"
        },
        {
            tagline: "EXCLUSIVE RELEASE",
            title: `Symphony<br>of <span class="accent-italic">Scent</span>`,
            description: "Bold, seductive fragrances formulated for unforgettable moments.",
            image: "hero-slide-3.png",
            alt: "Omniscent Golden Amber Perfume with Warm Radiance"
        },
        {
            tagline: "BESPOKE PERFUMERY",
            title: `Pure Luxury<br><span class="accent-italic">Defined</span>`,
            description: "Hand-poured artisan aromas that awaken the senses.",
            image: "hero-slide-4.png",
            alt: "Omniscent Ruby Velvet Perfume Bottle with Floral Silhouette"
        }
    ];

    let currentSlideIndex = 0;
    const currentSlideElement = document.getElementById('currentSlide');
    const heroTaglineElement = document.getElementById('heroTaglineText');
    const heroTitleElement = document.getElementById('heroTitle');
    const heroDescElement = document.getElementById('heroDescription');
    const heroImgElement = document.querySelector('.hero-img');
    const prevSlideBtn = document.getElementById('prevSlide');
    const nextSlideBtn = document.getElementById('nextSlide');

    const renderSlide = (index) => {
        const slide = heroSlidesData[index];
        if (!slide) return;

        if (currentSlideElement) {
            currentSlideElement.textContent = String(index + 1).padStart(2, '0');
        }

        const elementsToFade = [heroTaglineElement, heroTitleElement, heroDescElement].filter(Boolean);
        elementsToFade.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(6px)';
            el.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        });

        if (heroImgElement) {
            heroImgElement.classList.add('fade-out');
        }

        setTimeout(() => {
            if (heroTaglineElement) heroTaglineElement.textContent = slide.tagline;
            if (heroTitleElement) heroTitleElement.innerHTML = slide.title;
            if (heroDescElement) heroDescElement.textContent = slide.description;

            elementsToFade.forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });

            if (heroImgElement) {
                const targetSrc = getImgPrefix() + slide.image;
                heroImgElement.src = targetSrc;
                heroImgElement.alt = slide.alt;
                
                heroImgElement.onload = () => {
                    heroImgElement.classList.remove('fade-out');
                };
                setTimeout(() => {
                    heroImgElement.classList.remove('fade-out');
                }, 120);
            }
        }, 220);
    };

    if (prevSlideBtn) {
        prevSlideBtn.addEventListener('click', () => {
            currentSlideIndex = (currentSlideIndex - 1 + heroSlidesData.length) % heroSlidesData.length;
            renderSlide(currentSlideIndex);
        });
    }

    if (nextSlideBtn) {
        nextSlideBtn.addEventListener('click', () => {
            currentSlideIndex = (currentSlideIndex + 1) % heroSlidesData.length;
            renderSlide(currentSlideIndex);
        });
    }


    /* ==========================================================================
       MODULE 4: LUXURY SEARCH MODAL OVERLAY
       Handles search overlay open/close, focus, and quick-tag filtering.
       ========================================================================== */
    const searchBtn = document.getElementById('searchBtn');
    const searchModal = document.getElementById('searchModal');
    const searchBackdrop = document.getElementById('searchBackdrop');
    const searchCloseBtn = document.getElementById('searchCloseBtn');
    const searchField = document.getElementById('searchField');
    const quickTags = document.querySelectorAll('.quick-tag');

    const openSearchModal = () => {
        if (!searchModal) return;
        searchModal.classList.add('active');
        searchModal.setAttribute('aria-hidden', 'false');
        setTimeout(() => {
            if (searchField) searchField.focus();
        }, 100);
    };

    const closeSearchModal = () => {
        if (!searchModal) return;
        searchModal.classList.remove('active');
        searchModal.setAttribute('aria-hidden', 'true');
    };

    if (searchBtn) searchBtn.addEventListener('click', openSearchModal);
    if (searchCloseBtn) searchCloseBtn.addEventListener('click', closeSearchModal);
    if (searchBackdrop) searchBackdrop.addEventListener('click', closeSearchModal);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchModal && searchModal.classList.contains('active')) {
            closeSearchModal();
        }
    });

    // Quick tag clicks in search overlay
    quickTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const query = tag.getAttribute('data-query');
            if (!query) return;

            const catalogSearch = document.getElementById('catalogSearch');
            if (catalogSearch) {
                // If on shop page, execute in-catalog filter immediately
                closeSearchModal();
                catalogSearch.value = query;
                catalogSearch.dispatchEvent(new Event('input', { bubbles: true }));
                const catalogSec = document.getElementById('catalog');
                if (catalogSec) {
                    catalogSec.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                // If on homepage, redirect to shop page with search query
                const targetUrl = isSubdirectory ? `02.  shop.html?search=${encodeURIComponent(query)}` : `shop.html?search=${encodeURIComponent(query)}`;
                window.location.href = targetUrl;
            }
        });
    });

    if (searchField) {
        searchField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = searchField.value.trim();
                if (!query) return;

                const catalogSearch = document.getElementById('catalogSearch');
                if (catalogSearch) {
                    closeSearchModal();
                    catalogSearch.value = query;
                    catalogSearch.dispatchEvent(new Event('input', { bubbles: true }));
                    const catalogSec = document.getElementById('catalog');
                    if (catalogSec) {
                        catalogSec.scrollIntoView({ behavior: 'smooth' });
                    }
                } else {
                    const targetUrl = isSubdirectory ? `02.  shop.html?search=${encodeURIComponent(query)}` : `shop.html?search=${encodeURIComponent(query)}`;
                    window.location.href = targetUrl;
                }
            }
        });
    }


    /* ==========================================================================
       MODULE 5: NEWSLETTER FORM VALIDATION
       Validates email input and presents confirmation state.
       ========================================================================== */
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterInput = document.getElementById('newsletterEmail');
    const newsletterFeedback = document.getElementById('newsletterFeedback');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterInput ? newsletterInput.value.trim() : '';
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!email || !emailRegex.test(email)) {
                if (newsletterFeedback) {
                    newsletterFeedback.textContent = 'Please enter a valid email address.';
                    newsletterFeedback.style.color = '#F28B82';
                    newsletterFeedback.style.display = 'block';
                }
                if (newsletterInput) newsletterInput.focus();
                return;
            }

            if (newsletterFeedback) {
                newsletterFeedback.textContent = '✓ Thank you for subscribing! Check your inbox for exclusive offers.';
                newsletterFeedback.style.color = '#81C995';
                newsletterFeedback.style.display = 'block';
            }

            if (newsletterInput) {
                newsletterInput.value = '';
                newsletterInput.placeholder = 'Subscribed successfully!';
            }

            setTimeout(() => {
                if (newsletterFeedback) newsletterFeedback.style.display = 'none';
                if (newsletterInput) newsletterInput.placeholder = 'Enter your email address';
            }, 5000);
        });
    }


    /* ==========================================================================
       MODULE 6: MOBILE MENU DRAWER (RESPONSIVE)
       Toggles mobile navigation view on small viewports.
       ========================================================================== */
    const navToggle = document.getElementById('navToggle');
    const mobileDrawer = document.getElementById('mobileNav') || document.getElementById('mobileDrawer');

    if (navToggle && mobileDrawer) {
        navToggle.addEventListener('click', () => {
            const isOpen = mobileDrawer.classList.contains('open');
            navToggle.setAttribute('aria-expanded', !isOpen);
            mobileDrawer.classList.toggle('open');
        });

        mobileDrawer.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileDrawer.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }


    /* ==========================================================================
       MODULE 7: SHOP ALL CATALOG ENGINE (FILTERING, SEARCH & SORTING)
       Interactive engine powering shop.html and 02.  shop.html.
       Displays all luxury fragrances with scent note filtering, live search,
       and multi-criteria sorting.
       ========================================================================== */
    const shopGrid = document.getElementById('shopProductsGrid');

    if (shopGrid) {
        const productCards = Array.from(shopGrid.querySelectorAll('.product-card'));
        const scentChips = document.querySelectorAll('.scent-chip');
        const catalogSearchInput = document.getElementById('catalogSearch');
        const clearSearchBtn = document.getElementById('clearSearch');
        const catalogSortSelect = document.getElementById('catalogSort');
        const countDisplay = document.getElementById('catalogCountDisplay');
        const resetFiltersBtn = document.getElementById('btnResetFilters');
        const emptyState = document.getElementById('catalogEmptyState');
        const emptyResetBtn = document.getElementById('btnEmptyReset');

        // Current filter states
        let selectedFamily = 'all';
        let searchQuery = '';
        let sortMode = 'featured';

        /**
         * Core catalog filtering & sorting evaluator
         */
        const updateCatalog = () => {
            let visibleCount = 0;

            productCards.forEach(card => {
                const cardFamily = (card.getAttribute('data-family') || '').toLowerCase();
                const cardName = (card.getAttribute('data-name') || '').toLowerCase();
                const cardBrand = (card.querySelector('.product-brand')?.textContent || '').toLowerCase();
                const cardNotes = (card.querySelector('.product-notes')?.textContent || '').toLowerCase();

                // 1. Scent Family filter (Floral, Woody, Amber, Fresh, Gourmand)
                const matchesFamily = (selectedFamily === 'all') || (cardFamily === selectedFamily);

                // 2. Search query filter
                const matchesSearch = !searchQuery || 
                    cardName.includes(searchQuery) || 
                    cardBrand.includes(searchQuery) || 
                    cardNotes.includes(searchQuery);

                if (matchesFamily && matchesSearch) {
                    card.style.display = 'flex';
                    card.classList.remove('card-hidden');
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                    card.classList.add('card-hidden');
                }
            });

            // Update result count readout
            if (countDisplay) {
                countDisplay.innerHTML = `Showing <strong>${visibleCount}</strong> luxury fragrance${visibleCount === 1 ? '' : 's'}`;
            }

            // Handle empty state
            if (emptyState) {
                if (visibleCount === 0) {
                    emptyState.style.display = 'block';
                    shopGrid.style.display = 'none';
                } else {
                    emptyState.style.display = 'none';
                    shopGrid.style.display = 'grid';
                }
            }

            // Show "Clear All Filters" button if filters are active
            const hasActiveFilters = (selectedFamily !== 'all') || (searchQuery !== '');
            if (resetFiltersBtn) {
                resetFiltersBtn.style.display = hasActiveFilters ? 'inline-block' : 'none';
            }

            // Show or hide clear button inside search box
            if (clearSearchBtn) {
                clearSearchBtn.style.display = searchQuery ? 'block' : 'none';
            }

            // Execute active sorting order on visible cards
            sortCatalogCards();
        };

        /**
         * Sort catalog cards according to user dropdown selection
         */
        const sortCatalogCards = () => {
            const currentCards = Array.from(shopGrid.children);

            currentCards.sort((a, b) => {
                if (sortMode === 'price-asc') {
                    const priceA = parseFloat(a.getAttribute('data-price')) || 0;
                    const priceB = parseFloat(b.getAttribute('data-price')) || 0;
                    return priceA - priceB;
                } else if (sortMode === 'price-desc') {
                    const priceA = parseFloat(a.getAttribute('data-price')) || 0;
                    const priceB = parseFloat(b.getAttribute('data-price')) || 0;
                    return priceB - priceA;
                } else if (sortMode === 'rating') {
                    const ratingA = parseFloat(a.getAttribute('data-rating')) || 0;
                    const ratingB = parseFloat(b.getAttribute('data-rating')) || 0;
                    return ratingB - ratingA;
                } else if (sortMode === 'name-asc') {
                    const nameA = (a.getAttribute('data-name') || '').toLowerCase();
                    const nameB = (b.getAttribute('data-name') || '').toLowerCase();
                    return nameA.localeCompare(nameB);
                } else {
                    // Default / Featured: preserve original DOM product ID ordering
                    const idA = parseInt(a.getAttribute('data-id'), 10) || 0;
                    const idB = parseInt(b.getAttribute('data-id'), 10) || 0;
                    return idA - idB;
                }
            });

            // Re-append in sorted order without re-rendering DOM nodes
            currentCards.forEach(card => shopGrid.appendChild(card));
        };

        // Scent Family Chips click listener
        scentChips.forEach(chip => {
            chip.addEventListener('click', () => {
                scentChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                selectedFamily = chip.getAttribute('data-family') || 'all';
                updateCatalog();
            });
        });

        // Live search input handler
        if (catalogSearchInput) {
            catalogSearchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value.trim().toLowerCase();
                updateCatalog();
            });
        }

        // Clear search input button
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => {
                if (catalogSearchInput) {
                    catalogSearchInput.value = '';
                    searchQuery = '';
                    catalogSearchInput.focus();
                    updateCatalog();
                }
            });
        }

        // Sort selector change
        if (catalogSortSelect) {
            catalogSortSelect.addEventListener('change', (e) => {
                sortMode = e.target.value;
                sortCatalogCards();
            });
        }

        // Reset all filters
        const resetAllFilters = () => {
            selectedFamily = 'all';
            searchQuery = '';
            sortMode = 'featured';

            scentChips.forEach(c => {
                const isAll = (c.getAttribute('data-family') === 'all');
                c.classList.toggle('active', isAll);
            });

            if (catalogSearchInput) catalogSearchInput.value = '';
            if (catalogSortSelect) catalogSortSelect.value = 'featured';

            updateCatalog();
        };

        if (resetFiltersBtn) resetFiltersBtn.addEventListener('click', resetAllFilters);
        if (emptyResetBtn) emptyResetBtn.addEventListener('click', resetAllFilters);

        // URL Search Parameter initialization (e.g. ?search=rose)
        const urlParams = new URLSearchParams(window.location.search);
        const paramSearch = urlParams.get('search');

        if (paramSearch) {
            if (catalogSearchInput) {
                catalogSearchInput.value = paramSearch;
                searchQuery = paramSearch.trim().toLowerCase();
                updateCatalog();
            }
        }
    }


    /* ==========================================================================
       MODULE 8: LUXURY PRODUCT QUICK-VIEW MODAL ("Select & View Products")
       Rich modal displaying full olfactory pyramids, interactive bottle sizes,
       precise pricing calculation, and direct bag addition.
       ========================================================================== */
    const productsCatalogData = {
        1: {
            id: 1,
            name: "Signature Rose",
            brand: "Omniscent",
            badge: "Signature",
            badgeClass: "badge-signature",
            price: 28000,
            rating: "5.0",
            reviewsCount: 128,
            img: "product-signature-rose.png",
            desc: "A transcendent symphony of hand-harvested imperial roses draped in saffron and warm Australian sandalwood. Formulated to evoke eternal poise and an unforgettable lingering presence.",
            topNotes: "Grasse Rose, Pink Pepper",
            heartNotes: "Saffron, Golden Amber",
            baseNotes: "Sandalwood, White Musk"
        },
        2: {
            id: 2,
            name: "Bleu de Chanel",
            brand: "Chanel",
            badge: "Best Seller",
            badgeClass: "badge-bestseller",
            price: 24999,
            rating: "4.9",
            reviewsCount: 214,
            img: "product-bleu-chanel-hq.png",
            desc: "An ode to masculine freedom expressed in an aromatic-woody fragrance with a captivating trail. A resolute, enigmatic fragrance that reveals itself in three acts of independence.",
            topNotes: "Grapefruit, Lemon, Mint, Pink Pepper",
            heartNotes: "Ginger, Nutmeg, Jasmine, Iso E Super",
            baseNotes: "Incense, Vetiver, Cedar, Sandalwood, Patchouli"
        },
        3: {
            id: 3,
            name: "Miss Dior",
            brand: "Dior",
            badge: "Best Seller",
            badgeClass: "badge-bestseller",
            price: 22999,
            rating: "4.9",
            reviewsCount: 189,
            img: "product-miss-dior-hq.png",
            desc: "A vibrant floral bouquet that sings with optimism and romance. Centered around velvety Grasse rose, tender lily-of-the-valley, and fresh peony enveloped in gentle musks.",
            topNotes: "Lily-of-the-Valley, Peony, Iris",
            heartNotes: "Centifolia Rose, Peach, Apricot",
            baseNotes: "Tonka Bean, Musk, Vanilla, Benzoin, Sandalwood"
        },
        4: {
            id: 4,
            name: "Sauvage Elixir",
            brand: "Dior",
            badge: "Best Seller",
            badgeClass: "badge-bestseller",
            price: 26499,
            rating: "4.9",
            reviewsCount: 176,
            img: "product-sauvage-hq.png",
            desc: "An extraordinarily concentrated fragrance steeped in the iconic freshness of Sauvage with an intoxicating heart of spices, bespoke lavender essence, and rich woods.",
            topNotes: "Nutmeg, Cinnamon, Cardamom, Grapefruit",
            heartNotes: "Lavender Essence, Licorice",
            baseNotes: "Sandalwood, Amber, Patchouli, Haitian Vetiver"
        },
        5: {
            id: 5,
            name: "Sì Eau de Parfum",
            brand: "Giorgio Armani",
            badge: "Best Seller",
            badgeClass: "badge-bestseller",
            price: 20999,
            rating: "4.8",
            reviewsCount: 142,
            img: "product-si-hq.png",
            desc: "Distinguished and elegant, Sì combines sweet nectar of blackcurrant, modern chypre, and blond wood musk. A tribute to modern femininity, grace, and unapologetic strength.",
            topNotes: "Blackcurrant Cassis Nectar",
            heartNotes: "May Rose, Freesia",
            baseNotes: "Vanilla, Patchouli, Ambroxan, Woody Notes"
        },
        6: {
            id: 6,
            name: "Creed Aventus",
            brand: "Creed",
            badge: "Ultra Luxury",
            badgeClass: "badge-luxury",
            price: 42000,
            rating: "5.0",
            reviewsCount: 310,
            img: "product-creed-aventus.png",
            desc: "Celebrated for its iconic duality of crisp blackcurrant, Italian bergamot, and smoky birch bark. A masterpiece of distinction celebrating strength, power, vision, and success.",
            topNotes: "Bergamot, Blackcurrant Leaves, Apple, Pineapple",
            heartNotes: "Pinkberries, Birch, Patchouli, Jasmine",
            baseNotes: "Musk, Oakmoss, Ambergris, Vanilla"
        },
        7: {
            id: 7,
            name: "Baccarat Rouge 540",
            brand: "Maison Francis Kurkdjian",
            badge: "Iconic",
            badgeClass: "badge-signature",
            price: 44999,
            rating: "5.0",
            reviewsCount: 265,
            img: "product-baccarat-rouge.png",
            desc: "Luminous and sophisticated, Baccarat Rouge 540 lays on the skin like an amber floral and woody breeze. A poetic alchemy where aerial notes of jasmine and saffron carry mineral ambergris.",
            topNotes: "Jasmine Grandiflorum, Saffron",
            heartNotes: "Bitter Almond, Cedarwood",
            baseNotes: "Woody Musk, Ambergris Accord"
        },
        8: {
            id: 8,
            name: "Tom Ford Oud Wood",
            brand: "Tom Ford",
            badge: "Private Blend",
            badgeClass: "badge-luxury",
            price: 39500,
            rating: "4.9",
            reviewsCount: 198,
            img: "product-tomford-oud.png",
            desc: "One of the most rare, precious, and expensive ingredients in a perfumer's arsenal, oud wood is enveloped by rosewood and cardamom, followed by a smoky blend of sandalwood and vetiver.",
            topNotes: "Rosewood, Cardamom, Chinese Pepper",
            heartNotes: "Oud Wood, Sandalwood, Vetiver",
            baseNotes: "Tonka Bean, Vanilla, Amber"
        },
        9: {
            id: 9,
            name: "Libre Eau de Parfum",
            brand: "Yves Saint Laurent",
            badge: "Popular",
            badgeClass: "badge-new",
            price: 23899,
            rating: "4.8",
            reviewsCount: 154,
            img: "product-ysl-libre.png",
            desc: "The fragrance of freedom. The burning sensuality of noble Moroccan orange blossom blended with the aromatic boldness of French diva lavender for an unapologetically couture trail.",
            topNotes: "Mandarin Oil, Petitgrain, Lavender Oil, Blackcurrant",
            heartNotes: "Lavender, Jasmine Sambac, Moroccan Orange Blossom",
            baseNotes: "Madagascar Vanilla, Cedarwood, Ambergris, Musk"
        },
        10: {
            id: 10,
            name: "Delina",
            brand: "Parfums de Marly",
            badge: "Niche",
            badgeClass: "badge-signature",
            price: 38500,
            rating: "4.9",
            reviewsCount: 182,
            img: "product-delina.png",
            desc: "A charming and firmly modern floral bouquet. Delina is a highly nuanced fragrance which is both sweet and sensual, dominated by Turkish rose, lily of the valley, and peony.",
            topNotes: "Rhubarb, Lychee, Bergamot Essence, Nutmeg",
            heartNotes: "Turkish Rose, Peony, Vanilla, Musk",
            baseNotes: "Cashmeran, Cedarwood, Vetiver, Frankincense"
        },
        11: {
            id: 11,
            name: "Replica Jazz Club",
            brand: "Maison Margiela",
            badge: "Curator Pick",
            badgeClass: "badge-new",
            price: 24500,
            rating: "4.8",
            reviewsCount: 167,
            img: "product-jazz-club.png",
            desc: "An anthology of classic cocktails and coppery tones through rich notes of rum absolute blended with tobacco leaf and pink pepper. Reminiscent of a private Brooklyn jazz club.",
            topNotes: "Pink Pepper, Neroli, Lemon",
            heartNotes: "Rum Absolute, Clary Sage, Java Vetiver",
            baseNotes: "Tobacco Leaf, Vanilla Bean, Styrax Resin"
        },
        12: {
            id: 12,
            name: "Santal 33",
            brand: "Le Labo",
            badge: "Cult Classic",
            badgeClass: "badge-signature",
            price: 37000,
            rating: "4.9",
            reviewsCount: 240,
            img: "product-santal-33.png",
            desc: "An open fire, the soft drift of smoke, where sensuality rises after the light has gone. Cardamom, iris, violet, and ambrox crackle in the formula and bring smoking woods to life.",
            topNotes: "Cardamom, Violet Accord, Papyrus",
            heartNotes: "Iris, Ambrox, Cedarwood",
            baseNotes: "Australian Sandalwood, Leather Accord"
        },
        13: {
            id: 13,
            name: "Wood Sage & Sea Salt",
            brand: "Jo Malone",
            badge: "Refreshing",
            badgeClass: "badge-new",
            price: 19800,
            rating: "4.7",
            reviewsCount: 135,
            img: "product-jomalone-woodsage.png",
            desc: "Windswept walks along the English coast. Alive with the mineral scent of rugged cliffs, mingling with the woody earthiness of sage. Buoyant, dynamic, and wonderfully fresh.",
            topNotes: "Ambrette Seeds, Mineral Sea Salt",
            heartNotes: "Sea Salt, Dried Fruit, Buchu",
            baseNotes: "Sage, Driftwood, Guaiac Wood"
        },
        14: {
            id: 14,
            name: "Coco Mademoiselle",
            brand: "Chanel",
            badge: "Timeless",
            badgeClass: "badge-bestseller",
            price: 25499,
            rating: "4.9",
            reviewsCount: 289,
            img: "product-coco-mademoiselle.png",
            desc: "The essence of a bold, free woman. An airy, feminine amber fragrance with a surprisingly fresh, vibrant personality. Sparks of fresh orange awaken the senses before a clear heart unfolds.",
            topNotes: "Orange, Bergamot, Mandarin Orange",
            heartNotes: "Turkish Rose, Jasmine, Mimosa, Ylang-Ylang",
            baseNotes: "Patchouli, White Musk, Vanilla, Vetiver, Tonka Bean"
        },
        15: {
            id: 15,
            name: "Angels' Share",
            brand: "Kilian Paris",
            badge: "Prestige",
            badgeClass: "badge-signature",
            price: 36999,
            rating: "4.9",
            reviewsCount: 153,
            img: "product-angels-share.png",
            desc: "Inspired by the eighth-generation Hennessy savoir-faire. Contains essence of Cognac derived from the liquor to lend it a natural caramel color, blending cognac oil with oak absolute.",
            topNotes: "Cognac Essence, Cognac Accord",
            heartNotes: "Cinnamon Bark, Oak Absolute, Tonka Bean",
            baseNotes: "Praline, Vanilla, Sandalwood"
        },
        16: {
            id: 16,
            name: "Acqua di Giò Parfum",
            brand: "Giorgio Armani",
            badge: "Classic",
            badgeClass: "badge-new",
            price: 21500,
            rating: "4.8",
            reviewsCount: 175,
            img: "product-acqua-di-gio.png",
            desc: "A powerful, charismatic interpretation of the ocean's untamed spirit. Intense marine accords fuse with aromatic rosemary, clary sage, and a profound, smoky incense trail.",
            topNotes: "Marine Notes, Bergamot",
            heartNotes: "Rosemary, Clary Sage, Geranium",
            baseNotes: "Frankincense, Patchouli"
        }
    };

    const productModal = document.getElementById('productModal');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalImg = document.getElementById('modalImg');
    const modalBadge = document.getElementById('modalBadge');
    const modalBrand = document.getElementById('modalBrand');
    const modalPerfumeName = document.getElementById('modalPerfumeName');
    const modalRating = document.getElementById('modalRating');
    const modalPrice = document.getElementById('modalPrice');
    const modalDesc = document.getElementById('modalDesc');
    const modalTopNotes = document.getElementById('modalTopNotes');
    const modalHeartNotes = document.getElementById('modalHeartNotes');
    const modalBaseNotes = document.getElementById('modalBaseNotes');
    const modalSizeBtns = document.querySelectorAll('.size-options .size-btn');
    const qtyMinus = document.getElementById('qtyMinus');
    const qtyPlus = document.getElementById('qtyPlus');
    const qtyVal = document.getElementById('qtyVal');
    const modalAddToCartBtn = document.getElementById('modalAddToCartBtn');

    let currentModalProduct = null;
    let currentMultiplier = 1;
    let currentQuantity = 1;

    /**
     * Open Quick-View Modal and populate product data
     * @param {number} productId 
     */
    const openProductQuickView = (productId) => {
        if (!productModal) return;

        const product = productsCatalogData[productId];
        if (!product) return;

        currentModalProduct = product;
        currentMultiplier = 1;
        currentQuantity = 1;

        // Populate modal data
        if (modalImg) {
            modalImg.src = getImgPrefix() + product.img;
            modalImg.alt = product.name;
        }

        if (modalBadge) {
            modalBadge.textContent = product.badge;
            modalBadge.className = `modal-badge ${product.badgeClass}`;
        }

        if (modalBrand) modalBrand.textContent = product.brand;
        if (modalPerfumeName) modalPerfumeName.textContent = product.name;
        if (modalRating) modalRating.textContent = product.rating;
        if (modalDesc) modalDesc.textContent = product.desc;
        if (modalTopNotes) modalTopNotes.textContent = product.topNotes;
        if (modalHeartNotes) modalHeartNotes.textContent = product.heartNotes;
        if (modalBaseNotes) modalBaseNotes.textContent = product.baseNotes;

        // Reset volume sizes to 50ml
        modalSizeBtns.forEach(btn => {
            const is50ml = (btn.getAttribute('data-size') === '50ml');
            btn.classList.toggle('active', is50ml);
        });

        // Set initial calculated price & quantity
        updateModalPrice();
        if (qtyVal) qtyVal.textContent = '1';

        // Display modal
        productModal.classList.add('active');
        productModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Prevent background page scrolling
    };

    /**
     * Close Quick-View Modal
     */
    const closeProductQuickView = () => {
        if (!productModal) return;
        productModal.classList.remove('active');
        productModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    /**
     * Recalculate and render modal price based on size multiplier
     */
    const updateModalPrice = () => {
        if (!modalPrice || !currentModalProduct) return;
        const calculatedPrice = Math.round(currentModalProduct.price * currentMultiplier);
        modalPrice.textContent = `Rs. ${calculatedPrice.toLocaleString()}`;
    };

    // Size Selection handler
    modalSizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modalSizeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMultiplier = parseFloat(btn.getAttribute('data-multiplier')) || 1;
            updateModalPrice();
        });
    });

    // Quantity Counter handlers
    if (qtyMinus) {
        qtyMinus.addEventListener('click', () => {
            if (currentQuantity > 1) {
                currentQuantity--;
                if (qtyVal) qtyVal.textContent = currentQuantity;
            }
        });
    }

    if (qtyPlus) {
        qtyPlus.addEventListener('click', () => {
            if (currentQuantity < 10) {
                currentQuantity++;
                if (qtyVal) qtyVal.textContent = currentQuantity;
            }
        });
    }

    // Modal Add-To-Bag handler
    if (modalAddToCartBtn) {
        modalAddToCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (!currentModalProduct) return;

            const selectedSizeBtn = document.querySelector('.size-options .size-btn.active');
            const selectedSize = selectedSizeBtn ? selectedSizeBtn.getAttribute('data-size') : '50ml';
            const sizePrice = Math.round(currentModalProduct.price * currentMultiplier);

            addProductToBag({
                id: currentModalProduct.id,
                name: currentModalProduct.name,
                brand: currentModalProduct.brand,
                size: selectedSize,
                price: sizePrice,
                img: currentModalProduct.img,
                qty: currentQuantity
            });
            showCartToast(`${currentModalProduct.name} (${selectedSize}) x${currentQuantity}`);

            // Visual feedback on modal CTA button
            const originalHTML = modalAddToCartBtn.innerHTML;
            modalAddToCartBtn.innerHTML = `
                <span>Added to Bag!</span>
                <span class="btn-arrow">&#10003;</span>
            `;
            modalAddToCartBtn.style.backgroundColor = 'var(--color-accent-rose)';

            setTimeout(() => {
                modalAddToCartBtn.innerHTML = originalHTML;
                modalAddToCartBtn.style.backgroundColor = '';
                closeProductQuickView();
            }, 600);
        });
    }

    // Bind Quick View triggers to all catalog product cards
    const bindQuickViewTriggers = () => {
        const cards = document.querySelectorAll('.product-card');
        cards.forEach(card => {
            const cardId = parseInt(card.getAttribute('data-id'), 10);
            if (!cardId) return;

            // Trigger on image wrapper click or keypress
            const imgWrapper = card.querySelector('.product-img-wrapper');
            if (imgWrapper) {
                imgWrapper.addEventListener('click', (e) => {
                    e.preventDefault();
                    openProductQuickView(cardId);
                });
                imgWrapper.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openProductQuickView(cardId);
                    }
                });
            }

            // Trigger on Quick View button inside overlay
            const quickBtn = card.querySelector('.btn-quick-view');
            if (quickBtn) {
                quickBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openProductQuickView(cardId);
                });
            }
        });
    };

    bindQuickViewTriggers();

    // Modal Close event listeners
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProductQuickView);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeProductQuickView);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && productModal && productModal.classList.contains('active')) {
            closeProductQuickView();
        }
    });


    /* ==========================================================================
       MODULE 9: CHECKOUT FLOW ENGINE
       Powers checkout.html and Pages/12.  checkout-flow.html.
       Handles bag rendering, shipping validation, vouchers, Cash on Delivery &
       Online Payment channels, order review, and Thank You confirmation.
       ========================================================================== */
    const checkoutWorkspace = document.getElementById('checkoutWorkspace');

    if (checkoutWorkspace) {
        const SAMPLE_BAG_ITEMS = [
            {
                id: 1,
                name: 'Signature Rose',
                brand: 'Omniscent',
                size: '50ml',
                price: 28000,
                img: 'product-signature-rose.png',
                qty: 1
            },
            {
                id: 2,
                name: 'Bleu de Chanel',
                brand: 'Chanel',
                size: '50ml',
                price: 24999,
                img: 'product-bleu-chanel-hq.png',
                qty: 1
            }
        ];

        const VOUCHER_CATALOG = {
            OMNI10: { type: 'percent', value: 10, label: '10% Off Fragrance Order' },
            ROSE2000: { type: 'fixed', value: 2000, label: 'Rs. 2,000 Off' },
            FREESHIP: { type: 'freeship', value: 0, label: 'Complimentary Express Shipping' }
        };

        const formatCurrency = (amount) => `Rs. ${Math.max(0, Math.round(amount)).toLocaleString()}`;

        const escapeHtml = (str) => String(str || '').replace(/[&<>"']/g, (ch) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        })[ch]);

        // Load or seed bag items
        let isPreviewBag = false;
        let bagItems = readCartItems();
        if (bagItems === null) {
            bagItems = SAMPLE_BAG_ITEMS.map(item => ({ ...item }));
            isPreviewBag = true;
            writeCartItems(bagItems);
        }

        const checkoutState = {
            currentStep: 1,
            maxReachedStep: 1,
            orderCompleted: false,
            deliveryTier: 'standard',
            paymentMethod: 'cod',
            onlineChannel: 'card',
            voucherCode: null,
            shipping: {
                fullName: '',
                phoneNumber: '',
                emailAddress: '',
                streetAddress: '',
                apartment: '',
                city: '',
                province: 'Islamabad Capital Territory',
                postalCode: '',
                giftNote: ''
            }
        };

        // DOM Elements
        const stepperItems = document.querySelectorAll('#checkoutStepper .stepper-item');
        const stepPanels = document.querySelectorAll('.checkout-step-panel');
        const stepThankYou = document.getElementById('stepThankYou');

        const summaryItemsList = document.getElementById('summaryItemsList');
        const summaryEmptyState = document.getElementById('summaryEmptyState');
        const previewBagNotice = document.getElementById('previewBagNotice');
        const restoreSampleBagBtn = document.getElementById('restoreSampleBagBtn');
        const summaryItemBadge = document.getElementById('summaryItemBadge');
        const summarySubtotalEl = document.getElementById('summarySubtotal');
        const summaryShippingEl = document.getElementById('summaryShipping');
        const summaryDiscountRow = document.getElementById('summaryDiscountRow');
        const summaryDiscountEl = document.getElementById('summaryDiscount');
        const summaryTotalEl = document.getElementById('summaryTotal');
        const summaryVoucherRow = document.getElementById('summaryVoucherRow');
        const summaryVoucherCodeEl = document.getElementById('summaryVoucherCode');
        const summaryVoucherSavedEl = document.getElementById('summaryVoucherSaved');
        const removeVoucherBtn = document.getElementById('removeVoucherBtn');
        const standardShippingTag = document.getElementById('standardShippingTag');
        const expressShippingTag = document.getElementById('expressShippingTag');

        const shippingForm = document.getElementById('shippingForm');
        const paymentForm = document.getElementById('paymentForm');
        const deliveryCards = document.querySelectorAll('.delivery-options-grid .option-card');
        const paymentCards = document.querySelectorAll('.payment-methods-list .payment-option-card');
        const codDetailsPanel = document.getElementById('codDetailsPanel');
        const onlinePaymentPanel = document.getElementById('onlinePaymentPanel');
        const onlineSubtabs = document.querySelectorAll('.online-subtab');
        const channelCard = document.getElementById('channelCard');
        const channelWallet = document.getElementById('channelWallet');

        const voucherInput = document.getElementById('voucherInput');
        const applyVoucherBtn = document.getElementById('applyVoucherBtn');
        const voucherFeedback = document.getElementById('voucherFeedback');
        const voucherChips = document.querySelectorAll('.voucher-chip');

        const cardNumberInput = document.getElementById('cardNumber');
        const cardExpiryInput = document.getElementById('cardExpiry');

        const backToShippingBtn = document.getElementById('backToShippingBtn');
        const backToPaymentBtn = document.getElementById('backToPaymentBtn');
        const confirmOrderBtn = document.getElementById('confirmOrderBtn');
        const confirmTerms = document.getElementById('confirmTerms');
        const printOrderBtn = document.getElementById('printOrderBtn');

        // Totals calculation helper
        const computeTotals = () => {
            const subtotal = bagItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
            const totalQty = bagItems.reduce((sum, item) => sum + item.qty, 0);

            if (bagItems.length === 0) {
                return { subtotal: 0, shippingCost: 0, discountAmount: 0, total: 0, totalQty: 0, baseShipping: 0 };
            }

            const standardCost = subtotal >= 20000 ? 0 : 450;
            const baseShipping = checkoutState.deliveryTier === 'express' ? 950 : standardCost;
            let shippingCost = baseShipping;
            let discountAmount = 0;

            if (checkoutState.voucherCode && VOUCHER_CATALOG[checkoutState.voucherCode]) {
                const rule = VOUCHER_CATALOG[checkoutState.voucherCode];
                if (rule.type === 'percent') {
                    discountAmount = Math.round(subtotal * (rule.value / 100));
                } else if (rule.type === 'fixed') {
                    discountAmount = Math.min(rule.value, subtotal);
                } else if (rule.type === 'freeship') {
                    shippingCost = 0;
                    discountAmount = baseShipping;
                }
            }

            const total = checkoutState.voucherCode === 'FREESHIP'
                ? Math.max(0, subtotal)
                : Math.max(0, subtotal - discountAmount + shippingCost);

            return { subtotal, shippingCost, discountAmount, total, totalQty, baseShipping };
        };

        // Render Order Summary Sidebar
        const renderOrderSummary = () => {
            const totals = computeTotals();

            if (previewBagNotice) {
                previewBagNotice.style.display = (isPreviewBag && bagItems.length > 0) ? 'flex' : 'none';
            }

            if (summaryItemBadge) {
                summaryItemBadge.textContent = `${totals.totalQty} Item${totals.totalQty === 1 ? '' : 's'}`;
            }

            if (standardShippingTag) {
                standardShippingTag.textContent = totals.subtotal >= 20000 || bagItems.length === 0 ? 'Free' : 'Rs. 450';
            }
            if (expressShippingTag) {
                expressShippingTag.textContent = checkoutState.voucherCode === 'FREESHIP' ? 'Free (FREESHIP)' : 'Rs. 950';
            }

            if (bagItems.length === 0) {
                if (summaryItemsList) summaryItemsList.innerHTML = '';
                if (summaryEmptyState) summaryEmptyState.style.display = 'block';
            } else {
                if (summaryEmptyState) summaryEmptyState.style.display = 'none';
                if (summaryItemsList) {
                    summaryItemsList.innerHTML = bagItems.map((item, idx) => `
                        <div class="summary-item" data-index="${idx}">
                            <img src="${getImgPrefix()}${escapeHtml(item.img)}" alt="${escapeHtml(item.name)}" class="summary-item-img">
                            <div class="summary-item-info">
                                <div class="summary-item-name">${escapeHtml(item.name)}</div>
                                <div class="summary-item-sub">${escapeHtml(item.brand)} &bull; ${escapeHtml(item.size)}</div>
                                <div class="summary-qty-bar">
                                    <button type="button" class="sum-qty-btn" data-action="dec" data-index="${idx}" aria-label="Decrease quantity">&minus;</button>
                                    <span class="sum-qty-val">${item.qty}</span>
                                    <button type="button" class="sum-qty-btn" data-action="inc" data-index="${idx}" aria-label="Increase quantity">&#43;</button>
                                </div>
                            </div>
                            <div class="summary-item-right">
                                <span class="summary-item-total">${formatCurrency(item.price * item.qty)}</span>
                                <button type="button" class="btn-remove-item" data-action="remove" data-index="${idx}">Remove</button>
                            </div>
                        </div>
                    `).join('');
                }
            }

            if (summarySubtotalEl) summarySubtotalEl.textContent = formatCurrency(totals.subtotal);
            if (summaryShippingEl) {
                if (bagItems.length === 0) {
                    summaryShippingEl.textContent = 'Rs. 0';
                } else if (totals.shippingCost === 0) {
                    summaryShippingEl.textContent = checkoutState.voucherCode === 'FREESHIP' ? 'Free (Voucher)' : 'Free';
                } else {
                    summaryShippingEl.textContent = formatCurrency(totals.shippingCost);
                }
            }

            const hasVoucher = Boolean(checkoutState.voucherCode && bagItems.length > 0);
            if (summaryVoucherRow) {
                summaryVoucherRow.style.display = hasVoucher ? 'flex' : 'none';
            }
            if (summaryVoucherCodeEl && hasVoucher) {
                summaryVoucherCodeEl.textContent = checkoutState.voucherCode;
            }
            if (summaryVoucherSavedEl && hasVoucher) {
                summaryVoucherSavedEl.textContent = totals.discountAmount > 0
                    ? `-${formatCurrency(totals.discountAmount)}`
                    : 'Free Shipping';
            }

            if (summaryDiscountRow) {
                summaryDiscountRow.style.display = (hasVoucher && checkoutState.voucherCode !== 'FREESHIP' && totals.discountAmount > 0) ? 'flex' : 'none';
            }
            if (summaryDiscountEl) {
                summaryDiscountEl.textContent = `-${formatCurrency(totals.discountAmount)}`;
            }

            if (summaryTotalEl) {
                summaryTotalEl.textContent = formatCurrency(totals.total);
            }
        };

        // Summary item quantity & remove delegation
        if (summaryItemsList) {
            summaryItemsList.addEventListener('click', (e) => {
                const target = e.target.closest('button[data-action]');
                if (!target) return;
                const idx = parseInt(target.getAttribute('data-index'), 10);
                const action = target.getAttribute('data-action');
                if (Number.isNaN(idx) || !bagItems[idx]) return;

                isPreviewBag = false;
                if (action === 'inc') {
                    bagItems[idx].qty = Math.min(20, bagItems[idx].qty + 1);
                } else if (action === 'dec') {
                    if (bagItems[idx].qty > 1) {
                        bagItems[idx].qty -= 1;
                    } else {
                        bagItems.splice(idx, 1);
                    }
                } else if (action === 'remove') {
                    bagItems.splice(idx, 1);
                }

                writeCartItems(bagItems);
                renderOrderSummary();
                if (checkoutState.currentStep === 3) {
                    populateConfirmationReview();
                }
            });
        }

        if (restoreSampleBagBtn) {
            restoreSampleBagBtn.addEventListener('click', () => {
                bagItems = SAMPLE_BAG_ITEMS.map(item => ({ ...item }));
                isPreviewBag = true;
                writeCartItems(bagItems);
                renderOrderSummary();
                if (checkoutState.currentStep === 3) {
                    populateConfirmationReview();
                }
            });
        }

        // Field error helpers
        const setFieldError = (fieldId, message) => {
            const input = document.getElementById(fieldId);
            const errEl = document.getElementById(`err-${fieldId}`);
            if (input) input.classList.toggle('input-invalid', Boolean(message));
            if (errEl) errEl.textContent = message || '';
        };

        const clearAllErrors = () => {
            document.querySelectorAll('.form-input.input-invalid').forEach(el => el.classList.remove('input-invalid'));
            document.querySelectorAll('.field-error').forEach(el => { el.textContent = ''; });
        };

        document.querySelectorAll('.checkout-form .form-input').forEach(input => {
            input.addEventListener('input', () => {
                if (input.id) setFieldError(input.id, '');
            });
        });

        // Step Navigation
        const goToStep = (stepNumber) => {
            if (checkoutState.orderCompleted && stepNumber < 4) return;

            checkoutState.currentStep = stepNumber;
            if (stepNumber > checkoutState.maxReachedStep) {
                checkoutState.maxReachedStep = stepNumber;
            }

            stepperItems.forEach(item => {
                const s = parseInt(item.getAttribute('data-step'), 10);
                item.classList.toggle('active', s === stepNumber);
                item.classList.toggle('completed', s < stepNumber);
            });

            if (stepNumber === 4) {
                checkoutWorkspace.style.display = 'none';
                if (stepThankYou) stepThankYou.style.display = 'block';
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            checkoutWorkspace.style.display = 'grid';
            if (stepThankYou) stepThankYou.style.display = 'none';

            stepPanels.forEach(panel => {
                const pStep = parseInt(panel.getAttribute('data-step'), 10);
                panel.classList.toggle('active', pStep === stepNumber);
            });

            if (stepNumber === 3) {
                populateConfirmationReview();
            }

            checkoutWorkspace.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };

        // Validate Step 1 (Shipping & Contact Info)
        const validateShippingStep = () => {
            clearAllErrors();
            let valid = true;

            const fullName = document.getElementById('fullName')?.value.trim() || '';
            const phoneNumber = document.getElementById('phoneNumber')?.value.trim() || '';
            const emailAddress = document.getElementById('emailAddress')?.value.trim() || '';
            const streetAddress = document.getElementById('streetAddress')?.value.trim() || '';
            const apartment = document.getElementById('apartment')?.value.trim() || '';
            const city = document.getElementById('city')?.value.trim() || '';
            const province = document.getElementById('province')?.value || '';
            const postalCode = document.getElementById('postalCode')?.value.trim() || '';
            const giftNote = document.getElementById('giftNote')?.value.trim() || '';

            if (fullName.length < 2) {
                setFieldError('fullName', 'Please enter your full name.');
                valid = false;
            }
            if (phoneNumber.replace(/\D/g, '').length < 7) {
                setFieldError('phoneNumber', 'Please enter a valid contact phone number.');
                valid = false;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
                setFieldError('emailAddress', 'Please enter a valid email address.');
                valid = false;
            }
            if (streetAddress.length < 4) {
                setFieldError('streetAddress', 'Please enter your street address.');
                valid = false;
            }
            if (city.length < 2) {
                setFieldError('city', 'Please enter your city.');
                valid = false;
            }
            if (postalCode.length < 3) {
                setFieldError('postalCode', 'Please enter a valid postal code.');
                valid = false;
            }

            if (valid) {
                checkoutState.shipping = {
                    fullName,
                    phoneNumber,
                    emailAddress,
                    streetAddress,
                    apartment,
                    city,
                    province,
                    postalCode,
                    giftNote
                };
            }

            return valid;
        };

        // Validate Step 2 (Payment Method)
        const validatePaymentStep = () => {
            clearAllErrors();
            if (bagItems.length === 0) {
                if (voucherFeedback) {
                    voucherFeedback.textContent = 'Please add at least one fragrance to your bag before continuing.';
                    voucherFeedback.className = 'voucher-feedback error';
                }
                return false;
            }

            if (checkoutState.paymentMethod === 'cod') {
                return true;
            }

            let valid = true;
            if (checkoutState.onlineChannel === 'card') {
                const cardName = document.getElementById('cardName')?.value.trim() || '';
                const cardNumber = (cardNumberInput?.value || '').replace(/\s+/g, '');
                const cardExpiry = cardExpiryInput?.value.trim() || '';
                const cardCvv = document.getElementById('cardCvv')?.value.trim() || '';

                if (cardName.length < 2) {
                    setFieldError('cardName', 'Enter the name printed on your card.');
                    valid = false;
                }
                if (!/^\d{13,19}$/.test(cardNumber)) {
                    setFieldError('cardNumber', 'Enter a valid 13 to 19 digit card number.');
                    valid = false;
                }
                if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) {
                    setFieldError('cardExpiry', 'Enter expiry as MM/YY.');
                    valid = false;
                }
                if (!/^\d{3,4}$/.test(cardCvv)) {
                    setFieldError('cardCvv', 'Enter a valid 3 or 4 digit CVV.');
                    valid = false;
                }
            } else {
                const walletNumber = document.getElementById('walletNumber')?.value.trim() || '';
                if (walletNumber.length < 7) {
                    setFieldError('walletNumber', 'Enter a valid wallet mobile number or IBAN.');
                    valid = false;
                }
            }

            return valid;
        };

        // Delivery option selection
        deliveryCards.forEach(card => {
            const radio = card.querySelector('input[type="radio"]');
            if (!radio) return;
            radio.addEventListener('change', () => {
                deliveryCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                checkoutState.deliveryTier = radio.value;
                renderOrderSummary();
            });
        });

        // Payment option selection (COD vs Online Payment)
        paymentCards.forEach(card => {
            const radio = card.querySelector('input[type="radio"]');
            if (!radio) return;
            radio.addEventListener('change', () => {
                paymentCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                checkoutState.paymentMethod = radio.value;

                if (codDetailsPanel) {
                    codDetailsPanel.style.display = radio.value === 'cod' ? 'block' : 'none';
                }
                if (onlinePaymentPanel) {
                    onlinePaymentPanel.style.display = radio.value === 'online' ? 'block' : 'none';
                }
                clearAllErrors();
            });
        });

        // Online channel subtabs (Card vs Wallet)
        onlineSubtabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const channel = tab.getAttribute('data-channel');
                checkoutState.onlineChannel = channel;
                onlineSubtabs.forEach(t => {
                    const active = t === tab;
                    t.classList.toggle('active', active);
                    t.setAttribute('aria-selected', String(active));
                });
                if (channelCard) channelCard.style.display = channel === 'card' ? 'block' : 'none';
                if (channelWallet) channelWallet.style.display = channel === 'wallet' ? 'block' : 'none';
                clearAllErrors();
            });
        });

        // Card input formatting
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', (e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
                e.target.value = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
            });
        }

        if (cardExpiryInput) {
            cardExpiryInput.addEventListener('input', (e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
                e.target.value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
            });
        }

        // Voucher application
        const applyVoucher = (rawCode) => {
            const code = String(rawCode || '').trim().toUpperCase();
            if (!code) {
                if (voucherFeedback) {
                    voucherFeedback.textContent = 'Please enter a voucher code first.';
                    voucherFeedback.className = 'voucher-feedback error';
                }
                return;
            }

            const rule = VOUCHER_CATALOG[code];
            if (!rule) {
                if (voucherFeedback) {
                    voucherFeedback.textContent = `Voucher "${code}" is not valid. Try OMNI10, ROSE2000, or FREESHIP.`;
                    voucherFeedback.className = 'voucher-feedback error';
                }
                return;
            }

            checkoutState.voucherCode = code;
            if (voucherInput) voucherInput.value = code;
            if (voucherFeedback) {
                voucherFeedback.textContent = `✓ Voucher ${code} applied (${rule.label}).`;
                voucherFeedback.className = 'voucher-feedback success';
            }
            renderOrderSummary();
        };

        if (applyVoucherBtn) {
            applyVoucherBtn.addEventListener('click', () => {
                applyVoucher(voucherInput?.value);
            });
        }

        if (voucherInput) {
            voucherInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    applyVoucher(voucherInput.value);
                }
            });
        }

        voucherChips.forEach(chip => {
            chip.addEventListener('click', () => {
                applyVoucher(chip.getAttribute('data-code'));
            });
        });

        if (removeVoucherBtn) {
            removeVoucherBtn.addEventListener('click', () => {
                checkoutState.voucherCode = null;
                if (voucherInput) voucherInput.value = '';
                if (voucherFeedback) {
                    voucherFeedback.textContent = 'Voucher removed.';
                    voucherFeedback.className = 'voucher-feedback';
                }
                renderOrderSummary();
                if (checkoutState.currentStep === 3) {
                    populateConfirmationReview();
                }
            });
        }

        // Populate Step 3 Review
        const getPaymentDisplayDetails = () => {
            if (checkoutState.paymentMethod === 'cod') {
                return {
                    title: 'Cash on Delivery (COD)',
                    sub: 'Pay in cash when your parcel is delivered.'
                };
            }
            if (checkoutState.onlineChannel === 'card') {
                const rawDigits = (cardNumberInput?.value || '').replace(/\D/g, '');
                const last4 = rawDigits.slice(-4) || '4242';
                return {
                    title: 'Online Payment — Credit / Debit Card',
                    sub: `Card ending in •••• ${last4}`
                };
            }
            const provider = document.getElementById('walletProvider')?.value || 'Digital Wallet';
            const walletNum = document.getElementById('walletNumber')?.value.trim() || '';
            return {
                title: `Online Payment — ${provider}`,
                sub: walletNum ? `Account: ${walletNum}` : 'Instant digital transfer'
            };
        };

        const populateConfirmationReview = () => {
            const s = checkoutState.shipping;
            const reviewContact = document.getElementById('reviewContact');
            const reviewAddress = document.getElementById('reviewAddress');
            const reviewDelivery = document.getElementById('reviewDelivery');
            const reviewGiftNote = document.getElementById('reviewGiftNote');
            const reviewPayment = document.getElementById('reviewPayment');
            const reviewPaymentSub = document.getElementById('reviewPaymentSub');
            const reviewVoucher = document.getElementById('reviewVoucher');
            const reviewItemsList = document.getElementById('reviewItemsList');

            if (reviewContact) {
                reviewContact.textContent = `${s.fullName} • ${s.phoneNumber} • ${s.emailAddress}`;
            }
            if (reviewAddress) {
                const aptPart = s.apartment ? `, ${s.apartment}` : '';
                reviewAddress.textContent = `${s.streetAddress}${aptPart}, ${s.city}, ${s.province} ${s.postalCode}`;
            }
            if (reviewDelivery) {
                reviewDelivery.textContent = checkoutState.deliveryTier === 'express'
                    ? 'Express Priority Dispatch (1–2 business days)'
                    : 'Standard Boutique Courier (3–5 business days)';
            }
            if (reviewGiftNote) {
                if (s.giftNote) {
                    reviewGiftNote.textContent = `Gift Note: "${s.giftNote}"`;
                    reviewGiftNote.style.display = 'block';
                } else {
                    reviewGiftNote.style.display = 'none';
                }
            }

            const payInfo = getPaymentDisplayDetails();
            if (reviewPayment) reviewPayment.textContent = payInfo.title;
            if (reviewPaymentSub) reviewPaymentSub.textContent = payInfo.sub;
            if (reviewVoucher) {
                reviewVoucher.textContent = checkoutState.voucherCode
                    ? `Voucher Applied: ${checkoutState.voucherCode} (${VOUCHER_CATALOG[checkoutState.voucherCode]?.label || ''})`
                    : 'No voucher applied';
                reviewVoucher.style.color = checkoutState.voucherCode ? '#2E7D4F' : 'var(--color-text-light)';
            }

            if (reviewItemsList) {
                reviewItemsList.innerHTML = bagItems.map(item => `
                    <div class="review-item-row">
                        <div class="review-item-left">
                            <img src="${getImgPrefix()}${escapeHtml(item.img)}" alt="${escapeHtml(item.name)}" class="review-item-thumb">
                            <div>
                                <div class="review-item-name">${escapeHtml(item.name)}</div>
                                <div class="review-item-meta">${escapeHtml(item.brand)} &bull; ${escapeHtml(item.size)} &bull; Qty ${item.qty}</div>
                            </div>
                        </div>
                        <span class="review-item-price">${formatCurrency(item.price * item.qty)}</span>
                    </div>
                `).join('');
            }
        };

        // Form Submissions & Back/Edit Buttons
        if (shippingForm) {
            shippingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (validateShippingStep()) {
                    goToStep(2);
                }
            });
        }

        if (paymentForm) {
            paymentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (validatePaymentStep()) {
                    goToStep(3);
                }
            });
        }

        if (backToShippingBtn) {
            backToShippingBtn.addEventListener('click', () => goToStep(1));
        }

        if (backToPaymentBtn) {
            backToPaymentBtn.addEventListener('click', () => goToStep(2));
        }

        document.querySelectorAll('.btn-edit-step').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetStep = parseInt(btn.getAttribute('data-goto-step'), 10);
                if (targetStep) goToStep(targetStep);
            });
        });

        document.querySelectorAll('.stepper-btn[data-step-target]').forEach(btn => {
            btn.addEventListener('click', () => {
                if (checkoutState.orderCompleted) return;
                const target = parseInt(btn.getAttribute('data-step-target'), 10);
                if (target === checkoutState.currentStep) return;
                if (target < checkoutState.currentStep) {
                    goToStep(target);
                } else if (target === 2 && validateShippingStep()) {
                    goToStep(2);
                } else if (target === 3 && validateShippingStep() && validatePaymentStep()) {
                    goToStep(3);
                }
            });
        });

        // Final Order Confirmation -> Thank You Message
        if (confirmOrderBtn) {
            confirmOrderBtn.addEventListener('click', () => {
                clearAllErrors();
                if (bagItems.length === 0) {
                    setFieldError('confirmTerms', 'Your bag is empty. Please add a fragrance before confirming.');
                    return;
                }
                if (confirmTerms && !confirmTerms.checked) {
                    setFieldError('confirmTerms', 'Please confirm your order details to proceed.');
                    return;
                }

                const totals = computeTotals();
                const s = checkoutState.shipping;
                const payInfo = getPaymentDisplayDetails();
                const orderNum = `#OMN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
                const formattedDate = new Date().toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                });

                const setText = (id, val) => {
                    const el = document.getElementById(id);
                    if (el) el.textContent = val;
                };

                setText('tyCustomerName', s.fullName || 'Valued Guest');
                setText('tyCustomerEmail', s.emailAddress || 'your inbox');
                setText('tyOrderNumber', orderNum);
                setText('tyOrderDate', formattedDate);
                setText('tyEstDelivery', checkoutState.deliveryTier === 'express' ? '1–2 Business Days' : '3–5 Business Days');
                setText('tyPaymentMethod', payInfo.title);
                setText('tyRecipientName', s.fullName);

                const aptPart = s.apartment ? `, ${s.apartment}` : '';
                setText('tyShippingAddress', `${s.streetAddress}${aptPart}, ${s.city}, ${s.province} ${s.postalCode}`);
                setText('tyRecipientPhone', `${s.phoneNumber} • ${s.emailAddress}`);

                const tyGiftNote = document.getElementById('tyGiftNote');
                if (tyGiftNote) {
                    if (s.giftNote) {
                        tyGiftNote.textContent = `Gift Card: "${s.giftNote}"`;
                        tyGiftNote.style.display = 'block';
                    } else {
                        tyGiftNote.style.display = 'none';
                    }
                }

                const tyItemsList = document.getElementById('tyItemsList');
                if (tyItemsList) {
                    tyItemsList.innerHTML = bagItems.map(item => `
                        <div class="ty-item-row">
                            <span>${escapeHtml(item.name)} (${escapeHtml(item.size)}) &times; ${item.qty}</span>
                            <strong>${formatCurrency(item.price * item.qty)}</strong>
                        </div>
                    `).join('');
                }

                setText('tySubtotal', formatCurrency(totals.subtotal));
                setText('tyShipping', totals.shippingCost === 0 ? 'Free' : formatCurrency(totals.shippingCost));

                const tyDiscountRow = document.getElementById('tyDiscountRow');
                if (tyDiscountRow) {
                    if (checkoutState.voucherCode && totals.discountAmount > 0 && checkoutState.voucherCode !== 'FREESHIP') {
                        setText('tyVoucherCode', checkoutState.voucherCode);
                        setText('tyDiscount', `-${formatCurrency(totals.discountAmount)}`);
                        tyDiscountRow.style.display = 'flex';
                    } else {
                        tyDiscountRow.style.display = 'none';
                    }
                }

                setText('tyTotalLabel', checkoutState.paymentMethod === 'cod' ? 'Cash Due on Delivery' : 'Total Paid');
                setText('tyTotal', formatCurrency(totals.total));

                checkoutState.orderCompleted = true;
                bagItems = [];
                writeCartItems([]);
                goToStep(4);
            });
        }

        if (printOrderBtn) {
            printOrderBtn.addEventListener('click', () => window.print());
        }

        // Initial Render
        renderOrderSummary();
    }

    console.log('✨ Omniscent luxury scripts successfully initialized.');
});
