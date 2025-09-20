document.addEventListener('DOMContentLoaded', function () {
  const productFilters = document.querySelector('.products-filter');
  if (!productFilters) return;

  if (typeof UIkit !== 'undefined' && UIkit.dropdown) {
    UIkit.dropdown = function () {
      return {
        show: function () { },
        hide: function () { },
        isActive: function () { return false; }
      };
    };
  }

  const dropdowns = productFilters.querySelectorAll('.uk-dropdown');
  dropdowns.forEach((dropdown, index) => {
    dropdown.removeAttribute('style');
    dropdown.classList.remove('uk-dropdown', 'uk-drop', 'uk-open');
    dropdown.classList.add('uk-accordion-content');
    dropdown.style.display = 'none';

    const anchor = dropdown.previousElementSibling;
    if (anchor && anchor.tagName === 'A') {
      const newAnchor = anchor.cloneNode(true);
      anchor.parentNode.replaceChild(newAnchor, anchor);
      newAnchor.classList.add('uk-accordion-title');
      newAnchor.removeAttribute('aria-haspopup');
      newAnchor.removeAttribute('aria-expanded');
      newAnchor.removeAttribute('role');
      newAnchor.href = 'javascript:void(0);';

      newAnchor.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        newAnchor.classList.toggle('uk-active');
      });
    }
  });
});
