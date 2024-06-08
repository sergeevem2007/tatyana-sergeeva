import '@/styles/index.scss';
import './helpers/focus-visible';
import * as bootstrap from 'bootstrap';
import WOW from 'wow.js';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import { Fancybox } from '@fancyapps/ui';

document.addEventListener('DOMContentLoaded', () => {
	new WOW({
		mobile: false
	}).init();
});

const costRadio = () => {

	const costRadios = document.querySelector('.cost__radios');
	const costRadio = document.querySelectorAll('[data-cost-radio]');
	const costPrice = document.querySelectorAll('[data-cost-price]');

	if (costRadios) {
		costRadios.addEventListener('click', (event) => {
			if (event.target.dataset.costRadio) {
				costRadio.forEach( item => {
					item.dataset.costRadio == event.target.dataset.costRadio ? item.classList.add('active') : item.classList.remove('active');
				});
				costPrice.forEach( item => {
					item.dataset.costPrice == event.target.dataset.costRadio ? item.classList.remove('d-none') : item.classList.add('d-none');
				});
				console.log(event.target.dataset.costRadio);
			}

		});
	}
};

costRadio();

Swiper.use([Navigation]);

const reviewsSlider = new Swiper('.reviews-slider', {
	navigation: {
		enabled: true,
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
	grabCursor: true,
	autoHeight: true,
	loop: true,
	slidesPerView: 1,
	spaceBetween: 10,
	breakpoints: {
		768 : {
			slidesPerView: 2,
			spaceBetween: 20,
		}
	}
});

const diplomsSlider = new Swiper('.diploms-slider', {
	navigation: {
		enabled: true,
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
	// grabCursor: true,
	loop: true,
	slidesPerView: 2,
	spaceBetween: 10,
	breakpoints: {
		768 : {
			slidesPerView: 4,
			spaceBetween: 20,
		}
	}
});

Fancybox.bind('[data-fancybox]', {
});
