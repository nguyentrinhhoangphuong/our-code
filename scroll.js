document.addEventListener("DOMContentLoaded", function () {
  const slides = [...document.querySelectorAll('.slide-section')];
  if (!slides.length) return;

  let current = 0;
  let busy = false;
  const duration = 600; // ms

  const isMobile = () => window.innerWidth <= 990;

  // Lấy current theo hash nếu có
  if (location.hash) {
    const idx = slides.findIndex(s => '#' + s.id === location.hash);
    if (idx >= 0) current = idx;
  }

  // ===== Desktop settle =====
  function settle() {
    if (isMobile()) {
      // Mobile: reset transform để scroll tự nhiên
      slides.forEach((s) => {
        s.style.transform = '';
        s.style.zIndex = '';
        s.style.transition = '';
      });
      return;
    }

    // Desktop: slide effect
    slides.forEach((s, i) => {
      s.style.transition = 'none';
      if (i < current) s.style.transform = 'translateY(-100%)';
      else if (i > current) s.style.transform = 'translateY(100%)';
      else s.style.transform = 'translateY(0)';
      s.style.zIndex = (i === current ? 2 : 1);
    });
    slides.forEach(s => { void s.offsetHeight; s.style.transition = ''; });
    history.replaceState(null, '', '#' + slides[current].id);
  }

  // ===== Desktop go() =====
  function go(to) {
    if (busy || to < 0 || to >= slides.length || to === current) return;

    if (isMobile()) {
      // Mobile: scroll tự nhiên
      current = to;
      slides[to].scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    // Desktop slide
    busy = true;
    const dir = to > current ? 1 : -1;
    const incoming = slides[to];
    incoming.style.transition = 'none';
    incoming.style.transform = `translateY(${100 * dir}%)`;
    incoming.style.zIndex = 3;
    requestAnimationFrame(() => {
      incoming.style.transition = `transform ${duration}ms ease`;
      incoming.style.transform = 'translateY(0)';
    });
    setTimeout(() => {
      current = to;
      settle();
      busy = false;
    }, duration);
  }

  // ===== Desktop events =====
  window.addEventListener('wheel', e => {
    if (isMobile()) return;
    e.preventDefault();
    go(current + (e.deltaY > 0 ? 1 : -1));
  }, { passive: false });

  let startY = 0;
  window.addEventListener('touchstart', e => {
    if (isMobile()) return;
    startY = e.touches[0].clientY;
  });
  window.addEventListener('touchend', e => {
    if (isMobile()) return;
    const delta = startY - e.changedTouches[0].clientY;
    if (Math.abs(delta) > 50) go(current + (delta > 0 ? 1 : -1));
  });

  window.addEventListener('keydown', e => {
    if (isMobile()) return;
    if (e.key === 'ArrowDown' || e.key === 'PageDown') go(current + 1);
    else if (e.key === 'ArrowUp' || e.key === 'PageUp') go(current - 1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(slides.length - 1);
  });

  // ===== Mobile: scroll listener để update hash =====
  if (isMobile()) {
    let scrollTimeout;
    let isScrolling = false;

    window.addEventListener('scroll', () => {
      if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(() => {
          const viewportHeight = window.innerHeight;
          let activeIndex = 0;
          let minDistance = Infinity;

          slides.forEach((slide, index) => {
            const rect = slide.getBoundingClientRect();
            const slideCenter = rect.top + rect.height / 2;
            const viewportCenter = viewportHeight / 2;
            const distance = Math.abs(slideCenter - viewportCenter);
            if (distance < minDistance) {
              minDistance = distance;
              activeIndex = index;
            }
          });

          if (current !== activeIndex) {
            current = activeIndex;
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
              history.replaceState(null, '', '#' + slides[current].id);
            }, 150);
          }

          isScrolling = false;
        });
      }
    }, { passive: true });
  }

  // ===== Resize =====
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (location.hash) {
        const hashIndex = slides.findIndex(s => '#' + s.id === location.hash);
        if (hashIndex >= 0) current = hashIndex;
      }

      if (isMobile()) {
        slides.forEach((s) => {
          s.style.transform = '';
          s.style.zIndex = '';
          s.style.transition = '';
        });
        if (slides[current]) {
          slides[current].scrollIntoView({ behavior: 'auto', block: 'start' });
        }
      } else {
        settle();
      }
    }, 100);
  });

  settle();
});
