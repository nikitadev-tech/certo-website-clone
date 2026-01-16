// Button-Company dropdown-menu
document.addEventListener('DOMContentLoaded', function() {
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    dropdownToggle.addEventListener('click', function(e) {
        e.preventDefault();
        dropdownMenu.classList.toggle('show');
    });

    // Закрытие при клике вне меню
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.header__nav-item--dropdown')) {
            dropdownMenu.classList.remove('show');
        }
    });
});


// обработчик событий скрывающейся шапки
const header = document.querySelector('.header__top');
let lastScroll = 0;

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;

    if (currentScroll > lastScroll) {
        header.classList.add('hidden');
    } else {
        header.classList.remove('hidden');
    }

    lastScroll = currentScroll;
});



// Slider with inertia

const slider = document.querySelector('.reviews__slider');
let isDragging = false;
let startX;
let scrollLeft;
let velocity = 0;
let lastX;
let lastTime;
let animationId;
let isAnimating = false;

// Функция для начала перетаскивания (мышь и касание)
function handleDragStart(e) {
    isDragging = true;
    isAnimating = false;

    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.pageX;
    startX = clientX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
    lastX = clientX;
    lastTime = Date.now();
    slider.style.cursor = 'grabbing';

    document.querySelectorAll('.slider-block').forEach(block => {
        block.style.transform = 'scale(0.93)';
    });
}

// Функция для перетаскивания (мышь и касание)
function handleDragMove(e) {
    if (!isDragging) return;
    e.preventDefault();

    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.pageX;
    const currentTime = Date.now();
    const elapsed = currentTime - lastTime;

    if (elapsed > 0) {
        const deltaX = clientX - lastX;
        velocity = deltaX / elapsed;
    }

    const x = clientX - slider.offsetLeft;
    const walk = x - startX;
    slider.scrollLeft = scrollLeft - walk;

    lastX = clientX;
    lastTime = currentTime;
}

// Функция анимации инерции
function animateInertia() {
    if (Math.abs(velocity) < 0.01) {
        isAnimating = false;
        return;
    }

    velocity *= 0.95;

    let newScrollLeft = slider.scrollLeft - velocity * 16;

    const maxScroll = slider.scrollWidth - slider.clientWidth;
    if (newScrollLeft < 0) {
        newScrollLeft = 0;
        velocity = 0;
    } else if (newScrollLeft > maxScroll) {
        newScrollLeft = maxScroll;
        velocity = 0;
    }

    slider.scrollLeft = newScrollLeft;

    animationId = requestAnimationFrame(animateInertia);
}

// Функция для окончания перетаскивания (мышь и касание)
function handleDragEnd() {
    if (!isDragging) return;

    isDragging = false;
    slider.style.cursor = 'grab';

    document.querySelectorAll('.slider-block').forEach(block => {
        block.style.transform = 'scale(1)';
    });

    if (Math.abs(velocity) > 0.1) {
        isAnimating = true;
        animationId = requestAnimationFrame(animateInertia);
    } else {
        velocity = 0;
    }
}

// События для мыши
slider.addEventListener('mousedown', handleDragStart);
slider.addEventListener('mouseleave', handleDragEnd);
slider.addEventListener('mouseup', handleDragEnd);
slider.addEventListener('mousemove', handleDragMove);

// События для касания (телефоны)
slider.addEventListener('touchstart', handleDragStart, { passive: false });
slider.addEventListener('touchmove', handleDragMove, { passive: false });
slider.addEventListener('touchend', handleDragEnd);
slider.addEventListener('touchcancel', handleDragEnd);



// scroll-animation

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Если это слайдер - запускаем анимацию скролла
            if (entry.target.classList.contains('reviews__slider')) {
                const slider = entry.target;
                const totalWidth = slider.scrollWidth - slider.clientWidth;

                // Устанавливаем начальную позицию (конец слайдера)
                slider.scrollLeft = totalWidth;

                // Анимация скролла от конца почти до конца (1.2 секунды)
                setTimeout(() => {
                    smoothScrollTo(slider, totalWidth * 0.10, 900);
                }, 1);

                observer.unobserve(entry.target);
            }

            // Если это элемент с data-animation - запускаем анимацию появления
            else if (entry.target.dataset.animation) {
                const animationType = entry.target.dataset.animation;
                const animationDelay = entry.target.dataset.delay || '0.2s';

                // Устанавливаем анимацию
                entry.target.style.animation = `${animationType} 0.5s ease-out ${animationDelay} both`;

                const animationDuration = 500;
                const delayMs = parseFloat(animationDelay) * 1000;

                setTimeout(() => {
                    entry.target.style.opacity = '1';

                }, delayMs + animationDuration);

                observer.unobserve(entry.target);
            }
        }
    });
}, { threshold: 0.3 });

// Функция плавного скролла с easing
function smoothScrollTo(element, target, duration) {
    const start = element.scrollLeft;
    const change = target - start;
    const startTime = performance.now();

    function animateScroll(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out 
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        element.scrollLeft = start + (change * easeProgress);

        if (progress < 1) {
            requestAnimationFrame(animateScroll);
        }
    }

    requestAnimationFrame(animateScroll);
}

// Добавляем CSS для pointer-events
const style = document.createElement('style');
style.textContent = `
    [data-animation] {
        opacity: 0;
    }
    .insights__card {
        pointer-events: auto !important;
    }
`;
document.head.appendChild(style);

// Наблюдаем за всеми элементами
document.querySelectorAll('.reviews__slider, [data-animation]').forEach(element => {
    observer.observe(element);
});



// BURGER-MENU

document.addEventListener('DOMContentLoaded', function() {
    const burgerBtn = document.getElementById('burgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (burgerBtn && mobileMenu) {
        burgerBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');

            if (mobileMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        const menuLinks = mobileMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                burgerBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        mobileMenu.addEventListener('click', function(e) {
            if (e.target === mobileMenu) {
                burgerBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                burgerBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});