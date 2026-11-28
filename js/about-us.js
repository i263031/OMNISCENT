/**
 * ==========================================================================
 * OMNISCENT — Page 10: About Us / Our Heritage
 * File: js/about-us.js
 *
 * Handles:
 *   1. Sticky header scroll state (.scrolled class)
 *   2. Mobile navigation drawer toggle
 *   3. Smooth scroll from "Discover Our Heritage" CTA → #ourHeritage
 *   4. Newsletter form validation & feedback
 *   5. Search button fallback (redirects to shop when modal absent)
 *   6. Scroll-reveal animation for heritage cards
 *
 * Safe to load alongside js/script.js — guards against double-binding.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // -------------------------------------------------------------------------
    // 1. STICKY HEADER — adds .scrolled class when user scrolls past 40px
    // -------------------------------------------------------------------------
    const siteHeader = document.getElementById('siteHeader');
    if (siteHeader) {
        const updateHeaderScroll = () => {
            siteHeader.classList.toggle('scrolled', window.scrollY > 40);
        };
        window.addEventListener('scroll', updateHeaderScroll, { passive: true });
        updateHeaderScroll(); // run on load
    }

    // -------------------------------------------------------------------------
    // 2. MOBILE NAVIGATION DRAWER TOGGLE
    //    Guard with dataset flag to avoid double-binding when script.js is also loaded.
    // -------------------------------------------------------------------------
    const navToggle = document.getElementById('navToggle');
    const mobileNav = document.getElementById('mobileNav');

    if (navToggle && mobileNav && !navToggle.dataset.aboutNavBound) {
        navToggle.dataset.aboutNavBound = 'true';

        navToggle.addEventListener('click', () => {
            const isOpen = mobileNav.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', String(isOpen));
            mobileNav.setAttribute('aria-hidden', String(!isOpen));
        });

        // Close drawer when any mobile link is clicked
        mobileNav.querySelectorAll('.mobile-nav-link').forEach((link) => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                mobileNav.setAttribute('aria-hidden', 'true');
            });
        });
    }

    // -------------------------------------------------------------------------
    // 3. SMOOTH SCROLL — "Discover Our Heritage" CTA → #ourHeritage
    // -------------------------------------------------------------------------
    const heritageCta = document.getElementById('discoverHeritagBtn');
    const heritageTarget = document.getElementById('ourHeritage');

    if (heritageCta && heritageTarget) {
        heritageCta.addEventListener('click', (e) => {
            e.preventDefault();
            heritageTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // -------------------------------------------------------------------------
    // 4. NEWSLETTER FORM — inline validation & success feedback
    // -------------------------------------------------------------------------
    const newsletterForm     = document.getElementById('newsletterForm');
    const newsletterFeedback = document.getElementById('newsletterFeedback');
    const newsletterEmail    = document.getElementById('newsletterEmail');

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

    // -------------------------------------------------------------------------
    // 5. SEARCH BUTTON FALLBACK
    //    If the shared search modal is absent (script.js not loaded), redirect.
    // -------------------------------------------------------------------------
    const searchBtn   = document.getElementById('searchBtn');
    const searchModal = document.getElementById('searchModal');

    if (searchBtn && !searchModal) {
        searchBtn.addEventListener('click', () => {
            window.location.href = '02.  shop.html';
        });
    }

    // -------------------------------------------------------------------------
    // 6. SCROLL-REVEAL ANIMATION for heritage cards
    //    Uses IntersectionObserver for a subtle fade-up entrance.
    // -------------------------------------------------------------------------
    const revealTargets = document.querySelectorAll(
        '.heritage-card, .about-hero-content, .about-hero-visual, .heritage-header, .heritage-body'
    );

    if ('IntersectionObserver' in window && revealTargets.length) {
        // Set initial hidden state via inline style (avoids FOUC if CSS not loaded)
        revealTargets.forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(24px)';
            el.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
        });

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealTargets.forEach((el) => revealObserver.observe(el));
    }

});
