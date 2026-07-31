// Import styles bundles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/a11y';

import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay, A11y } from 'swiper/modules';
import { testimonialMockData } from '../MOCK_DATA/testimonialMock.js';

const SLIDES_PER_VIEW = 1;
const DELAY = 5000;
const SPACE_BETWEEN = 3;

// Card renderer function defined locally
const renderTestimonials = (data) => {
    const container = document.getElementById('testimonial-slider-wrapper');
    if (!container) return;

    // Handling the stars logic max is 5 stars if less than 5 will be replaced by the unfilled stars
    container.innerHTML = data
        .map((item) => {
            let starIcons = '';
            const totalStars = 5;

            // Looping all over the
            for (let i = 0; i < totalStars; i++) {
                if (i < item.stars) {
                    starIcons += `<span class="icon-star6"></span>`;
                } else {
                    starIcons += `<span class="icon-star-dull"></span>`;
                }
            }

            return `
      <div class="swiper-slide">
        <div class="testimonial__card">
          <img class="testimonial__avatar" src="${item.avatar}" alt="" />
          <div class="testimonial__user-info">
            <span class="testimonial__user-info-name">${item.name}</span>
            <span class="testimonial__user-info-role"> / ${item.role}</span>
          </div>
          <div class="testimonial__stars">
            ${starIcons}
          </div>
          <p class="testimonial__text">${item.text}</p>
        </div>
      </div>
    `;
        })
        .join('');
};

export const initTestimonialSwiper = () => {
    // Render cards into DOM first
    renderTestimonials(testimonialMockData);

    // Initialize Swiper
    new Swiper('.testimonial__swiper', {
        modules: [Navigation, Pagination, Autoplay, A11y],
        slidesPerView: SLIDES_PER_VIEW,
        spaceBetween: SPACE_BETWEEN,
        loop: true,
        autoplay: {
            delay: DELAY,
            pauseOnMouseEnter: true,
            disableOnInteraction: false,
        },
        navigation: {
            prevEl: '.testimonial__nav--prev',
            nextEl: '.testimonial__nav--next',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        a11y: {
            enabled: true,
            paginationBulletMessage: 'Go to testimonial {{index}}',
        },
    });
};
