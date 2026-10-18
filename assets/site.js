(() => {
  'use strict';

  // Old shared previews keep their page/hash, but always use Living Canvas.
  const url = new URL(window.location.href);
  if (url.searchParams.has('stijl')) {
    url.searchParams.delete('stijl');
    window.history.replaceState(null, '', url.pathname + url.search + url.hash);
  }

  const header = document.querySelector('.sn-header');
  if (!header) return;
  const button = header.querySelector('.sn-menu-toggle');
  const nav = header.querySelector('.sn-navigation');
  button.hidden = false;
  header.setAttribute('data-menu-ready', '');

  function setMenu(open, returnFocus = false) {
    header.toggleAttribute('data-menu-open', open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
    button.querySelector('span').textContent = open ? '×' : '＋';
    if (returnFocus) button.focus();
  }

  button.addEventListener('click', () => {
    setMenu(button.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', event => {
    if (event.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && header.hasAttribute('data-menu-open')) {
      setMenu(false, true);
    }
  });
  document.addEventListener('pointerdown', event => {
    if (!header.contains(event.target)) setMenu(false);
  });
  header.addEventListener('focusout', event => {
    if (!header.contains(event.relatedTarget)) setMenu(false);
  });
  window.matchMedia('(max-width: 1100px)').addEventListener('change', () => setMenu(false));

  const filename = window.location.pathname.split('/').pop();
  let page = url.searchParams.get('pagina') || '';
  if (filename === 'weddingschecklist.html') page = 'checklist';
  if (filename.startsWith('pagina-reportage-') || ['kasteel', 'dengh', 'bordeaux', 'malaga'].includes(page)) {
    page = 'reportages';
  }
  if (filename === 'preview-pagina.html' && !page) page = 'reportages';
  for (const link of nav.querySelectorAll('[data-page]')) {
    if (link.dataset.page === page) link.setAttribute('aria-current', 'page');
  }
})();
