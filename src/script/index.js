const toggleButton = document.getElementById('header-toggle');
const dropdown = document.getElementById('header-dropdown');

const openIcon = document.getElementById('toggle-icon-open');
const closeIcon = document.getElementById('toggle-icon-close');
const DESKTOP_MIN_WIDTH = 1025;

// Handling the dropdown menu state
function setMenuState(shouldOpen) {
    toggleButton.setAttribute('aria-expanded', shouldOpen);

    if (shouldOpen) {
        // Open menu: reveal dropdown layout, lock page scroll, and swap to close icon
        dropdown.classList.remove('hidden');
        dropdown.classList.add('open-flex-display');
        document.body.classList.add('no-scroll');
        openIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
    } else {
        // Close menu: hide dropdown layout, restore page scroll, and swap back to open icon
        dropdown.classList.add('hidden');
        dropdown.classList.remove('open-flex-display');
        document.body.classList.remove('no-scroll');
        openIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
    }
}

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
