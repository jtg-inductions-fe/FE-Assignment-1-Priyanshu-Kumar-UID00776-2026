const toggleButton = document.getElementById('header-toggle');
const dropdown = document.getElementById('header-dropdown');

const openIcon = toggleButton.querySelector('.toggle-icon-open');
const closeIcon = toggleButton.querySelector('.toggle-icon-close');

function setMenuState(shouldOpen) {
    toggleButton.setAttribute('aria-expanded', shouldOpen);
    dropdown.hidden = !shouldOpen;

    dropdown.classList.toggle('header__dropdown--is-open', shouldOpen);
    document.body.classList.toggle('no-scroll', shouldOpen);

    openIcon.hidden = shouldOpen;
    closeIcon.hidden = !shouldOpen;
}

toggleButton.addEventListener('click', () => {
    const isCurrentlyOpen =
        toggleButton.getAttribute('aria-expanded') === 'true';
    setMenuState(!isCurrentlyOpen);
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
