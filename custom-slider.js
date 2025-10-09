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






















// hana travel
document.addEventListener("DOMContentLoaded", function () {
  const targetElement = document.querySelector('.khach-san-noi-bat .uk-container');
  if (targetElement) {
    targetElement.classList.remove('uk-container');
  }

  const sliderEl = document.querySelector('.slider-khach-san');
  if (!sliderEl) return;

  const itemsContainer = sliderEl.querySelector('.uk-slider-items');
  if (!itemsContainer) return;

  // Tạo custom slidenav
  const navButtons = createCustomSlideNav(sliderEl);

  try { UIkit.slider(sliderEl); } catch (e) { }

  function updateCenter() {
    const sliderRect = sliderEl.getBoundingClientRect();
    const centerX = sliderRect.left + sliderRect.width / 2;

    const itemWrappers = Array.from(itemsContainer.querySelectorAll(':scope > *'));
    let bestEl = null;
    let bestDist = Infinity;
    let bestWrapper = null;
    
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
        bestWrapper = wrapper;
      }
    });

    if (bestEl) {
      bestEl.classList.add('active-center');
      // Đặt vị trí nav buttons dựa vào active item
      positionNavButtons(bestWrapper, navButtons);
    }
  }

  // Chờ slider render xong rồi mới update position
  setTimeout(() => {
    updateCenter();
  }, 200);

  sliderEl.addEventListener('itemshown', updateCenter);
  sliderEl.addEventListener('beforeitemshow', updateCenter);
  window.addEventListener('resize', updateCenter);

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Chờ DOM render lại sau khi resize
      requestAnimationFrame(() => {
        setTimeout(updateCenter, 100);
      });
    }, 150);
  });
});

function createCustomSlideNav(sliderEl) {
  // Tạo Previous button - để UIkit tự render icon
  const prevBtn = document.createElement('div');
  prevBtn.className = 'uk-visible@s uk-dark custom-nav-prev';
  prevBtn.style.cssText = 'position: absolute; z-index: 10; transition: all 0.3s ease; pointer-events: auto;';
  prevBtn.innerHTML = `<a class="el-slidenav uk-icon uk-slidenav uk-custom-nav-prev" href="#" uk-slidenav-previous role="button" aria-label="Previous slide"></a>`;
  
  // Tạo Next button - để UIkit tự render icon
  const nextBtn = document.createElement('div');
  nextBtn.className = 'uk-visible@s uk-dark custom-nav-next';
  nextBtn.style.cssText = 'position: absolute; z-index: 10; transition: all 0.3s ease; pointer-events: auto;';
  nextBtn.innerHTML = `<a class="el-slidenav uk-icon uk-slidenav uk-custom-nav-next" href="#" uk-slidenav-next role="button" aria-label="Next slide"></a>`;

  // Thêm vào slider
  sliderEl.style.position = 'relative';
  sliderEl.appendChild(prevBtn);
  sliderEl.appendChild(nextBtn);

  // Xử lý click events
  const sliderInstance = UIkit.slider(sliderEl);
  
  prevBtn.querySelector('a').addEventListener('click', (e) => {
    e.preventDefault();
    if (sliderInstance) sliderInstance.show('previous');
  });

  nextBtn.querySelector('a').addEventListener('click', (e) => {
    e.preventDefault();
    if (sliderInstance) sliderInstance.show('next');
  });

  return { prevBtn, nextBtn };
}

function positionNavButtons(activeWrapper, navButtons) {
  if (!activeWrapper || !navButtons) return;

  const { prevBtn, nextBtn } = navButtons;
  
  // Lấy vị trí của active item
  const itemRect = activeWrapper.getBoundingClientRect();
  const sliderEl = activeWrapper.closest('.slider-khach-san');
  
  if (!sliderEl) return;
  
  const sliderRect = sliderEl.getBoundingClientRect();

  // Tính toán vị trí relative với slider container
  const itemLeft = itemRect.left - sliderRect.left;
  const itemRight = itemRect.right - sliderRect.left;
  const itemTop = itemRect.top - sliderRect.top;
  const itemHeight = itemRect.height;
  
  // Chiều cao của button (mặc định UIkit slidenav)
  const buttonHeight = 40;
  
  // Tính top để button nằm giữa item
  const topPos = itemTop + (itemHeight / 2) - (buttonHeight / 2);

  // Đặt Previous button (bên trái item)
  prevBtn.style.left = `${itemLeft - 60}px`; // cách 60px
  prevBtn.style.top = `${topPos}px`;

  // Đặt Next button (bên phải item)
  nextBtn.style.left = `${itemRight + 20}px`; // cách 20px
  nextBtn.style.top = `${topPos}px`;
}
