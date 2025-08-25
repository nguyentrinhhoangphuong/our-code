document.addEventListener('DOMContentLoaded', () => {
    // Config animation cho từng trang
    const PAGE_ANIMATIONS = {
        'gioi-thieu': {
            '#gioi-thieu-tong-quan': [
                { selector: '.el-title', delay: 0, animationClass: 'uk-animation-reveal-text' },
                { selector: '.el-meta', delay: 250, animationClass: 'uk-animation-reveal-text' },
                { selector: '.el-content', delay: 500, animationClass: 'uk-animation-reveal-text' },
                { selector: '.el-image', delay: 750, animationClass: 'uk-animation-slide-bottom-small' },
            ],
            '#tong-quan-du-an': [
                { selector: 'h3.el-title', delay: 0, animationClass: 'uk-animation-reveal-text' },
                { selector: '.el-content', delay: 250, animationClass: 'uk-animation-reveal-text' },
                { selector: 'h2.h2-el-title', delay: 500, animationClass: 'uk-animation-reveal-text' },
                { selector: '.item-apartment', delay: 750, animationClass: 'uk-animation-reveal-text' },
                { selector: '.el-image', delay: 250, animationClass: 'uk-animation-slide-bottom-small' },
            ],
            '#loi-the': [
                { selector: '.left', delay: 250, animationClass: 'uk-animation-fade-in-up-short' },
                { selector: '.center', delay: 500, animationClass: 'uk-animation-fade-in-up-short' },
                { selector: '.loi-the-mobi', delay: 500, animationClass: 'uk-animation-reveal-x' },
                { selector: '.right', delay: 750, animationClass: 'uk-animation-fade-in-up-short' },
            ],
            '#chu-dau-tu': [
                
            ],
        },
    };

    // Lấy config theo URL hiện tại
    const slug = window.location.pathname.split('/').filter(Boolean).pop();
    const CURRENT_PAGE = PAGE_ANIMATIONS[slug] || {};

    // Ẩn toàn bộ element trong config ngay từ đầu
    Object.keys(CURRENT_PAGE).forEach(sectionId => {
        const config = CURRENT_PAGE[sectionId];
        config.forEach(item => {
            document.querySelectorAll(sectionId + ' ' + item.selector).forEach(el => {
                el.classList.add('is-hidden');
            });
        });
    });

    // Observer: desktop threshold = 0.5, mobile = 0.1
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                triggerSlideAnimations(entry.target);
            } else {
                resetSlideAnimations(entry.target);
            }
        });
    }, { threshold: window.innerWidth <= 990 ? 0.1 : 0.2 });

    // Trigger animation khi section vào viewport
    function triggerSlideAnimations(section) {
        const config = CURRENT_PAGE['#' + section.id];
        if (!config) return;

        config.forEach(item => {
            setTimeout(() => {
                section.querySelectorAll(item.selector).forEach(el => {
                    el.classList.remove('is-hidden');
                    el.classList.remove(item.animationClass); // reset trước
                    void el.offsetWidth;                      // force reflow
                    el.classList.add(item.animationClass);    // chạy animation
                });
            }, item.delay);
        });
    }

    // Reset animation khi section ra khỏi viewport
    function resetSlideAnimations(section) {
        const config = CURRENT_PAGE['#' + section.id];
        if (!config) return;

        config.forEach(item => {
            section.querySelectorAll(item.selector).forEach(el => {
                el.classList.remove(item.animationClass);
                el.classList.add('is-hidden'); // ẩn lại
            });
        });
    }

    document.querySelectorAll('.slide-section').forEach(slide => {
        observer.observe(slide);
    });
});
