import { cardMockData } from '../MOCK_DATA/cardsMock.js';
import { initTestimonialSwiper } from './swiper.js';

const toggleButton = document.getElementById('header-toggle');
const dropdown = document.getElementById('header-dropdown');

const openIcon = document.getElementById('toggle-icon-open');
const closeIcon = document.getElementById('toggle-icon-close');
const DESKTOP_MIN_WIDTH = 1025;

// Handling the dropdown menu state
const setMenuState = (shouldOpen) => {
    toggleButton.setAttribute('aria-expanded', shouldOpen);

    if (shouldOpen) {
        // Open menu: reveal dropdown layout, lock page scroll, and swap to close icon
        dropdown.classList.remove('hidden');
        dropdown.classList.add('display-flex');
        document.body.classList.add('no-scroll');
        openIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
    } else {
        // Close menu: hide dropdown layout, restore page scroll, and swap back to open icon
        dropdown.classList.add('hidden');
        dropdown.classList.remove('display-flex');
        document.body.classList.remove('no-scroll');
        openIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
    }
};

// Close dropdown if Tab is pressed while the last button is focused in the dropdown
dropdown.addEventListener('keydown', function (event) {
    if (event.key === 'Tab' && !event.shiftKey) {
        const lastButton = document.getElementById('sign-up');

        if (document.activeElement === lastButton) {
            setMenuState(false);
        }
    }
});

// Removing the menu state when goes into the lg mode
const desktopQuery = window.matchMedia(`(min-width: ${DESKTOP_MIN_WIDTH}px)`);
desktopQuery.addEventListener('change', function (event) {
    if (event.matches) {
        setMenuState(false);
    }
});

// Close menu & smooth scroll when clicking any dropdown link
document.querySelectorAll('.header__dropdown-link').forEach((link) => {
    link.addEventListener('click', (event) => {
        const targetId = link.getAttribute('href');

        if (targetId && targetId.startsWith('#')) {
            event.preventDefault();
            setMenuState(false);

            const targetElement =
                targetId === '#'
                    ? document.body
                    : document.querySelector(targetId);
            targetElement?.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Check if the dropdown menu is currently open
toggleButton.addEventListener('click', function () {
    const isCurrentlyOpen =
        toggleButton.getAttribute('aria-expanded') === 'true';
    setMenuState(!isCurrentlyOpen);
});

// Escape button close the dropdown menu when the user press it while it is open
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        const isMenuOpen =
            toggleButton.getAttribute('aria-expanded') === 'true';

        if (isMenuOpen) {
            setMenuState(false);
            toggleButton.focus();
        }
    }
});

// Creation of cards using the mock data
const createStatCard = (stat) => {
    const card = document.createElement('div');
    card.className = 'cards';

    if (stat.badge) {
        card.classList.add('cards--badge');
    }

    const tagline = document.createElement('h3');
    tagline.className = 'cards__tagline';
    tagline.textContent = stat.value;

    const description = document.createElement('p');
    description.className = 'cards__description';
    description.textContent = stat.label;

    card.append(tagline, description);
    return card;
};

// Render the cards
const renderStats = () => {
    const container = document.querySelector('.travel-point__cards-wrapper');
    if (!container) return;

    cardMockData.forEach((stat) => {
        container.appendChild(createStatCard(stat));
    });
};

// Footer accordian button click to open dropdown
document.querySelectorAll('.footer__heading').forEach((button) => {
    button.addEventListener('click', () => {
        const list = button.parentElement.querySelector('.footer__list');

        if (list) {
            const isOpen = list.classList.toggle('footer__list--is-open');
            button.setAttribute('aria-expanded', String(isOpen));
        }
    });
});

renderStats();
initTestimonialSwiper();
