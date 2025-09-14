// ======================================== sửa dotnav ==============================
// cách 1
document.addEventListener("DOMContentLoaded", () => {
  const sliderEl = document.querySelector(".slider-lien-ket-khu-vuc.uk-slider");
  if (!sliderEl) return;

  const dotnavItems = sliderEl.querySelectorAll(".uk-dotnav li");

  function updateDots(activeIndex) {
    dotnavItems.forEach((li, i) => {
      const dot = li.querySelector("a");
      if (!dot) return;

      const distance = Math.abs(i - activeIndex); // khoảng cách tới dot active

      // scale = 1.4 (ở active) giảm dần 0.2 mỗi step, nhưng không nhỏ hơn 0.6
      const scale = Math.max(0.6, 1.4 - distance * 0.2);
      const opacity = Math.max(0.3, 1 - distance * 0.2);

      dot.style.transform = `scale(${scale})`;
      dot.style.opacity = opacity;
      dot.style.backgroundColor = distance === 0 ? "#00425a" : "#eae6df";
      dot.style.transition = "all 0.3s ease";
    });
  }

  // lần đầu khi trang load
  const firstActive = Array.from(dotnavItems).findIndex(li => li.classList.contains("uk-active"));
  updateDots(firstActive);

  // lắng nghe khi slide đổi
  UIkit.util.on(sliderEl, "itemshown", (e, sliderObj) => {
    updateDots(sliderObj.index);
  });
});


// cách 2
document.addEventListener("DOMContentLoaded", () => {
  const sliderEl = document.querySelector(".slider-lien-ket-khu-vuc.uk-slider");
  if (!sliderEl) return;

  const dotnavItems = sliderEl.querySelectorAll(".uk-dotnav li");

  function animateDot(dot, fromScale, toScale, fromOpacity, toOpacity, duration = 300) {
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 0.5 - Math.cos(progress * Math.PI) / 2; // easeInOut

      const scale = fromScale + (toScale - fromScale) * ease;
      const opacity = fromOpacity + (toOpacity - fromOpacity) * ease;

      dot.style.transform = `scale(${scale})`;
      dot.style.opacity = opacity;

      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  // Lưu trạng thái scale hiện tại để animate mượt
  const states = Array(dotnavItems.length).fill({ scale: 1, opacity: 0.5 });

  function updateDots(activeIndex) {
    dotnavItems.forEach((li, i) => {
      const dot = li.querySelector("a");
      if (!dot) return;

      const distance = Math.abs(i - activeIndex);

      const targetScale = Math.max(0.6, 1.4 - distance * 0.2);
      const targetOpacity = Math.max(0.3, 1 - distance * 0.2);
      const targetColor = distance === 0 ? "#00425a" : "#eae6df";

      const { scale: currentScale, opacity: currentOpacity } = states[i];

      animateDot(dot, currentScale, targetScale, currentOpacity, targetOpacity);

      // update trạng thái mới
      states[i] = { scale: targetScale, opacity: targetOpacity };
      dot.style.backgroundColor = targetColor;
    });
  }

  // khởi tạo lần đầu
  const firstActive = Array.from(dotnavItems).findIndex(li => li.classList.contains("uk-active"));
  updateDots(firstActive);

  // nghe sự kiện slider
  UIkit.util.on(sliderEl, "itemshown", (e, sliderObj) => {
    updateDots(sliderObj.index);
  });
});



// cách 3
document.addEventListener("DOMContentLoaded", () => {
  const sliderEl = document.querySelector(".slider-lien-ket-khu-vuc.uk-slider");
  if (!sliderEl) return;

  const dotnavItems = sliderEl.querySelectorAll(".uk-dotnav li");

  function updateDots(activeIndex) {
    dotnavItems.forEach((li, i) => {
      const dot = li.querySelector("a");
      if (!dot) return;

      const distance = Math.abs(i - activeIndex);

      let scale = Math.max(0.6, 1.4 - distance * 0.2);
      let opacity = Math.max(0.3, 1 - distance * 0.2);
      let color = distance === 0 ? "#00425a" : "#eae6df";

      dot.style.transform = `scale(${scale})`;
      dot.style.opacity = opacity;
      dot.style.backgroundColor = color;
    });
  }

  // lần đầu khi load
  const firstActive = Array.from(dotnavItems).findIndex(li => li.classList.contains("uk-active"));
  updateDots(firstActive);

  // lắng nghe khi đổi slide
  UIkit.util.on(sliderEl, "itemshown", (e, sliderObj) => {
    updateDots(sliderObj.index);
  });
});


// bỏ vào css
// .uk-dotnav li a {
//   display: inline-block;
//   width: 12px;
//   height: 12px;
//   border-radius: 50%;
//   background-color: #eae6df;
//   transition: transform 0.3s ease, opacity 0.3s ease, background-color 0.3s ease;
// }





// ======================================================== sửa slide nav =============================================
document.addEventListener('DOMContentLoaded', function () {
  const dotnavs = document.querySelectorAll('.uk-slider-nav.uk-dotnav');

  dotnavs.forEach(function (dotnav) {
    const slider = dotnav.closest('.uk-slider-container');
    if (!slider) return;

    const prev = document.createElement('a');
    prev.className = 'uk-slidenav-previous uk-icon';
    prev.setAttribute('uk-slider-item', 'previous');
    prev.innerHTML = '<span uk-icon="icon: chevron-left"></span>';

    const next = document.createElement('a');
    next.className = 'uk-slidenav-next uk-icon';
    next.setAttribute('uk-slider-item', 'next');
    next.innerHTML = '<span uk-icon="icon: chevron-right"></span>';

    const navWrapper = document.createElement('div');
    navWrapper.className = 'custom-nav-wrapper';

    navWrapper.appendChild(prev);
    navWrapper.appendChild(dotnav);
    navWrapper.appendChild(next);

    slider.appendChild(navWrapper);
  });
});

.custom-nav-wrapper {
	display: flex !important;
	justify-content: center !important;
	align-items: center !important;
	width: 100% !important;
    margin-top: 36px;
}

.custom-nav-wrapper .uk-slidenav-previous,
.custom-nav-wrapper .uk-slidenav-next {
	position: static !important;
	transform: none !important;
	display: inline-flex !important;
	align-items: center !important;
	justify-content: center !important;
	color: #CC2028 !important;
	background: transparent !important;
	margin: 0 8px !important;
}





// ======================================== hover đổi màu mũi tên ==================================
.el-slidenav svg path {
  transition: stroke 0.3s ease;
}

.el-slidenav:hover svg path {
  stroke: #5e977e;
}
