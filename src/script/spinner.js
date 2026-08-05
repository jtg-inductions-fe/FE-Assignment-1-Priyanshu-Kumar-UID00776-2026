const COUPON_API_URL =
    'https://gist.githubusercontent.com/ameer-wajid-ali/1f29ebee4295cede36f8d74b45e576df/raw/122966c9a123861249f173911d8d93a76dc06d7a/';

let coupons = [];
let unlockedCoupons = [];
let isSpinning = false;
let currentAngle = 0;

let wheelWrapper;
let wheel;
let dealsWheelContent;
let dealsWrapperContent;
let winningBannerContainer;

export function initSpinner() {
    wheelWrapper = document.getElementById('deals-wheel-wrapper');
    wheel = wheelWrapper.querySelector('.deals__wheel');
    dealsWheelContent = document.getElementById('deals-wheel');
    dealsWrapperContent = document.getElementById('deals-coupon-wrapper');
    winningBannerContainer = document.getElementById('latest-win-banner');

    setupSpinListener();
    renderLoadingState();
    fetchCoupons();
}

function renderLoadingState(state) {
    if (state) {
        dealsWheelContent.innerHTML = `
            <div class="deals__wheel-content">
                <span>Loading...</span>
            </div>
        `;
    }
}

async function fetchCoupons() {
    try {
        renderLoadingState(true);
        const response = await fetch(COUPON_API_URL);
        coupons = await response.json();
        renderLoadingState(false);
        setSpinnerCoupons();
    } catch {
        renderLoadingState(false);
    }
}

function setSpinnerCoupons() {
    const validCoupons = coupons.filter(
        (c) => !unlockedCoupons.some((u) => u.promoCode === c.promoCode),
    );

    if (validCoupons.length >= 4) {
        dealsWheelContent.innerHTML = validCoupons
            .slice(0, 4)
            .map(
                (coupon) =>
                    `<div class="deals__wheel-content">
                <span>${coupon.label}</span>
            </div>`,
            )
            .join('');
    } else {
        const remainingCoupon = validCoupons
            .map(
                (coupon) => `
        <div class="deals__wheel-content">
            <span>${coupon.label}</span>
        </div>
    `,
            )
            .join('');

        const noDealCoupon = Array(Math.max(0, 4 - validCoupons.length))
            .fill(
                `
            <div class="deals__wheel-content">
                <span>No deals Available</span>
            </div>
        `,
            )
            .join('');

        dealsWheelContent.innerHTML = remainingCoupon + noDealCoupon;
    }
}

function formatRemainingDays(days) {
    if (days === null || days === undefined) {
        return '7d';
    }
    return `${days}d`;
}

function setUnlockedCoupons() {
    dealsWrapperContent.innerHTML = unlockedCoupons
        .map(
            (coupon) => `
        <div class="deals__coupon">
            <div class="deals__coupon-info">
                <span class="deals__coupon-title">${coupon.label}</span>
                <span class="deals__coupon-time">Expires in ${coupon.formattedDays}</span> 
            </div>
            <div class="deals__coupon-code">${coupon.promoCode}</div>
            <div class="deals__coupon-copy">
                <svg width="32" height="32" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_2456_791)">
                        <path d="M9.33337 16.0002H8.66671C8.31309 16.0002 7.97395 15.8597 7.7239 15.6096C7.47385 15.3596 7.33337 15.0205 7.33337 14.6668V8.66683C7.33337 8.31321 7.47385 7.97407 7.7239 7.72402C7.97395 7.47397 8.31309 7.3335 8.66671 7.3335H14.6667C15.0203 7.3335 15.3595 7.47397 15.6095 7.72402C15.8596 7.97407 16 8.31321 16 8.66683V9.3335M13.3334 12.0002H19.3334C20.0698 12.0002 20.6667 12.5971 20.6667 13.3335V19.3335C20.6667 20.0699 20.0698 20.6668 19.3334 20.6668H13.3334C12.597 20.6668 12 20.0699 12 19.3335V13.3335C12 12.5971 12.597 12.0002 13.3334 12.0002Z" stroke="#F4436C" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_2456_791">
                            <rect width="16" height="16" fill="white" transform="translate(6 6)"/>
                        </clipPath>
                    </defs>
                </svg>
            </div>
        </div>
    `,
        )
        .join('');
}

