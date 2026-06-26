function init() {
  const article = document.getElementById('article');
  const bar = document.getElementById('progress-bar');
  const nav = document.getElementById('page-nav');
  const nextLink = document.getElementById('next-link');
  const hint = document.getElementById('bottom-hint');
  const toggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');

  if (!article || !nav) return;

  const prevSlug = nav.dataset.prev || '';
  const nextSlug = nav.dataset.next || '';
  let atBottom = false;

  function go(slug: string) {
    if (!slug) return;
    window.location.href = `/${slug}`;
  }

  function update() {
    const h = article!.scrollHeight - article!.clientHeight;
    const ratio = h > 0 ? article!.scrollTop / h : 0;
    if (bar) bar.style.width = `${Math.min(100, ratio * 100)}%`;
    const bottom = article!.scrollTop + article!.clientHeight >= article!.scrollHeight - 4;
    if (bottom !== atBottom) {
      atBottom = bottom;
      if (atBottom) {
        nextLink?.classList.add('ready');
        hint?.removeAttribute('hidden');
      } else {
        nextLink?.classList.remove('ready');
        hint?.setAttribute('hidden', '');
      }
    }
  }

  article.addEventListener('scroll', update, { passive: true });
  update();

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(nextSlug); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(prevSlug); }
    else if (e.key === 'Home') { e.preventDefault(); window.location.href = '/01-overview'; }
    else if (e.key === 'End') { e.preventDefault(); window.location.href = '/12-sigma-ledger'; }
    else if (e.key === 'Escape') { sidebar?.classList.remove('open'); }
  });

  let touchX = 0;
  let touchY = 0;
  document.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    touchX = t.clientX; touchY = t.clientY;
  }, { passive: true });
  document.addEventListener('touchend', (e) => {
    const t = e.changedTouches[0];
    const dx = t.clientX - touchX;
    const dy = t.clientY - touchY;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) go(nextSlug); else go(prevSlug);
    }
  }, { passive: true });

  toggle?.addEventListener('click', () => sidebar?.classList.toggle('open'));
}

document.addEventListener('astro:page-load', init);
