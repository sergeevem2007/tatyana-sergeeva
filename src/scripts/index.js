import '@/styles/index.scss';
import * as bootstrap from 'bootstrap';
import './helpers/focus-visible';
import WOW from 'wow.js';

document.addEventListener('DOMContentLoaded', () => {
	new WOW({
		mobile: false
	}).init();
});

window.bootstrap = bootstrap;


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
