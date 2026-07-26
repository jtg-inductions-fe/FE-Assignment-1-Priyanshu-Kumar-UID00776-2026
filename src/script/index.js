const statsData = [
    {
        value: '500+',
        label: 'Holiday Package',
    },
    {
        value: '100',
        label: 'Luxury Hotel',
        badge: true,
    },
    {
        value: '7',
        label: 'Premium Airlines',
    },
    {
        value: '2k+',
        label: 'Happy Customer',
    },
];

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

function createStatCard(stat) {
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
}

function renderStats() {
    const container = document.querySelector('.travel-point__cards-wrapper');
    if (!container) return;

    statsData.forEach((stat) => {
        container.appendChild(createStatCard(stat));
    });
}

renderStats();
