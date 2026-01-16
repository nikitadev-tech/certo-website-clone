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



// switch with sliding background

document.querySelectorAll('.subscription-plans__monthly, .subscription-plans__yearly').forEach(option => {
    option.addEventListener('click', function() {
        const switchContainer = this.parentElement;

        // Убираем активный класс
        document.querySelectorAll('.subscription-plans__monthly, .subscription-plans__yearly').forEach(opt => {
            opt.classList.remove('active');
        });

        // Добавляем активный класс нажатому элементу
        this.classList.add('active');

        // Переключаем слайдер
        if (this.classList.contains('subscription-plans__yearly')) {
            switchContainer.classList.add('yearly-active');
        } else {
            switchContainer.classList.remove('yearly-active');
        }
    });
});



// switch functionality

// Ждем загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    // Находим элементы
    const monthlyBtn = document.querySelector('.subscription-plans__monthly');
    const yearlyBtn = document.querySelector('.subscription-plans__yearly');
    const slider = document.querySelector('.subscription-plans__slider');
    const monthlyCards = document.getElementById('monthlyCards');
    const yearlyCards = document.getElementById('yearlyCards');

    // Обработчик для Monthly
    monthlyBtn.addEventListener('click', function() {
        // Показываем monthly cards, скрываем yearly cards
        monthlyCards.style.display = 'block';
        yearlyCards.style.display = 'none';

        // Обновляем активные классы
        monthlyBtn.classList.add('active');
        yearlyBtn.classList.remove('active');

        // Двигаем слайдер
        slider.style.transform = 'translateX(0)';
    });

    // Обработчик для Yearly
    yearlyBtn.addEventListener('click', function() {
        // Показываем yearly cards, скрываем monthly cards
        yearlyCards.style.display = 'block';
        monthlyCards.style.display = 'none';

        // Обновляем активные классы
        yearlyBtn.classList.add('active');
        monthlyBtn.classList.remove('active');

        // Двигаем слайдер
        slider.style.transform = 'translateX(100%)';
    });
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



// Smooth scrolling to the anchor #subscription-plans

document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href="#subscription-plans"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetElement = document.getElementById('subscription-plans');

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});



// Smooth scrolling to the anchor #subscription-plans

document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href="#subscription-plans"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetElement = document.getElementById('subscription-plans');

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});


// The logic of the accordion operation

document.addEventListener('DOMContentLoaded', function() {
    const accordionItems = document.querySelectorAll('.accordion__item');
    let activeItem = null;

    // Функция для закрытия всех элементов
    function closeAllItems() {
        accordionItems.forEach(item => {
            item.classList.remove('accordion__item--active');
            const content = item.querySelector('.accordion__content');
            // Сбрасываем max-height у всех элементов
            content.style.maxHeight = null;
        });
        activeItem = null;
    }

    // Функция для открытия элемента
    function openItem(item) {
        closeAllItems();
        item.classList.add('accordion__item--active');
        const content = item.querySelector('.accordion__content');

        // Устанавливаем точную высоту для плавной анимации
        content.style.maxHeight = content.scrollHeight + 'px';
        activeItem = item;

        // Плавная прокрутка к открытому элементу
        setTimeout(() => {
            item.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }, 100);
    }

    // Обработчик клика для каждого элемента аккордеона
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion__header');

        header.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const isActive = item.classList.contains('accordion__item--active');

            if (isActive) {
                // Если элемент уже активен - закрываем его
                closeAllItems();
            } else {
                // Если элемент не активен - открываем его
                openItem(item);
            }
        });

        // Добавляем обработчик для клавиатуры (для доступности)
        header.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Закрытие аккордеона при клике вне его области
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.accordion__container') && activeItem) {
            closeAllItems();
        }
    });

    // Инициализация: задаем начальную высоту для уже активных элементов (если есть)
    accordionItems.forEach(item => {
        if (item.classList.contains('accordion__item--active')) {
            const content = item.querySelector('.accordion__content');
            content.style.maxHeight = content.scrollHeight + 'px';
            activeItem = item;
        }
    });

    // Добавляем ARIA атрибуты для доступности
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion__header');
        const content = item.querySelector('.accordion__content');
        const isActive = item.classList.contains('accordion__item--active');

        header.setAttribute('role', 'button');
        header.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        header.setAttribute('aria-controls', `accordion-content-${item.dataset.index}`);

        content.setAttribute('role', 'region');
        content.setAttribute('aria-labelledby', `accordion-header-${item.dataset.index}`);
        content.setAttribute('id', `accordion-content-${item.dataset.index}`);
    });
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