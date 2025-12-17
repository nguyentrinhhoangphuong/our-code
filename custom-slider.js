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




// ==================================================
https://nthp.xyz/wp/wp-content/uploads/2025/12/screenshot-2025-12-17_09-26-30.png

.uk-slider-items {
  height: 600px;
}
.uk-slider-items .is-center{
    width:30% !important;
}
.uk-slider-items .is-near{
    width:20% !important;
}
.uk-slider-items .is-far{
    width:15% !important;
}
.uk-slider-items > div {
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.uk-slider-items .el-item {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.uk-slider-items .el-image {
  object-fit: cover;
  transition: height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.uk-slider-items > div.is-center {
  transform: translateY(40px);
}
.uk-slider-items > div.is-center .el-image {
  height: 545px !important;

}

.uk-slider-items > div.is-near {
  transform: translateY(60px); 
}
.uk-slider-items > div.is-near .el-image {
  height: 492px !important;

}

.uk-slider-items > div.is-far {
  transform: translateY(80px); 
}
.uk-slider-items > div.is-far .el-image {
  height: 424px !important;

}

document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('.custom-slider');
  if (!slider) return;

  const items = slider.querySelectorAll('.uk-slider-items > div');

  function update() {
    const sliderRect = slider.getBoundingClientRect();
    const centerX = sliderRect.left + sliderRect.width / 2;

    const itemsWithDistance = [];

    items.forEach(item => {
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.left + rect.width / 2;
      const distance = Math.abs(centerX - itemCenter);

      itemsWithDistance.push({
        element: item,
        distance: distance
      });
    });

    itemsWithDistance.sort((a, b) => a.distance - b.distance);

    itemsWithDistance.forEach((item, index) => {
      const element = item.element;
      element.classList.remove('is-center', 'is-near', 'is-far');

      if (index === 0) {
        element.classList.add('is-center');
      } else if (index === 1 || index === 2) {
        element.classList.add('is-near');
      } else {
        element.classList.add('is-far');
      }
    });
  }

  update();

  UIkit.util.on(slider, 'itemshow', update);
  UIkit.util.on(slider, 'itemshown', update);
  window.addEventListener('resize', update);
});





// ====================================================






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
