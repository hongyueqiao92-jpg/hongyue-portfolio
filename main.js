(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  // Base HTML is visible. Only offscreen elements are opted into scroll animation.
  const reveals = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window && !reduced.matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('is-waiting');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.05 });
    reveals.forEach(el => {
      if (el.getBoundingClientRect().top > innerHeight) el.classList.add('is-waiting');
      observer.observe(el);
    });
    reduced.addEventListener('change', () => {
      if (reduced.matches) {
        reveals.forEach(el => el.classList.remove('is-waiting'));
        observer.disconnect();
      }
    });
  }
  const work = document.querySelector('#work');
  const about = document.querySelector('#about');
  const links = [...document.querySelectorAll('[data-nav]')];
  let ticking = false;
  function updateNav() {
    const marker = innerHeight * 0.4;
    const current = about.getBoundingClientRect().top <= marker ? 'about' : work.getBoundingClientRect().top <= marker ? 'work' : '';
    links.forEach(link => current === link.dataset.nav ? link.setAttribute('aria-current', 'location') : link.removeAttribute('aria-current'));
    ticking = false;
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(updateNav); } }, { passive: true });
  addEventListener('resize', updateNav);
  updateNav();
  document.querySelectorAll('details').forEach(details => {
    const summary = details.querySelector('summary');
    const body = details.querySelector('.summary-body');
    let animation;
    let target = details.open;
    summary.addEventListener('click', event => {
      if (!body.animate || reduced.matches) return;
      event.preventDefault();
      const height = details.open ? body.getBoundingClientRect().height : 0;
      if (animation) animation.cancel();
      target = !target;
      details.open = true;
      animation = body.animate([
        { height: `${height}px`, opacity: height ? 1 : 0 },
        { height: `${target ? body.scrollHeight : 0}px`, opacity: target ? 1 : 0 }
      ], { duration: target ? 280 : 200, easing: 'ease-out' });
      animation.onfinish = () => { details.open = target; animation = null; };
    });
    details.addEventListener('toggle', () => { if (!animation) target = details.open; });
    reduced.addEventListener('change', () => { if (animation && reduced.matches) { animation.cancel(); animation = null; details.open = target; } });
  });
})();
