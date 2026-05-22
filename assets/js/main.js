// Khrysmar — minimal vanilla JS for nav + reveals + active link

(function () {
  const header = document.querySelector('.site-header');
  const transparentStart = header && header.classList.contains('transparent');

  // Sticky header state
  function onScroll() {
    if (!header) return;
    const scrolled = window.scrollY > 24;
    if (transparentStart) {
      header.classList.toggle('transparent', !scrolled);
      header.classList.toggle('solid', scrolled);
    } else {
      header.classList.add('solid');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile + home overlay nav
  const toggle = document.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = document.body.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('.nav a, .home-nav a').forEach(a =>
      a.addEventListener('click', () => {
        document.body.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
      })
    );
    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
        document.body.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Active nav link based on path
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav a, .home-nav a').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // Reveal on scroll
  const io = ('IntersectionObserver' in window) ? new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 }) : null;

  document.querySelectorAll('.reveal').forEach(el => {
    if (io) io.observe(el);
    else el.classList.add('in');
  });

  // Year in footer
  const y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();

  // Concerts year filter: chip click filters .year-group blocks by data-year.
  const yearFilter = document.querySelector('.year-filter');
  if (yearFilter) {
    yearFilter.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      const filter = chip.dataset.filter;
      yearFilter.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c === chip));
      document.querySelectorAll('.year-group').forEach(g => {
        g.style.display = (filter === 'all' || g.dataset.year === filter) ? '' : 'none';
      });
    });
  }

  // Share button: native Web Share when available, clipboard fallback.
  const shareBtn = document.querySelector('.share-button');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const data = {
        title: document.title,
        text: 'Khrysmar Music Studio — piano lessons in the GTA',
        url: window.location.href,
      };
      try {
        if (navigator.share) {
          await navigator.share(data);
        } else if (navigator.clipboard) {
          await navigator.clipboard.writeText(data.url);
          shareBtn.setAttribute('aria-label', 'Link copied');
          setTimeout(() => shareBtn.setAttribute('aria-label', 'Share this studio'), 1500);
        }
      } catch (_) { /* user cancelled or unsupported */ }
    });
  }
})();
