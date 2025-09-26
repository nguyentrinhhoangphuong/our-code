document.addEventListener('DOMContentLoaded', function () {
  const dotnavs = document.querySelectorAll('.uk-slider-nav.uk-dotnav');

  dotnavs.forEach(function (dotnav) {
    const slider = dotnav.closest('.uk-slider-container');


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
