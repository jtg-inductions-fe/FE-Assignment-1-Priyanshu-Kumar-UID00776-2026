// Coupons API endpoint
const COUPON_API_URL =
    'https://gist.githubusercontent.com/ameer-wajid-ali/1f29ebee4295cede36f8d74b45e576df/raw/122966c9a123861249f173911d8d93a76dc06d7a/';

// Local storage key names
const STORAGE_KEY_COUPONS = 'coupons';
const STORAGE_KEY_UNLOCKED = 'unlockedCoupons';
const STORAGE_KEY_ANGLE = 'wheelAngle';
const DEFAULT_DAYS = 7;
const MILLI_SECONDS_IN_ONE_SECOND = 1000;
const SECONDS_IN_ONE_MINUTE = 60;
const MINUTES_IN_ONE_HOUR = 60;
const HOURS_IN_ONE_DAY = 24;
const FULL_ROTATION_ANGLE = 360;
const NUMBER_OF_ROTATIONS = 5;
const COUPON_SETTING_TIME = 6000;

// Arrays and variables declaration
let coupons = [];
let unlockedCoupons = [];
let isSpinning = false;
let currentAngle = 0;
let isInitialized = false;

// Document elements declaration to be used anywhere
let wheelWrapper;
let dealsWheelContent;
let dealsWrapperContent;
let winningBannerContainer;
let dealsCounterBadge;

// Checks the coupon array is it valid or not
function isValidCouponArray(data) {
    if (!Array.isArray(data)) return false;

    for (const coupon of data) {
        // Checks if the coupon is object and also does it have the labe and promoCode if not return false
        if (
            !coupon ||
            typeof coupon !== 'object' ||
            !('label' in coupon) ||
            !('promoCode' in coupon)
        ) {
            return false;
        }
    }

    return true;
}

// Util function to validate the coupon getting from teh localStorage
const getLocalStorageItem = (
    key,
    validatorFunction = null,
    fallback = null,
) => {
    const item = localStorage.getItem(key);
    if (!item) return fallback;

    try {
        const parsed = JSON.parse(item);
        if (validatorFunction && !validatorFunction(parsed)) {
            return fallback;
        }
        return parsed;
    } catch {
        return fallback;
    }
};

// Initializes the spinner
export const initSpinner = () => {
    // Targetting the particular elements which are needed for spinner
    wheelWrapper = document.getElementById('deals-wheel-wrapper');
    dealsWheelContent = document.getElementById('deals-wheel');
    dealsWrapperContent = document.getElementById('deals-coupon-wrapper');
    winningBannerContainer = document.getElementById('latest-win-banner');
    dealsCounterBadge = document.getElementById('deals-btn-badge');

    // Reset winning banner container on modal open/initialization
    if (winningBannerContainer) {
        winningBannerContainer.innerHTML = '';
    }

    // Set default count to 0 for the counter badge
    if (dealsCounterBadge) {
        dealsCounterBadge.innerHTML = '0';
    }

    // If coupons from localstorage are available then parse them also verify them using the function isValidCouponArray so that the array fetched is valid
    coupons = getLocalStorageItem(STORAGE_KEY_COUPONS, isValidCouponArray, []);
    // If unlockedCoupons from localstorage are available then parse them also verify them using the function isValidCouponArray so that the array fetched is valid

    unlockedCoupons = getLocalStorageItem(
        STORAGE_KEY_UNLOCKED,
        isValidCouponArray,
        [],
    );

    // If rotationAngle from localstorage are available then parse them

    currentAngle = getLocalStorageItem(STORAGE_KEY_ANGLE, null, 0);

    // Position the wheel at its saved angle
    if (dealsWheelContent && currentAngle > 0) {
        dealsWheelContent.style.transition = 'none';
        dealsWheelContent.style.transform = `rotate(${currentAngle % 360}deg)`;
    }

    // Setup listeners the very first time the spinner initializes
    if (!isInitialized) {
        setupSpinListener();
        setupCopyListener();
        isInitialized = true;
    }

    // Render spinner from cache or fetch from API
    if (coupons.length > 0) {
        setSpinnerCoupons();
    } else {
        renderLoadingState(true);
    }

    // Fetches the coupons if there are new changes in teh coupons from the API
    fetchCoupons();

    updateCouponExpiryStatus();
};

