const toggleButton = document.getElementById('header-toggle');
const dropdown = document.getElementById('header-dropdown');

const openIcon =
    toggleButton && dropdown && document.getElementById('toggle-icon-open');
const closeIcon =
    toggleButton && dropdown && document.getElementById('toggle-icon-close');

// Handling the dropdown menu state

function setMenuState(shouldOpen) {
    toggleButton.setAttribute('aria-expanded', shouldOpen);
    dropdown.hidden = !shouldOpen;

    dropdown.classList.toggle('header__dropdown--is-open', shouldOpen);
    document.body.classList.toggle('no-scroll', shouldOpen);

    openIcon.hidden = shouldOpen;
    closeIcon.hidden = !shouldOpen;
}

// Removing the menu state when goes into the lg mode

const desktopQuery = window.matchMedia('(min-width: 1024px)');
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
