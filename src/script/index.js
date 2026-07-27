const toggleButton = document.getElementById('header-toggle');
const dropdown = document.getElementById('header-dropdown');

const openIcon = document.getElementById('toggle-icon-open');
const closeIcon = document.getElementById('toggle-icon-close');
const desktopMinWidth = 1024;

// Handling the dropdown menu state
function setMenuState(shouldOpen) {
    toggleButton.setAttribute('aria-expanded', shouldOpen);

    if (shouldOpen) {
        dropdown.classList.remove('hidden');
        dropdown.classList.add('header__is-open');
        document.body.classList.add('no-scroll');
        openIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
    } else {
        dropdown.classList.add('hidden');
        dropdown.classList.remove('header__is-open');
        document.body.classList.remove('no-scroll');
        openIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
    }
}

// Removing the menu state when goes into the lg mode
const desktopQuery = window.matchMedia(`(min-width: ${desktopMinWidth}px)`);
desktopQuery.addEventListener('change', (event) => {
    if (event.matches) {
        setMenuState(false);
    }
});

toggleButton.addEventListener('click', () => {
    const isCurrentlyOpen =
        toggleButton.getAttribute('aria-expanded') === 'true';
    setMenuState(!isCurrentlyOpen);

    if (!isCurrentlyOpen) {
        dropdown.querySelector('a, button')?.focus();
    }
});

// Escape button close the dropdown menu when the user press it while it is open
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        const isMenuOpen =
            toggleButton.getAttribute('aria-expanded') === 'true';

        if (isMenuOpen) {
            setMenuState(false);
            toggleButton.focus();
        }
    }
});