function renderLatestWinner(wonCoupon) {
    if (!winningBannerContainer || !wonCoupon) return;

    winningBannerContainer.innerHTML = `
        <h4 class="deals__win-title" style="margin-top: 15px; text-align: center;">You Won!</h4>
        <div class="deals__coupon">
            <div class="deals__coupon-info">
                <span class="deals__coupon-title">${wonCoupon.label}</span>
                <span class="deals__coupon-time">Expires in ${wonCoupon.formattedDays}</span> 
            </div>
            <div class="deals__coupon-code">${wonCoupon.promoCode}</div>
            <div class="deals__coupon-copy">
                <svg width="32" height="32" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_2456_791)">
                        <path d="M9.33337 16.0002H8.66671C8.31309 16.0002 7.97395 15.8597 7.7239 15.6096C7.47385 15.3596 7.33337 15.0205 7.33337 14.6668V8.66683C7.33337 8.31321 7.47385 7.97407 7.7239 7.72402C7.97395 7.47397 8.31309 7.3335 8.66671 7.3335H14.6667C15.0203 7.3335 15.3595 7.47397 15.6095 7.72402C15.8596 7.97407 16 8.31321 16 8.66683V9.3335M13.3334 12.0002H19.3334C20.0698 12.0002 20.6667 12.5971 20.6667 13.3335V19.3335C20.6667 20.0699 20.0698 20.6668 19.3334 20.6668H13.3334C12.597 20.6668 12 20.0699 12 19.3335V13.3335C12 12.5971 12.597 12.0002 13.3334 12.0002Z" stroke="#F4436C" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_2456_791">
                            <rect width="16" height="16" fill="white" transform="translate(6 6)"/>
                        </clipPath>
                    </defs>
                </svg>
            </div>
        </div>
    `;
}

function indexBasedAngleGenerator(index) {
    let targetAngle;
    if (index === 0) {
        targetAngle = 315;
    } else if (index === 1) {
        targetAngle = 45;
    } else if (index === 2) {
        targetAngle = 135;
    } else {
        targetAngle = 225;
    }
    return targetAngle;
}

function setupSpinListener() {
    wheelWrapper.addEventListener('click', function (event) {
        const spinBtn = event.target.closest('.deals__spin-button');
        if (!spinBtn || isSpinning) return;

        const validCoupons = coupons.filter(
            (c) => !unlockedCoupons.some((u) => u.promoCode === c.promoCode),
        );
        isSpinning = true;

        const randomDegreeIndex = Math.floor(Math.random() * 4);

        const fullRotations = 360 * 5;
        const totalRotation =
            fullRotations - indexBasedAngleGenerator(randomDegreeIndex);

        const hadPreviousAngle = currentAngle > 0;

        if (hadPreviousAngle) {
            setSpinnerCoupons();
            const remainder = currentAngle % 360;
            const distanceToZero = remainder === 0 ? 0 : 360 - remainder;
            currentAngle += distanceToZero;

            wheel.style.transition = 'transform 1s ease-in-out';
            wheel.style.transform = `rotate(${currentAngle}deg)`;

            setTimeout(() => {
                wheel.style.transition = 'none';
                wheel.style.transform = 'rotate(0deg)';
                currentAngle = totalRotation;

                setTimeout(() => {
                    wheel.style.transition =
                        'transform 5s cubic-bezier(0.1, 0.7, 0.1, 1)';
                    wheel.style.transform = `rotate(${totalRotation}deg)`;
                }, 50);
            }, 1000);
        } else {
            currentAngle = totalRotation;
            wheel.style.transition =
                'transform 5s cubic-bezier(0.1, 0.7, 0.1, 1)';
            wheel.style.transform = `rotate(${totalRotation}deg)`;
        }

        setTimeout(() => {
            const wonCoupon = validCoupons[randomDegreeIndex];
            if (wonCoupon) {
                wonCoupon.formattedDays = formatRemainingDays(
                    wonCoupon.validFor,
                );
                unlockedCoupons.push(wonCoupon);
                setUnlockedCoupons();
                renderLatestWinner(wonCoupon);
            }

            isSpinning = false;
        }, 6000);
    });
}
