document.addEventListener("DOMContentLoaded", function () {
  const sections = [...document.querySelectorAll(".section-cover")];
  if (!sections.length) return;

  let current = 0;
  let busy = false;
  const duration = 800;
  let lastScrollTime = 0;
  let wheelHandler = null;

  const scrollTo = (index) => {
    if (index < 0 || index >= sections.length) return;
    busy = true;
    current = index;
    sections[index].scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      busy = false;
    }, duration);
  };

  const createWheelHandler = () => {
    return function (e) {
      if (busy) {
        e.preventDefault();
        return;
      }

      const now = Date.now();
      if (now - lastScrollTime < duration) {
        e.preventDefault();
        return;
      }

      if (e.deltaY > 0 && current < sections.length - 1) {
        e.preventDefault();
        lastScrollTime = now;
        scrollTo(current + 1);
      } else if (e.deltaY < 0 && current > 0) {
        e.preventDefault();
        lastScrollTime = now;
        scrollTo(current - 1);
      }
    };
  };

  const setupWheelScroll = () => {
    if (wheelHandler) {
      window.removeEventListener("wheel", wheelHandler, { passive: false });
      wheelHandler = null;
    }

    if (window.innerWidth > 991) {
      wheelHandler = createWheelHandler();
      window.addEventListener("wheel", wheelHandler, { passive: false });
    }
  };

  setupWheelScroll();
  window.addEventListener("resize", setupWheelScroll);

  // Theo dõi section đang hiển thị
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !busy) {
          const index = sections.indexOf(entry.target);
          if (index !== -1) current = index;
        }
      });
    },
    { threshold: 0.6 }
  );

  sections.forEach((section) => observer.observe(section));
});
