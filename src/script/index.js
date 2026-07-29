import cardMockData from '../data/cardsMock.js';
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

// Removing the menu state when goes into the lg mode
const desktopQuery = window.matchMedia(`(min-width: ${DESKTOP_MIN_WIDTH}px)`);
desktopQuery.addEventListener('change', function (event) {
    if (event.matches) {
        setMenuState(false);
    }
});

toggleButton.addEventListener('click', function () {
    // Check if the dropdown menu is currently open
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
    card.className = 'travel-point__card';

    if (stat.badge) {
        card.classList.add('travel-point__card--badge');
    }

    const tagline = document.createElement('h3');
    tagline.className = 'travel-point__card-tagline';
    tagline.textContent = stat.value;

    const description = document.createElement('p');
    description.className = 'travel-point__card-description';
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

renderStats();
initTestimonialSwiper();
