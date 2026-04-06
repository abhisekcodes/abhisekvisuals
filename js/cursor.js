/* ============================================================
   CUSTOM CURSOR — cursor.js
   ============================================================ */

(function () {
  'use strict';

  /* Skip on touch/mobile devices */
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.addEventListener('DOMContentLoaded', () => {
    const dot  = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let mx = -100, my = -100;   /* mouse */
    let rx = -100, ry = -100;   /* ring (lagging) */
    let raf;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
    });

    /* Lerp ring toward mouse */
    const lerp = (a, b, t) => a + (b - a) * t;

    const tick = () => {
      rx = lerp(rx, mx, 0.12);
      ry = lerp(ry, my, 0.12);
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(tick);
    };
    tick();

    /* Grow on interactive elements */
    const growTargets = 'a, button, [data-cursor-grow], label, input, textarea';
    document.querySelectorAll(growTargets).forEach(addGrow);

    const observer = new MutationObserver(() => {
      document.querySelectorAll(growTargets).forEach(el => {
        if (!el._cursorGrow) addGrow(el);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    function addGrow(el) {
      el._cursorGrow = true;
      el.addEventListener('mouseenter', () => {
        dot.classList.add('cursor--grow');
        ring.classList.add('cursor--grow');
      });
      el.addEventListener('mouseleave', () => {
        dot.classList.remove('cursor--grow');
        ring.classList.remove('cursor--grow');
      });
    }

    /* Hide default cursor */
    document.documentElement.style.cursor = 'none';

    /* Show on leave / hide on enter window */
    document.addEventListener('mouseleave', () => {
      dot.style.opacity  = '0';
      ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      dot.style.opacity  = '1';
      ring.style.opacity = '1';
    });
  });
})();