// Promocode copy function
const setupCopyListener = () => {
    document.addEventListener('click', function (e) {
        const btn = e.target.closest('.coupon__copy');
        if (!btn) return;

        const code = btn
            .closest('.coupon')
            .querySelector('.coupon__code')
            .textContent.trim();

        // If we get the code then it copies
        if (code) {
            navigator.clipboard.writeText(code).then(() => {
                btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="30" height="30" viewBox="0 0 256 256" xml:space="preserve">
<g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
	<path d="M 33 78 c -2.303 0 -4.606 -0.879 -6.364 -2.636 l -24 -24 c -3.515 -3.515 -3.515 -9.213 0 -12.728 c 3.515 -3.515 9.213 -3.515 12.728 0 L 33 56.272 l 41.636 -41.636 c 3.516 -3.515 9.213 -3.515 12.729 0 c 3.515 3.515 3.515 9.213 0 12.728 l -48 48 C 37.606 77.121 35.303 78 33 78 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(54,206,61); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round"/>
</g>
</svg>`;
            });
        }
    });
};

// Create a valid time for the coupon
const validTime = (coupon) => {
    // Check if validFor exists to convert it to a number, or fallback to 7 days default
    const days =
        coupon && coupon.validFor != null
            ? Number(coupon.validFor)
            : DEFAULT_DAYS;

    // Check if issuedAt timestamp exists to parse it into Date object, or fallback to current time
    const issueDate = coupon.issuedAt ? new Date(coupon.issuedAt) : new Date();
    const now = new Date();

    // Calculate time difference in days
    const elapsedMs = now - issueDate;
    const elapsedDays = Math.floor(
        elapsedMs /
            (MILLI_SECONDS_IN_ONE_SECOND *
                SECONDS_IN_ONE_MINUTE *
                MINUTES_IN_ONE_HOUR *
                HOURS_IN_ONE_DAY),
    );
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
};

// Loading state renderer
const renderLoadingState = (isLoading, errorMessage = null) => {
    const spinButton = wheelWrapper?.querySelector('.deals__spin-button');

    if (isLoading) {
        // Hide the spin button if present
        if (spinButton) spinButton.style.display = 'none';

        // Clear existing slice markup and display simple centered loading text
        if (dealsWheelContent) {
            dealsWheelContent.innerHTML = `
                <div class="deals__wheel-loading">
                    Loading...
                </div>
            `;
        }
    } else if (errorMessage) {
        if (spinButton) spinButton.style.display = 'none';

        if (dealsWheelContent) {
            dealsWheelContent.innerHTML = `
                <div class="deals__wheel-loading">
                    ${errorMessage}
                </div>
            `;
        }
    } else {
        // Restore spin button display when loading is complete
        if (spinButton) spinButton.style.display = 'block';
    }
};

// Updates the coupon expiry whenever user open the website
const updateCouponExpiryStatus = () => {
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
};

// Fetches the coupon
const fetchCoupons = async () => {
    try {
        const response = await fetch(COUPON_API_URL);
        const data = await response.json();

        if (isValidCouponArray(data)) {
            // Compare stringified versions to see if data actually changed
            const hasChanged = JSON.stringify(coupons) !== JSON.stringify(data);

            // Refreshes UI with new coupons dynamically if there is changes
            if (hasChanged) {
                coupons = data;
                localStorage.setItem(
                    STORAGE_KEY_COUPONS,
                    JSON.stringify(coupons),
                );
                setSpinnerCoupons();
            }
            renderLoadingState(false);
        } else {
            throw new Error('Invalid coupon schema returned from API');
        }
    } catch {
        renderLoadingState(false, 'No coupons found');
    }
};

// Sets the coupons for each slice of the spinner
const setSpinnerCoupons = () => {
    // Filter master coupons array to keep only unclaimed coupons
    const validCoupons = coupons.filter(
        (coupon) =>
            !unlockedCoupons.some(
                (unlockedCoupon) =>
                    unlockedCoupon.promoCode === coupon.promoCode,
            ),
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

    // Array declared for the proper assigning of the class for each particular slice of the spinner
    const arr = ['top-left', 'top-right', 'bottom-right', 'bottom-left'];
    let index = 0;

    // Check if at least 4 unclaimed coupons are available to populate full wheel
    if (validCoupons.length >= 4) {
        dealsWheelContent.innerHTML = validCoupons
            .slice(0, 4)
            .map(
                (coupon) =>
                    `<div class="deals__wheel-content deals__wheel-content--${arr[index]}">
                <span class="deals__wheel-label--${arr[index++]}">${coupon.label}</span>
            </div>`,
            )
            .join('');
    }

    // When less than 4 coupons are available count the remainig coupon and adds the no deals available coupon also
    else {
        const remainingCoupon = validCoupons
            .map(
                (coupon) => `
        <div class="deals__wheel-content deals__wheel-content--${arr[index]}">
            <span class="deals__wheel-label--${arr[index++]}">${coupon.label}</span>
        </div>
    `,
            )
            .join('');

        let noDealCoupon = '';
        while (index < 4) {
            noDealCoupon += `
                    <div class="deals__wheel-content deals__wheel-content--${arr[index]}">
                        <span class="deals__wheel-label--${arr[index++]}">No deals Available</span>
                    </div>
                `;
        }

        // Adds up the both type of coupon and show in the spinner
        dealsWheelContent.innerHTML = remainingCoupon + noDealCoupon;
    }
};

// Sets up the unlockedCoupon array for the user
const setUnlockedCoupons = () => {
    dealsWrapperContent.innerHTML = unlockedCoupons
        .map((coupon) => {
            // Check if coupon is expired to apply blocked styling modifier
            const blockedCouponClass = coupon.isExpired
                ? 'coupon--blocked'
                : '';

            // Check if coupon is expired to apply blocked time text modifier
            const blockedTimeClass = coupon.isExpired
                ? 'coupon__time--blocked'
                : '';

            return `
                <div class="coupon ${blockedCouponClass}">
                    <div class="coupon__info">
                        <span class="coupon__title">${coupon.label}</span>
                        <span class="coupon__time ${blockedTimeClass}">${coupon.formattedTime}</span> 
                    </div>
                    <div class="coupon__code">${coupon.promoCode}</div>
                    <button type="button" aria-label="Copy Promo code" class="coupon__copy">
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
               </button>
                </div>
            `;
        })
        .join('');

    // Check if counter badge element exists before updating text
    if (dealsCounterBadge) {
        dealsCounterBadge.innerHTML = unlockedCoupons.length;
    }
};

// Renders the win coupon box when the users wins any coupon
const renderLatestWinner = (wonCoupon) => {
    // Exit early if winning banner container is missing
    if (!winningBannerContainer) return;

    // Handle No deals available state
    if (!wonCoupon) {
        winningBannerContainer.innerHTML = `
            <div class="coupon__no-deals">
                <span">No deal available for this spin.</span>
            </div>
        `;
        return;
    }

    // Handle winning coupon state
    winningBannerContainer.innerHTML = `
        <h4 class="deals__win-title" style="margin-top: 15px; text-align: center;">You Won!</h4>
        <div class="coupon">
            <div class="coupon__info">
                <span class="coupon__title">${wonCoupon.label}</span>
                <span class="coupon__time">${wonCoupon.formattedTime}</span> 
            </div>
            <div class="coupon__code">${wonCoupon.promoCode}</div>
            <button type="button" aria-label="Copy Promo code" class="coupon__copy">
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
            </button>
        </div>
    `;
};

// Provides the angle based on the randomIndex generation
const indexBasedAngleGenerator = (index) => {
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
};

// Rotation Logic for the spinner
const setupSpinListener = () => {
    wheelWrapper.addEventListener('click', function (event) {
        const spinBtn = event.target.closest('.deals__spin-button');
        // Ignore clicks if not on spin button OR wheel is currently spinning
        if (!spinBtn || isSpinning) return;

        // Clear the latest win banner when a new spin begins
        if (winningBannerContainer) {
            winningBannerContainer.innerHTML = '';
        }

        setSpinnerCoupons();

        // Filter master coupons array to get currently unclaimed coupons
        const validCoupons = coupons.filter(
            (c) => !unlockedCoupons.some((u) => u.promoCode === c.promoCode),
        );
        isSpinning = true;

        // Random number generation between 0 to 3
        const randomDegreeIndex = Math.floor(Math.random() * 4);

        // Angle creation for the rotation
        const fullRotations = FULL_ROTATION_ANGLE * NUMBER_OF_ROTATIONS;
        const totalRotation =
            fullRotations - indexBasedAngleGenerator(randomDegreeIndex);

        const hadPreviousAngle = currentAngle > 0;

        // Check if wheel has spun before to perform reset animation first
        if (hadPreviousAngle) {
            setSpinnerCoupons();
            const remainder = currentAngle % FULL_ROTATION_ANGLE;
            // Check if wheel is aligned at 0, otherwise calculate shortest distance to 360
            const distanceToZero =
                remainder === 0 ? 0 : FULL_ROTATION_ANGLE - remainder;
            currentAngle += distanceToZero;

            // Reset the spinner back to its original position with animation
            dealsWheelContent.style.transition =
                'transform 0.4s cubic-bezier(0.05, 0.7, 0.1, 1)';
            dealsWheelContent.style.transform = `rotate(${currentAngle}deg)`;

            setTimeout(() => {
                // Resets the transition and degree for the spinner to prevent the issue of overflow of the degree angle addition
                dealsWheelContent.style.transition = 'none';
                dealsWheelContent.style.transform = 'rotate(0deg)';
                currentAngle = totalRotation;

                // Spins the wheel to the target angle
                setTimeout(() => {
                    dealsWheelContent.style.transition =
                        'transform 5s cubic-bezier(0.1, 0.7, 0.1, 1)';
                    dealsWheelContent.style.transform = `rotate(${totalRotation}deg)`;
                }, 50);
            }, 50);
        }
        // Runs for the first spin done by the user
        else {
            currentAngle = totalRotation;
            dealsWheelContent.style.transition =
                'transform 5s cubic-bezier(0.1, 0.7, 0.1, 1)';
            dealsWheelContent.style.transform = `rotate(${totalRotation}deg)`;
        }

        // Sets up wonCoupon and issuedDate for the unlockedCoupon
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
            }

            renderLatestWinner(wonCoupon);
            isSpinning = false;
        }, COUPON_SETTING_TIME);
    });
};
