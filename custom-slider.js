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
