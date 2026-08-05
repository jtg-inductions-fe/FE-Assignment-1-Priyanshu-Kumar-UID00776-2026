// Coupons API endpoint
const COUPON_API_URL =
    'https://gist.githubusercontent.com/ameer-wajid-ali/1f29ebee4295cede36f8d74b45e576df/raw/122966c9a123861249f173911d8d93a76dc06d7a/';

// Local storage key names
const STORAGE_KEY_COUPONS = 'coupons';
const STORAGE_KEY_UNLOCKED = 'unlockedCoupons';
const STORAGE_KEY_ANGLE = 'wheelAngle';

let coupons = [];
let unlockedCoupons = [];
let isSpinning = false;
let currentAngle = 0;

let wheelWrapper;
let dealsWheelContent;
let dealsWrapperContent;
let winningBannerContainer;
let dealsCounterBadge;

export function initSpinner() {
    wheelWrapper = document.getElementById('deals-wheel-wrapper');
    dealsWheelContent = document.getElementById('deals-wheel');
    dealsWrapperContent = document.getElementById('deals-coupon-wrapper');
    winningBannerContainer = document.getElementById('latest-win-banner');
    dealsCounterBadge = document.getElementById('deals-btn-badge');

    // Directly read and parse from localStorage on initialization
    const storedCoupons = localStorage.getItem(STORAGE_KEY_COUPONS);
    const storedUnlocked = localStorage.getItem(STORAGE_KEY_UNLOCKED);
    const storedAngle = localStorage.getItem(STORAGE_KEY_ANGLE);

    // If coupons from localstorage are available then parse them
    if (storedCoupons) {
        try {
            coupons = JSON.parse(storedCoupons);
        } catch {
            coupons = [];
        }
    }
    // If unlockedCoupons from localstorage are available then parse them
    if (storedUnlocked) {
        try {
            unlockedCoupons = JSON.parse(storedUnlocked);
        } catch {
            unlockedCoupons = [];
        }
    }
    // If rotationAngle from localstorage are available then parse them
    if (storedAngle) {
        try {
            currentAngle = JSON.parse(storedAngle);
        } catch {
            currentAngle = 0;
        }
    }

    // Position the wheel at its saved angle
    if (dealsWheelContent && currentAngle > 0) {
        dealsWheelContent.style.transition = 'none';
        dealsWheelContent.style.transform = `rotate(${currentAngle % 360}deg)`;
    }

    setupSpinListener();

    // Render spinner from cache or fetch from API
    if (coupons.length > 0) {
        setSpinnerCoupons();
    } else {
        renderLoadingState(true);
        fetchCoupons();
    }

    updateCouponExpiryStatus();
    setupCopyListener();
}

// Promocode copy function
function setupCopyListener() {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.deals__coupon-copy');

        const code = btn
            .closest('.deals__coupon')
            ?.querySelector('.deals__coupon-code')
            ?.textContent?.trim();
        // If we get the code then it copies
        if (code) {
            navigator.clipboard
                .writeText(code)
                .then(() => alert('Code copied!'));
        }
    });
}

function validTime(coupon) {
    // Check if validFor exists to convert it to a number, or fallback to 7 days default
    const days =
        coupon && coupon.validFor != null ? Number(coupon.validFor) : 7;

    // Check if issuedAt timestamp exists to parse it into Date object, or fallback to current time
    const issueDate = coupon.issuedAt ? new Date(coupon.issuedAt) : new Date();
    const now = new Date();

    // Calculate time difference in days
    const elapsedMs = now - issueDate;
    const elapsedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
    const remainingDays = days - elapsedDays;

    // Check if remaining validity days reached zero or less
    if (remainingDays <= 0) {
        return {
            text: 'Expired',
            isExpired: true,
        };
    }

    return {
        text: `Expires in ${remainingDays}d`,
        isExpired: false,
    };
}

function renderLoadingState(state) {
    // Check if loading state is true or shows loading
    if (state) {
        dealsWheelContent.innerHTML = `
            <div class="deals__wheel-content">
                <span>Loading...</span>
            </div>
        `;
    }
}

function updateCouponExpiryStatus() {
    // Exit early if user has no unlocked coupons
    if (unlockedCoupons.length === 0) return;

    unlockedCoupons.forEach((coupon) => {
        const status = validTime(coupon);
        coupon.formattedTime = status.text;
        coupon.isExpired = status.isExpired;
    });

    // Save updated expiry states to localStorage
    localStorage.setItem(STORAGE_KEY_UNLOCKED, JSON.stringify(unlockedCoupons));

    setUnlockedCoupons();
}

async function fetchCoupons() {
    try {
        renderLoadingState(true);
        const response = await fetch(COUPON_API_URL);
        coupons = await response.json();
        renderLoadingState(false);

        // Save fetched API coupons directly to localStorage
        localStorage.setItem(STORAGE_KEY_COUPONS, JSON.stringify(coupons));
        setSpinnerCoupons();
    } catch {
        renderLoadingState(false);
    }
}

