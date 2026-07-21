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
    <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="#ffffff"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M28.38 0H11.62C4.34 0 0 4.34 0 11.62V28.36C0 35.66 4.34 40 11.62 40H28.36C35.64 40 39.98 35.66 39.98 28.38V11.62C40 4.34 35.66 0 28.38 0ZM30 30.5H10C9.18 30.5 8.5 29.82 8.5 29C8.5 28.18 9.18 27.5 10 27.5H30C30.82 27.5 31.5 28.18 31.5 29C31.5 29.82 30.82 30.5 30 30.5ZM30 21.5H10C9.18 21.5 8.5 20.82 8.5 20C8.5 19.18 9.18 18.5 10 18.5H30C30.82 18.5 31.5 19.18 31.5 20C31.5 20.82 30.82 21.5 30 21.5ZM30 12.5H10C9.18 12.5 8.5 11.82 8.5 11C8.5 10.18 9.18 9.5 10 9.5H30C30.82 9.5 31.5 10.18 31.5 11C31.5 11.82 30.82 12.5 30 12.5Z"
            fill="#5D50C6"
        />
    </svg>
`;

toggleButton.addEventListener('click', () => {
    isOpen = !isOpen;
    dropdown.classList.toggle('header__dropdown--is-open', isOpen);
    document.body.classList.toggle('no-scroll', isOpen);
    toggleButton.innerHTML = isOpen ? closeIcon : openIcon;
});
