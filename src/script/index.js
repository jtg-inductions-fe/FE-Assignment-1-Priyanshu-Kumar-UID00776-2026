import { cardMockData } from '../MOCK_DATA/cardsMock.js';
import { initTestimonialSwiper } from './swiper.js';
import { initSpinner } from './spinner.js';

const toggleButton = document.getElementById('header-toggle');
const dropdown = document.getElementById('header-dropdown');
const overlay = document.getElementById('overlay-area');
const dealsModal = document.getElementById('deals-modal');
const dealsWheel = document.getElementById('deals-wheel-wrapper');
const dealsCoupons = document.getElementById('deals-coupon-wrapper');
const dealsToggleBtn = document.getElementById('deals-toggle-btn');
const dealsBtnText = document.getElementById('deals-btn-text');
const dealsBtnBadge = document.getElementById('deals-btn-badge');
const dealsTitle = document.getElementById('deals-title');
const dealsDesc = document.getElementById('deals-description');
const dealsCloseBtn = document.getElementById('deals-close-btn');
const wonCouponContainer = document.getElementById('latest-win-banner');
const navLinks = document.querySelectorAll('.link');

const openIcon = document.getElementById('toggle-icon-open');
const closeIcon = document.getElementById('toggle-icon-close');
const DESKTOP_MIN_WIDTH = 1025;

let isMenuOpenState = false;

// Handling the dropdown menu state
const setMenuState = (shouldOpen) => {
    isMenuOpenState = shouldOpen;
    toggleButton.setAttribute('aria-expanded', shouldOpen);

    if (shouldOpen) {
        // Open menu reveal dropdown layout, lock page scroll, and swap to close icon
        dropdown.classList.remove('hidden');
        dropdown.classList.add('display-flex');
        document.body.classList.add('no-scroll');
        openIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
    } else {
        // Close menu hide dropdown layout, restore page scroll, and swap back to open icon
        dropdown.classList.add('hidden');
        dropdown.classList.remove('display-flex');
        document.body.classList.remove('no-scroll');
        openIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
    }
};

// Handles the Special deals modal state
const setDealsModalState = (shouldOpen) => {
    // Checks the shoulOpen and applies the overlay and opens modal
    if (shouldOpen) {
        if (isMenuOpenState) {
            setMenuState(false);
        }
        overlay.classList.add('overlay--active');
        dealsModal.classList.add('deals--active');
        document.body.classList.add('no-scroll');
        dealsModal.showModal();
    }
    // Overlay is removed and modal is closed
    else {
        overlay.classList.remove('overlay--active');
        dealsModal.classList.remove('deals--active');
        dealsModal.close();

        // No scroll removed when modal is closed
        if (!isMenuOpenState) {
            document.body.classList.remove('no-scroll');
        }
    }
};

// Event listeners for Special deals links
document.body.addEventListener('click', (event) => {
    const trigger = event.target.closest('.deals-modal');
    if (trigger) {
        event.preventDefault();
        setDealsModalState(true);
    }
});

// If user clicks on area other than modal closes the modal
overlay.addEventListener('click', function () {
    setDealsModalState(false);
});

// Handles the modal state by the close button
dealsCloseBtn.addEventListener('click', function () {
    setDealsModalState(false);
});

dealsToggleBtn.addEventListener('click', function () {
    // Check if coupons are currently hidden
    const isShowingWheel = dealsCoupons.classList.contains('hidden');

    if (isShowingWheel) {
        // Show Coupons hide Wheel
        dealsWheel.classList.add('hidden');
        dealsCoupons.classList.remove('hidden');
        wonCouponContainer.classList.add('hidden');

        // Update Text
        dealsTitle.textContent = 'Unlocked Deals';
        dealsDesc.textContent = 'All the deals you’ve unlocked yet!';
        dealsBtnText.textContent = 'Go Back';
        dealsBtnBadge.classList.add('hidden');
    } else {
        // Show Wheel hide Coupons
        dealsWheel.classList.remove('hidden');
        dealsCoupons.classList.add('hidden');
        wonCouponContainer.classList.remove('hidden');

        // Restore Text
        dealsTitle.textContent = 'Spin & Win!';
        dealsDesc.textContent = 'Tap the center of the wheel to spin';
        dealsBtnText.textContent = 'View All Unlocked Deals';
        dealsBtnBadge.classList.remove('hidden');
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
        const isDealsModalOpen = dealsModal.classList.contains('deals--active');

        // Closes the menu when Escape key is pressed
        if (isMenuOpen) {
            setMenuState(false);
            toggleButton.focus();
        }

        // Closes the deals modal when Escape key is pressed
        if (isDealsModalOpen) {
            setDealsModalState(false);
            return;
        }
    }
});

// Creation of cards using the mock data
const createStatCard = (stat) => {
    const card = document.createElement('div');
    card.className = 'cards';

    // If badge is found then applied the badge class
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

        // If list is found then only add the toggle class to open the accordian
        if (list) {
            const isOpen = list.classList.toggle('footer__list--is-open');
            button.setAttribute('aria-expanded', String(isOpen));
        }
    });
});

// Makes the current selected link as black
navLinks.forEach((clickedLink) => {
    clickedLink.addEventListener('click', function () {
        navLinks.forEach((link) => link.classList.remove('link--active'));
        this.classList.add('link--active');
    });
});

renderStats();
initTestimonialSwiper();
initSpinner();
