/**
 * ==========================================================================
 * OMNISCENT — Page 09: Gift Sets & Discovery Kits (Hero Interactions)
 * Script: js/gift-sets.js
 * Provides sticky header state, mobile drawer toggle, and smooth scrolling
 * from the "Explore Collection" button to #exclusive-collection.
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
});
