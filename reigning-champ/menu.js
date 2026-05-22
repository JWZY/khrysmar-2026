/* StoreMenu controller.
   Mirrors features/store/components/StoreMenu/StoreMenu.tsx behaviour:
     - open / close (with body scroll lock + Esc + scrim click)
     - subpage navigation with push/pop animations
     - back button morphs the close-X into a back-arrow when on a subpage
     - follow toggle
*/
(() => {
  const sheet = document.getElementById('store-menu');
  if (!sheet) return;

  const panel       = sheet.querySelector('.sheet-panel');
  const closeBtn    = sheet.querySelector('.sheet-close');
  const followBtn   = sheet.querySelector('[data-follow-toggle]');
  const heroFollow  = document.querySelector('.follow-btn');
  const pages       = sheet.querySelectorAll('.sheet-page');
  const mainPage    = sheet.querySelector('[data-page="main"]');

  let activePage = 'main';
  let lastScrollY = 0;

  // ---- open / close --------------------------------------------------------

  function open() {
    if (sheet.getAttribute('aria-hidden') === 'false') return;
    lastScrollY = window.scrollY;
    document.body.classList.add('sheet-locked');
    sheet.setAttribute('aria-hidden', 'false');
    // Reset to main page on every open.
    showPage('main', 'fade');
  }

  function close() {
    if (sheet.getAttribute('aria-hidden') !== 'false') return;
    sheet.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('sheet-locked');
    // Reset subpage state after the slide-out completes.
    setTimeout(() => showPage('main', null), 300);
  }

  // ---- subpage navigation --------------------------------------------------

  function showPage(pageName, animation) {
    activePage = pageName;
    pages.forEach(p => {
      const match = p.dataset.page === pageName;
      p.hidden = !match;
      if (match && animation) {
        p.dataset.anim = animation;
        // Restart the animation by reflowing.
        // eslint-disable-next-line no-unused-expressions
        p.offsetHeight;
      } else {
        delete p.dataset.anim;
      }
    });
    // Morph close button into back arrow on subpages.
    closeBtn.dataset.state = pageName === 'main' ? 'close' : 'back';
    closeBtn.setAttribute(
      'aria-label',
      pageName === 'main' ? 'Close menu' : 'Back'
    );
    // Reset scroll on page change.
    const body = sheet.querySelector('.sheet-body');
    if (body) body.scrollTop = 0;
  }

  function navigateTo(pageName) { showPage(pageName, 'push'); }
  function navigateBack()        { showPage('main', 'pop'); }

  // ---- wire up -------------------------------------------------------------

  document.querySelectorAll('[data-menu-open]').forEach(el => {
    el.addEventListener('click', open);
  });

  // Close button: also handles back when on subpage.
  closeBtn.addEventListener('click', () => {
    if (activePage === 'main') close();
    else navigateBack();
  });

  document.querySelectorAll('[data-menu-close]').forEach(el => {
    if (el === closeBtn) return;
    el.addEventListener('click', close);
  });

  document.querySelectorAll('[data-nav-to]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(el.dataset.navTo);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (sheet.getAttribute('aria-hidden') === 'true') return;
    if (activePage !== 'main') navigateBack();
    else close();
  });

  // ---- follow toggle (in-sheet button + hero button stay in sync) ----------

  let isFollowing = false;
  function setFollowing(next) {
    isFollowing = next;
    [followBtn, heroFollow].forEach(b => {
      if (!b) return;
      b.dataset.following = String(isFollowing);
      const label = isFollowing ? 'Following' : 'Follow';
      const span  = b.querySelector('span');
      if (span) span.textContent = label;
      else b.textContent = label;
    });
  }
  if (followBtn)  followBtn.addEventListener('click', () => setFollowing(!isFollowing));
  if (heroFollow) heroFollow.addEventListener('click', () => setFollowing(!isFollowing));
})();
