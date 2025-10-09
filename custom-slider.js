document.addEventListener('DOMContentLoaded', function () {
  const sliderEl = document.querySelector('.van-hoa-cf');
  if (!sliderEl) return;

  const itemsContainer = sliderEl.querySelector('.uk-slider-items');
  if (!itemsContainer) return;
  try { UIkit.slider(sliderEl); } catch(e){}

  function updateCenter() {
    const sliderRect = sliderEl.getBoundingClientRect();
    const centerX = sliderRect.left + sliderRect.width / 2;

    const itemWrappers = Array.from(itemsContainer.querySelectorAll(':scope > *'));
    let bestEl = null;
    let bestDist = Infinity;

    itemWrappers.forEach(wrapper => {
      const elItem = wrapper.querySelector('.el-item'); 
      if (!elItem) return;

      const rect = wrapper.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return;

      const itemCenter = rect.left + rect.width / 2;
      const dist = Math.abs(itemCenter - centerX);

      elItem.classList.remove('active-center');
      if (dist < bestDist) {
        bestDist = dist;
        bestEl = elItem;
      }
    });

    if (bestEl) {
      bestEl.classList.add('active-center');
    } else {
    }
  }

  setTimeout(updateCenter, 100);

  // khi slider thay đổi
  sliderEl.addEventListener('itemshown', updateCenter);
  sliderEl.addEventListener('beforeitemshow', updateCenter);

  window.addEventListener('resize', updateCenter);
});










document.addEventListener('DOMContentLoaded', function () {
  const sliderContainer = document.querySelector('.cafe-review-zone-overlay-slider');
  const sliderItems = sliderContainer?.querySelector('.uk-slider-items');
  if (!sliderItems || sliderItems.dataset.grouped) return;
  sliderItems.dataset.grouped = 'true';
  const allItems = Array.from(sliderItems.children);
  const originalItems = allItems.map(item => item.cloneNode(true));

  function rebuildSlider() {
    sliderItems.innerHTML = '';
    const isMobile = window.innerWidth < 640;
    const groupSize = isMobile ? 2 : 6;
    const items = originalItems.map(item => item.cloneNode(true));

    for (let i = 0; i < items.length; i += groupSize) {
      const slide = document.createElement('div');
      slide.className = 'uk-width-1-1';

      const grid = document.createElement('div');

      if (isMobile) {
        grid.className = 'uk-grid uk-grid-small uk-child-width-1-1';
      } else {
        grid.className = 'uk-grid uk-grid-small uk-child-width-1-3@m';
      }

      grid.setAttribute('uk-grid', '');
      for (let j = i; j < i + groupSize && j < items.length; j++) {
        const item = items[j];
        // Remove conflicting classes
        item.classList.remove('uk-active', 'uk-slide-active');
        grid.appendChild(item);
      }

      slide.appendChild(grid);
      sliderItems.appendChild(slide);
    }
    if (window.UIkit) {
      const slider = UIkit.slider(sliderContainer);
      if (slider) {
        slider.$destroy();
      }
      UIkit.slider(sliderContainer);
    }

    // Fix focus issues
    setTimeout(() => {
      const allGridItems = sliderItems.querySelectorAll('.uk-grid > div');
      allGridItems.forEach(item => {
        item.removeAttribute('tabindex');
        item.removeAttribute('aria-hidden');
      });
    }, 100);
  }
  rebuildSlider();
  
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const wasMobile = sliderItems.querySelector('.uk-child-width-1-1') !== null;
      const isMobile = window.innerWidth < 640;
      if (wasMobile !== isMobile) {
        rebuildSlider();
      }
    }, 300);
  });


});