function setSpinnerCoupons() {
    // Filter master coupons array to keep only unclaimed coupons
    const validCoupons = coupons.filter(
        (c) => !unlockedCoupons.some((u) => u.promoCode === c.promoCode),
    );

    // Check if master list is populated and all coupons have been unlocked
    if (coupons.length > 0 && validCoupons.length === 0) {
        wheelWrapper.innerHTML = `
            <div class="deals__empty-state">
                <h3>No more deals available</h3>
                <p>You've unlocked all coupons. Come back later for new offers.</p>
            </div>
        `;
        return;
    }

    // Check if at least 4 unclaimed coupons are available to populate full wheel
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

function setUnlockedCoupons() {
    dealsWrapperContent.innerHTML = unlockedCoupons
        .map((coupon) => {
            // Check if coupon is expired to apply blocked styling modifier
            const blockedCouponClass = coupon.isExpired
                ? 'deals__coupon--blocked'
                : '';

            // Check if coupon is expired to apply blocked time text modifier
            const blockedTimeClass = coupon.isExpired
                ? 'deals__coupon-time--blocked'
                : '';

            return `
                <div class="deals__coupon ${blockedCouponClass}">
                    <div class="deals__coupon-info">
                        <span class="deals__coupon-title">${coupon.label}</span>
                        <span class="deals__coupon-time ${blockedTimeClass}">${coupon.formattedTime}</span> 
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
            `;
        })
        .join('');

    // Check if counter badge element exists before updating text
    if (dealsCounterBadge) {
        dealsCounterBadge.innerHTML = unlockedCoupons.length;
    }
}

function renderLatestWinner(wonCoupon) {
    // Exit early if winning banner container or wonCoupon is missing
    if (!winningBannerContainer || !wonCoupon) return;

    winningBannerContainer.innerHTML = `
        <h4 class="deals__win-title" style="margin-top: 15px; text-align: center;">You Won!</h4>
        <div class="deals__coupon">
            <div class="deals__coupon-info">
                <span class="deals__coupon-title">${wonCoupon.label}</span>
                <span class="deals__coupon-time">${wonCoupon.formattedTime}</span> 
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
    // Angle generation for index 0
    if (index === 0) {
        targetAngle = 315;
    }
    // Angle generation for index 1
    else if (index === 1) {
        targetAngle = 45;
    }
    // Angle generation for index 2
    else if (index === 2) {
        targetAngle = 135;
    }
    // Angle generation for index 3
    else {
        targetAngle = 225;
    }
    return targetAngle;
}

function setupSpinListener() {
    wheelWrapper.addEventListener('click', function (event) {
        const spinBtn = event.target.closest('.deals__spin-button');
        // Ignore clicks if not on spin button OR wheel is currently spinning
        if (!spinBtn || isSpinning) return;

        // Filter master coupons array to get currently unclaimed coupons
        const validCoupons = coupons.filter(
            (c) => !unlockedCoupons.some((u) => u.promoCode === c.promoCode),
        );
        isSpinning = true;

        const randomDegreeIndex = Math.floor(Math.random() * 4);

        const fullRotations = 360 * 5;
        const totalRotation =
            fullRotations - indexBasedAngleGenerator(randomDegreeIndex);

        const hadPreviousAngle = currentAngle > 0;

        // Check if wheel has spun before to perform reset animation first
        if (hadPreviousAngle) {
            setSpinnerCoupons();
            const remainder = currentAngle % 360;
            // Check if wheel is aligned at 0, otherwise calculate shortest distance to 360
            const distanceToZero = remainder === 0 ? 0 : 360 - remainder;
            currentAngle += distanceToZero;

            dealsWheelContent.style.transition = 'transform 1s ease-in-out';
            dealsWheelContent.style.transform = `rotate(${currentAngle}deg)`;

            setTimeout(() => {
                dealsWheelContent.style.transition = 'none';
                dealsWheelContent.style.transform = 'rotate(0deg)';
                currentAngle = totalRotation;

                setTimeout(() => {
                    dealsWheelContent.style.transition =
                        'transform 5s cubic-bezier(0.1, 0.7, 0.1, 1)';
                    dealsWheelContent.style.transform = `rotate(${totalRotation}deg)`;
                }, 50);
            }, 1000);
        } else {
            currentAngle = totalRotation;
            dealsWheelContent.style.transition =
                'transform 5s cubic-bezier(0.1, 0.7, 0.1, 1)';
            dealsWheelContent.style.transform = `rotate(${totalRotation}deg)`;
        }

        setTimeout(() => {
            const wonCoupon = validCoupons[randomDegreeIndex];
            // Check if selected segment index corresponds to a valid unclaimed coupon
            if (wonCoupon) {
                wonCoupon.issuedAt = new Date();

                const status = validTime(wonCoupon);
                wonCoupon.formattedTime = status.text;
                wonCoupon.isExpired = status.isExpired;
                unlockedCoupons.push(wonCoupon);

                // Directly save updated coupons and currentAngle to localStorage
                localStorage.setItem(
                    STORAGE_KEY_UNLOCKED,
                    JSON.stringify(unlockedCoupons),
                );
                localStorage.setItem(
                    STORAGE_KEY_ANGLE,
                    JSON.stringify(currentAngle),
                );

                setUnlockedCoupons();
                renderLatestWinner(wonCoupon);
            }

            isSpinning = false;
        }, 6000);
    });
}
