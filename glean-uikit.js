document.addEventListener("DOMContentLoaded", function () {
  const sliderA = UIkit.slider(".ju-slide-panel");
  const sliderB = UIkit.slider(".ju-slide-image");

  if (!sliderA || !sliderB) return;

  // Khi slider A thay đổi → slider B đổi theo
  sliderA.$el.addEventListener("beforeitemshow", function (e) {
    const index = e.detail[0].index;
    sliderB.show(index);
  });
});


document.addEventListener("DOMContentLoaded", function () {
  const timeLeftContainers = document.querySelectorAll(".ju-time-left .el-meta");

  timeLeftContainers.forEach(container => {
    let text = container.textContent.trim();

    // Tìm ngày trong text (ví dụ: "September 6, 2025")
    let dateMatch = text.match(/[A-Za-z]+ \d{1,2}, \d{4}/);

    if (dateMatch) {
      let targetDate = new Date(dateMatch[0]);
      let today = new Date();

      // Reset time để tính đúng ngày
      targetDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      // Tính số ngày chênh lệch
      let diffTime = targetDate - today;
      let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Thay thế nội dung hiển thị
      if (diffDays > 1) {
        container.innerHTML = `<span>Time left:</span> <span style="color:#00BD2A; font-weight:300;">${diffDays} days</span>`;
      } else if (diffDays === 1) {
        container.innerHTML = `<span>Time left:</span> <span style="color:#00BD2A; font-weight:300;">1 day</span>`;
      } else {
        container.innerHTML = `<span style="color:red; font-weight:300;">Expired</span>`;
      }
    }
  });
});


document.addEventListener("DOMContentLoaded", function () {
  const root = document.querySelector(".ju-company-history");
  if (!root) return;

  // Lưu trạng thái ban đầu để khôi phục khi > 640px
  const original = {
    classes: root.className,
    attr: root.getAttribute("uk-grid"),
    html: root.innerHTML
  };

  function destroyUIkit(comp, name) {
    if (window.UIkit && UIkit.getComponent) {
      const inst = UIkit.getComponent(comp, name);
      if (inst && inst.$destroy) inst.$destroy();
    }
  }

  function toSlider() {
    // Hủy grid cũ (nếu đang hoạt động)
    destroyUIkit(root, "grid");

    // Lấy các item gốc
    const items = Array.from(root.querySelectorAll(".el-item"));
    if (!items.length) return;

    // Xây markup slider theo UIkit
    const slider = document.createElement("div");
    slider.setAttribute("uk-slider", "finite: true");

    const rel = document.createElement("div");
    rel.className = "uk-position-relative uk-visible-toggle";
    rel.setAttribute("tabindex", "-1");

    const container = document.createElement("div");
    container.className = "uk-slider-container";

    const ul = document.createElement("ul");
    ul.className = "uk-slider-items uk-grid"; // dùng grid để có gutter

    // Mỗi .el-item -> 1 <li> width 2/3
    items.forEach((el, i) => {
      const li = document.createElement("li");
      li.className = "uk-width-2-3";

      // nếu là item chẵn thì margin-top: 40px
      if ((i + 1) % 2 === 0) {
        li.style.marginTop = "40px";
      }

      li.appendChild(el);
      ul.appendChild(li);
    });

    container.appendChild(ul);
    rel.appendChild(container);

    // Thay nội dung root bằng slider
    root.removeAttribute("uk-grid");
    root.className = "ju-company-history";
    root.innerHTML = "";
    root.appendChild(slider);
    slider.appendChild(rel);
    slider.appendChild(dots);

    // Khởi tạo lại UIkit
    if (window.UIkit && UIkit.update) UIkit.update(root);
  }

  function toGrid() {
    // Hủy slider nếu có
    const sliderHost = root.querySelector("[uk-slider]");
    if (sliderHost) destroyUIkit(sliderHost, "slider");

    // Khôi phục grid ban đầu
    root.className = original.classes;
    root.innerHTML = original.html;
    if (original.attr != null) root.setAttribute("uk-grid", original.attr);
    else root.removeAttribute("uk-grid");

    if (window.UIkit && UIkit.update) UIkit.update(root);
  }

  function toggle() {
    if (window.innerWidth <= 640) {
      if (!root.querySelector("[uk-slider]")) toSlider();
    } else {
      if (root.querySelector("[uk-slider]")) toGrid();
    }
  }

  toggle();
  window.addEventListener("resize", () => {
    clearTimeout(toggle._t);
    toggle._t = setTimeout(toggle, 150);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".ju-uk-accordion-image");
  if (!container) return;

  document.addEventListener("click", function (e) {
    const insideAccordion = e.target.closest(".uk-accordion");
    if (insideAccordion && container.contains(insideAccordion)) {
      return; // đang click trong accordion -> không đóng
    }

    // Đóng toàn bộ item đang mở
    container.querySelectorAll(".uk-accordion").forEach(acc => {
      const uiAcc = UIkit.accordion(acc);
      acc.querySelectorAll(".el-item.uk-open").forEach((item, i) => {
        uiAcc.toggle(i, false); // UIkit sẽ tự ẩn .uk-accordion-content
      });
    });
  });
});
