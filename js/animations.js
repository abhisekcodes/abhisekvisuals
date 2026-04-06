/* ============================================================
   ANIMATIONS — animations.js
   (Requires GSAP + ScrollTrigger loaded via CDN)
   ============================================================ */

/* Safety: make sure page transition overlay starts hidden */
(function(){
  const ov = document.getElementById('page-transition');
  if (ov) ov.style.transform = 'translateY(-100%)';
})();

document.addEventListener('DOMContentLoaded', () => {

  /* ── Smooth scroll: native (Lenis removed for performance) ── */
  document.documentElement.style.scrollBehavior = 'smooth';

  /* ── GSAP Defaults ── */
  if (typeof gsap === 'undefined') {
    /* Fallback: use IntersectionObserver for reveal */
    setupFallbackReveal();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const ease = 'power3.out';

  /* ── Reveal elements with [data-reveal] ── */
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    const dir = el.dataset.reveal || 'up';
    const from = {
      up:    { opacity: 0, y: 50 },
      down:  { opacity: 0, y: -30 },
      left:  { opacity: 0, x: -50 },
      right: { opacity: 0, x: 50 },
      scale: { opacity: 0, scale: 0.88 },
      fade:  { opacity: 0 },
    }[dir] || { opacity: 0, y: 50 };

    const delay = parseFloat(el.dataset.delay || 0);

    gsap.fromTo(el,
      { ...from },
      {
        opacity: 1, y: 0, x: 0, scale: 1,
        duration: 0.85,
        ease,
        delay,
        immediateRender: false,
        scrollTrigger: {
          trigger: el,
          start: 'top 92%',
          toggleActions: 'play none none none',
          once: true,
          onEnter: () => { el.style.opacity = ''; el.style.transform = ''; },
        },
      }
    );
  });

  /* Safety net — after 2.5s reveal anything still invisible */
  setTimeout(() => {
    document.querySelectorAll('[data-reveal], [data-stagger] > *').forEach(el => {
      if (parseFloat(getComputedStyle(el).opacity) < 0.1) {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      }
    });
  }, 2500);

  /* ── Stagger children with [data-stagger] on parent ── */
  gsap.utils.toArray('[data-stagger]').forEach((parent) => {
    const children = parent.querySelectorAll(':scope > *');
    gsap.fromTo(children,
      { opacity: 0, y: 35 },
      {
        opacity: 1, y: 0,
        duration: 0.7,
        ease,
        stagger: parseFloat(parent.dataset.stagger || 0.1),
        immediateRender: false,
        scrollTrigger: {
          trigger: parent,
          start: 'top 92%',
          toggleActions: 'play none none none',
          once: true,
        },
      }
    );
  });

  /* ── Parallax elements [data-parallax] ── */
  gsap.utils.toArray('[data-parallax]').forEach((el) => {
    const depth = parseFloat(el.dataset.parallax || 0.3);
    gsap.to(el, {
      yPercent: -30 * depth,
      ease: 'none',
      scrollTrigger: {
        trigger: el.closest('section') || el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  });

  /* ── Animated counters ── */
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        let obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = Math.round(obj.val) + suffix;
          },
        });
      },
    });
  });

  /* ── Progress bars [data-progress] ── */
  document.querySelectorAll('[data-progress]').forEach((bar) => {
    const target = bar.dataset.progress;
    ScrollTrigger.create({
      trigger: bar,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(bar, {
          width: target + '%',
          duration: 1.2,
          ease: 'power2.out',
          delay: parseFloat(bar.dataset.delay || 0),
        });
      },
    });
  });

  /* ── Text split reveal (words) ── */
  document.querySelectorAll('[data-text-reveal]').forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words
      .map(w => `<span class="word-wrap"><span class="word">${w}</span></span>`)
      .join(' ');

    gsap.from(el.querySelectorAll('.word'), {
      y: '110%',
      opacity: 0,
      duration: 0.8,
      ease,
      stagger: 0.06,
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  });

  /* ── Horizontal scroll section ── */
  const hSection = document.querySelector('.horizontal-scroll');
  if (hSection) {
    const hTrack = hSection.querySelector('.horizontal-track');
    if (hTrack) {
      gsap.to(hTrack, {
        x: () => -(hTrack.scrollWidth - window.innerWidth) + 'px',
        ease: 'none',
        scrollTrigger: {
          trigger: hSection,
          pin: true,
          scrub: 1,
          end: () => '+=' + hTrack.scrollWidth,
          invalidateOnRefresh: true,
        },
      });
    }
  }

  /* ── Page transition overlay ── */
  setupPageTransitions();

  /* ────── Fallback (no GSAP) ────── */
  function setupFallbackReveal() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('[data-reveal]').forEach(el => {
      el.classList.add('reveal');
      io.observe(el);
    });
  }

  function setupPageTransitions() {
    const overlay = document.getElementById('page-transition');
    if (!overlay) return;

    /* Overlay starts hidden via CSS transform, no need to animate on load */

    /* On link click: slide in */
    document.querySelectorAll('a[href]').forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto') ||
          href.startsWith('http') || link.target === '_blank') return;

      link.addEventListener('click', (e) => {
        e.preventDefault();
        gsap.to(overlay, {
          yPercent: 0,
          duration: 0.6,
          ease: 'power3.inOut',
          onComplete: () => window.location.assign(href),
        });
      });
    });
  }

});
