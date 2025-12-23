import { throttle } from "./libs/utils";
import "./polyfills.js";
import "./blocks.js";
import Swiper from "swiper";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

// Функции

const setScroll = (value) => {
	if(value === "disable") {
		document.body.classList.add('disable-scroll');
	} else {
		document.body.classList.remove('disable-scroll');
	}
}


// Единицы высоты (ширины) экрана
function updateVH() {
	const { height = window.innerHeight, width = window.innerWidth } = window.visualViewport || {};

	document.documentElement.style.setProperty('--vh', `${height * 0.01}px`);
	['resize', 'orientationchange'].forEach(event => {
		window.addEventListener(event, throttle(updateVH, 200), { passive: true });
	});
}

// Ширина скроллбара
const setScrollbarWidth = () => {
	document.documentElement.style.setProperty('--sw', `${window.innerWidth - document.documentElement.clientWidth}px`);
}

const setSwipers = () => {
	const promoSwiper = new Swiper('.promo__swiper', {
		modules: [Autoplay, Pagination],
		slidesPerView: 1,
		loop: true,
		spaceBetween: 38,
		autoplay: {
			delay: 3000,
			disableOnInteraction: false,
		}
	});
	const catalogSwiper = new Swiper('.catalog-row__items', {
		modules: [Navigation],
		slidesPerView: 1,
		spaceBetween: 8,
		navigation: {
			nextEl: '.catalog-row__navigation-btn_next',
			prevEl: '.catalog-row__navigation-btn_prev',
		},
		breakpoints: {
			780: {
				slidesPerView: 2,
				spaceBetween: 16
			},
			1100: {
				slidesPerView: 3,
				spaceBetween: 24
			},
			1400: {
				slidesPerView: 4,
				spaceBetween: 32
			}
		}
	});
}

const detailScript = () => {
	const detail = document.querySelector('.detail');
	if (!detail) return;

	const detailSwiper = new Swiper('.detail__gallery-items', {
		modules: [Navigation],
		slidesPerView: 6,
		spaceBetween: 8,
		loop: true,
		navigation: {
			nextEl: '.detail__gallery-btn_next',
			prevEl: '.detail__gallery-btn_prev',
		},
	});

	detailSwiper.slides.forEach(slide => {
		slide.addEventListener('click', () => {
			detailSwiper.slides.forEach(s => s.classList.remove('swiper-slide-active'));
			slide.classList.add('swiper-slide-active');
			setActualImg(slide);
		});
	});

	const setActualImg = (slide) => {
		if (slide) {
			detail.querySelector('.detail__gallery-main img').src = slide.src;
			detail.querySelector('.detail__gallery-main img').classList.remove('hidden');
		} else {
			const img = detailSwiper.slides[detailSwiper.activeIndex];
			detail.querySelector('.detail__gallery-main img').src = img.src;
			detail.querySelector('.detail__gallery-main img').classList.remove('hidden');
		}
	}

	detailSwiper.on('slideChange', () => {
		setActualImg();
	})
}

const setPaymentForm = () => {
	const lists = document.querySelectorAll('.payment__list');
	const radios = document.querySelectorAll('input[name="delivery"]');

	const updateLists = () => {
		const value = document.querySelector('input[name="delivery"]:checked')?.value;

		lists.forEach(list => list.classList.remove('active'));

		if (value === 'true') {
			document.querySelector('.payment__list_courier')?.classList.add('active');
		}

		if (value === 'false') {
			document.querySelector('.payment__list_address')?.classList.add('active');
		}
	};

	radios.forEach(radio => radio.addEventListener('change', updateLists));
	updateLists();
};

const setHeaderCatalog = () => {
	const header = document.querySelector('.header');
	if(!header) return;

	const headerModal = header.querySelector('.header__modal');
	const headerCatalog = header.querySelector('.header__catalog');
	const headerCatalogClose = header.querySelector('.header__catalog-close');
	const headerCatalogOpen = header.querySelector('.header__catalog-button');

	const openCatalog = () => {
		headerModal.classList.add('active');
		setScroll('disable');
	}

	const closeCatalog = () => {
		headerModal.classList.remove('active');
		setScroll('enable');
	}

	headerCatalogOpen.addEventListener('click', openCatalog);
	headerCatalogClose.addEventListener('click', closeCatalog);
}

// Запуск функций
document.addEventListener('DOMContentLoaded', () => {
	updateVH();
	setScrollbarWidth();
	setSwipers();
	detailScript();
	setPaymentForm();
	setHeaderCatalog();
})