/* ============================================================
   THEME TOGGLE — theme.js
   ============================================================ */

(function () {
  'use strict';

  const STORAGE_KEY = 'av-theme';
  const html = document.documentElement;

  /* ── Apply saved theme immediately (before paint) ── */
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light') {
    html.setAttribute('data-theme', 'light');
  }

  /* ── Wait for DOM ── */
  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    const isDark = () => html.getAttribute('data-theme') !== 'light';

    const setTheme = (light) => {
      /* Create ripple overlay for transition */
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed; inset: 0; z-index: 99999;
        pointer-events: none;
        background: ${light ? '#f4f4fd' : '#07070f'};
        opacity: 0;
        transition: opacity 350ms ease;
      `;
      document.body.appendChild(overlay);

      /* Fade in */
      requestAnimationFrame(() => {
        overlay.style.opacity = '0.6';
        setTimeout(() => {
          if (light) {
            html.setAttribute('data-theme', 'light');
            localStorage.setItem(STORAGE_KEY, 'light');
          } else {
            html.removeAttribute('data-theme');
            localStorage.setItem(STORAGE_KEY, 'dark');
          }
          updateIcon(!light);
          /* Fade out */
          overlay.style.opacity = '0';
          setTimeout(() => overlay.remove(), 400);
        }, 200);
      });
    };

    const updateIcon = (dark) => {
      const sunIcon  = toggle.querySelector('.icon-sun');
      const moonIcon = toggle.querySelector('.icon-moon');
      if (!sunIcon || !moonIcon) return;

      if (dark) {
        sunIcon.style.opacity  = '0';
        sunIcon.style.transform = 'rotate(90deg) scale(0)';
        moonIcon.style.opacity  = '1';
        moonIcon.style.transform = 'rotate(0deg) scale(1)';
      } else {
        moonIcon.style.opacity  = '0';
        moonIcon.style.transform = 'rotate(-90deg) scale(0)';
        sunIcon.style.opacity   = '1';
        sunIcon.style.transform = 'rotate(0deg) scale(1)';
      }
    };

    /* ── Init icon state ── */
    updateIcon(isDark());

    /* ── Click handler ── */
    toggle.addEventListener('click', () => {
      setTheme(isDark()); /* toggle to opposite */
    });
  });
})();
