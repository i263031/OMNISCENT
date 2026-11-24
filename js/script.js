/**
 * ==========================================================================
 * OMNISCENT - LUXURY PERFUME WEBSITE
 * Script: js/script.js
 * Language: JavaScript (ECMAScript 6+)
 * Description: Client-side interactive logic for Omniscent homepage.
 *              Includes shopping cart handling, hero carousel, sticky header,
 *              search modal, mobile navigation, newsletter validation, and UI micro-interactions.
 * ==========================================================================
 */

// Execute logic when the DOM is fully loaded and parsed
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /* ==========================================================================
       MODULE 1: HEADER SCROLL BEHAVIOR
       Adds backdrop blur and background color when user scrolls down.
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
       Handles adding items, animating cart badge, and displaying luxury toast.
       ========================================================================== */
    let cartItemCount = 0;
    const cartCountElement = document.getElementById('cartCount');
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    const cartToast = document.getElementById('cartToast');
    const toastProductName = document.getElementById('toastProductName');
    let toastTimeout = null;

    /**
     * Show elegant toast notification when an item is added
     * @param {string} productName 
     */
    const showCartToast = (productName) => {
        if (!cartToast) return;

        if (toastProductName) {
            toastProductName.textContent = productName;
        }

        cartToast.classList.add('active');

        // Clear any previous timeout
        if (toastTimeout) {
            clearTimeout(toastTimeout);
        }

        // Automatically hide toast after 3.5 seconds
        toastTimeout = setTimeout(() => {
            cartToast.classList.remove('active');
        }, 3500);
    };

    /**
     * Increment cart count and trigger bounce animation
     */
    const updateCartCount = () => {
        cartItemCount++;
        if (cartCountElement) {
            cartCountElement.textContent = cartItemCount;
            cartCountElement.classList.remove('bounce');
            // Trigger reflow to restart CSS animation
            void cartCountElement.offsetWidth;
            cartCountElement.classList.add('bounce');
        }
    };

    // Attach event listeners to all Add-to-Cart buttons
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const productCard = button.closest('.product-card');
            const productName = productCard ? productCard.querySelector('.product-name').textContent : 'Perfume';

            // Visual feedback on button
            const originalHTML = button.innerHTML;
            button.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            `;
            button.style.backgroundColor = 'var(--color-accent-rose)';
            button.style.color = '#FFFFFF';

            // Revert button after 1.2s
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.style.backgroundColor = '';
                button.style.color = '';
            }, 1200);

            // Update badge and toast
            updateCartCount();
            showCartToast(productName);
        });
    });


    /* ==========================================================================
       MODULE 3: HERO CAROUSEL CONTROLS
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

    // Determine correct relative image path prefix (supports root index.html and Pages/ directory)
    const getImgPrefix = () => {
        if (heroImgElement && heroImgElement.getAttribute('src') && heroImgElement.getAttribute('src').startsWith('../')) {
            return '../images/';
        }
        return 'images/';
    };

    /**
     * Render the active slide data and hero image with elegant crossfade
     * @param {number} index 
     */
    const renderSlide = (index) => {
        const slide = heroSlidesData[index];
        if (!slide) return;

        // Animate counter display (e.g. 01, 02, etc.)
        if (currentSlideElement) {
            currentSlideElement.textContent = String(index + 1).padStart(2, '0');
        }

        // Smooth text transition
        const elementsToFade = [heroTaglineElement, heroTitleElement, heroDescElement].filter(Boolean);
        elementsToFade.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(6px)';
            el.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        });

        // Smooth hero image crossfade transition
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
                
                // Remove fade-out class once new image loads
                heroImgElement.onload = () => {
                    heroImgElement.classList.remove('fade-out');
                };
                // Fallback timeout in case image is already cached
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

    // ESC key closes search modal
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchModal && searchModal.classList.contains('active')) {
            closeSearchModal();
        }
    });

    // Quick tag clicks populate search input
    quickTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const query = tag.getAttribute('data-query');
            if (searchField && query) {
                searchField.value = query;
                searchField.focus();
            }
        });
    });


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

            // Success feedback
            if (newsletterFeedback) {
                newsletterFeedback.textContent = '✓ Thank you for subscribing! Check your inbox for exclusive offers.';
                newsletterFeedback.style.color = '#81C995';
                newsletterFeedback.style.display = 'block';
            }

            if (newsletterInput) {
                newsletterInput.value = '';
                newsletterInput.placeholder = 'Subscribed successfully!';
            }

            // Hide message after 5 seconds
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
    const mobileDrawer = document.getElementById('mobileDrawer');

    if (navToggle && mobileDrawer) {
        navToggle.addEventListener('click', () => {
            const isOpen = mobileDrawer.classList.contains('open');
            navToggle.setAttribute('aria-expanded', !isOpen);
            mobileDrawer.classList.toggle('open');
        });

        // Close drawer when clicking mobile links
        mobileDrawer.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileDrawer.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    console.log('✨ Omniscent scripts successfully initialized.');
});
