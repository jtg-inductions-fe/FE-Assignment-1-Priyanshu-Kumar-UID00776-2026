const toggleButton = document.getElementById('header-toggle');
const dropdown = document.getElementById('header-dropdown');

let isOpen = false;

const closeIcon = `
    <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        stroke="#ffffff"
    >
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
            <path
                d="M6 6L18 18"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
            ></path>
            <path
                d="M18 6L6 18"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
            ></path>
        </g>
    </svg>
`;

const openIcon = `
   <span class="icon"></span>
`;

toggleButton.addEventListener('click', () => {
    isOpen = !isOpen;
    dropdown.classList.toggle('header__dropdown--is-open', isOpen);
    document.body.classList.toggle('no-scroll', isOpen);
    toggleButton.innerHTML = isOpen ? closeIcon : openIcon;
});
