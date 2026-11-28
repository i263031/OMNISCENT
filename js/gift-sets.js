/**
 * ==========================================================================
 * OMNISCENT — Page 09: Gift Sets & Discovery Kits
 * Script: js/gift-sets.js
 * Handles: sticky header, mobile drawer, smooth scroll, Add to Bag toast,
 *          newsletter form validation.
 * Safe to run standalone or alongside js/script.js.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // 1. Sticky Header Scroll Effect (if not already bound by script.js)
    const siteHeader = document.getElementById('siteHeader');
    if (siteHeader) {
        const updateHeaderScroll = () => {
            siteHeader.classList.toggle('scrolled', window.scrollY > 40);
        };
        window.addEventListener('scroll', updateHeaderScroll, { passive: true });
        updateHeaderScroll();
    }

    // 2. Mobile Navigation Drawer Toggle (guards against duplicate binding)
    const navToggle = document.getElementById('navToggle');
    const mobileNav = document.getElementById('mobileNav');
    if (navToggle && mobileNav && !navToggle.dataset.giftNavBound) {
        navToggle.dataset.giftNavBound = 'true';
        navToggle.addEventListener('click', () => {
            const isOpen = mobileNav.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', String(isOpen));
            mobileNav.setAttribute('aria-hidden', String(!isOpen));
        });

        mobileNav.querySelectorAll('.mobile-nav-link').forEach((link) => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                mobileNav.setAttribute('aria-hidden', 'true');
            });
        });
    }

    // 3. Smooth Scroll for "Explore Collection" CTA -> #exclusive-collection
    const exploreBtn = document.getElementById('exploreCollectionBtn');
    const exclusiveTarget = document.getElementById('exclusive-collection');
    if (exploreBtn && exclusiveTarget) {
        exploreBtn.addEventListener('click', (event) => {
            event.preventDefault();
            exclusiveTarget.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }

    // 4. Search Button Fallback (redirects to Shop All when search modal is absent)
    const searchBtn = document.getElementById('searchBtn');
    const searchModal = document.getElementById('searchModal');
    if (searchBtn && !searchModal) {
        searchBtn.addEventListener('click', () => {
            window.location.href = '02.  shop.html';
        });
    }

    // 5. Add to Bag — toast notification for product cards
    const addBagBtns = document.querySelectorAll('.btn-add-bag');
    addBagBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const product = btn.dataset.product || 'Item';

            // Try to reuse homepage toast if present
            const toastEl = document.getElementById('cartToast');
            const toastName = document.getElementById('toastProductName');
            if (toastEl && toastName) {
                toastName.textContent = product;
                toastEl.classList.add('visible');
                clearTimeout(toastEl._giftTimer);
                toastEl._giftTimer = setTimeout(() => toastEl.classList.remove('visible'), 3200);
                return;
            }

            // Fallback: inline banner toast (shown below the button)
            const existing = document.getElementById('giftToast');
            if (existing) existing.remove();
            const toast = document.createElement('div');
            toast.id = 'giftToast';
            toast.setAttribute('role', 'status');
            toast.setAttribute('aria-live', 'polite');
            toast.style.cssText = [
                'position:fixed', 'bottom:28px', 'left:50%',
                'transform:translateX(-50%)',
                'background:#1B1112', 'color:#F6ECE5',
                'font-family:\'Montserrat\',sans-serif', 'font-size:0.84rem',
                'padding:12px 28px', 'border-radius:9999px',
                'border:1px solid rgba(199,122,115,0.4)',
                'box-shadow:0 8px 32px rgba(0,0,0,0.28)',
                'z-index:9999', 'white-space:nowrap',
                'transition:opacity 0.3s ease'
            ].join(';');
            toast.textContent = `✓  ${product} added to your bag`;
            document.body.appendChild(toast);
            setTimeout(() => { toast.style.opacity = '0'; }, 2600);
            setTimeout(() => toast.remove(), 3000);
        });
    });

    // 6. Newsletter Form — inline validation & feedback
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterFeedback = document.getElementById('newsletterFeedback');
    const newsletterEmail = document.getElementById('newsletterEmail');
    if (newsletterForm && newsletterFeedback && newsletterEmail) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterEmail.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                newsletterFeedback.style.color = '#C77A73';
                newsletterFeedback.textContent = 'Please enter a valid email address.';
                return;
            }
            newsletterFeedback.style.color = '#8EB89A';
            newsletterFeedback.textContent = '✓  You\'re on the list! Exclusive offers coming your way.';
            newsletterEmail.value = '';
            setTimeout(() => { newsletterFeedback.textContent = ''; }, 5000);
        });
    }
});
