/* ============================================================
   NAVIGATION — nav.js
   ============================================================ */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const nav     = document.getElementById('main-nav');
    const menuBtn = document.getElementById('menu-toggle');
    const drawer  = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('drawer-overlay');
    const links   = document.querySelectorAll('.nav-link');

    if (!nav) return;

    /* ── Scroll: transparent → frosted ── */
    const onScroll = () => {
      if (window.scrollY > 60) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ── Active link — highlight current page ── */
    const rawPage = window.location.pathname.split('/').pop() || 'index.html';
    // Normalise: strip .html so "about.html" and "about" both become "about"
    const page = rawPage.replace(/\.html$/, '') || 'index';
    links.forEach(link => {
      const href = (link.getAttribute('href') || '').replace(/\.html$/, '') || 'index';
      if (href === page) {
        link.classList.add('active');
      }
    });

    /* ── Mobile menu ── */
    const openMenu = () => {
      drawer.classList.add('open');
      overlay.classList.add('visible');
      menuBtn.classList.add('open');
      menuBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      drawer.classList.remove('open');
      overlay.classList.remove('visible');
      menuBtn.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    if (menuBtn) {
      menuBtn.addEventListener('click', () => {
        menuBtn.classList.contains('open') ? closeMenu() : openMenu();
      });
    }

    if (overlay) {
      overlay.addEventListener('click', closeMenu);
    }

    /* Close on drawer link click */
    if (drawer) {
      drawer.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', closeMenu);
      });
    }

    /* Close on Escape */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  });
})();
