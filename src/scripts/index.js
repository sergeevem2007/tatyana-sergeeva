import '@/styles/index.scss';
import './helpers/focus-visible';
import * as bootstrap from 'bootstrap';
import WOW from 'wow.js';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
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

Swiper.use([Navigation, Pagination, Autoplay]);

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

const whomSlider = new Swiper('.whom-slider', {
	pagination: {
		el: '.swiper-pagination',
	},
	grabCursor: true,
	loop: true,
	slidesPerView: 1,
	spaceBetween: 10,
	autoplay: {
		delay: 2500,
		disableOnInteraction: false,
	},
	breakpoints: {
		576 : {
			slidesPerView: 3,
			spaceBetween: 20,
		},
		768 : {
			slidesPerView: 4,
			spaceBetween: 20,
		}
	}
});

const coursesReviewSlider = new Swiper('.courses-reviews-slider', {
	pagination: {
		el: '.swiper-pagination',
	},
	grabCursor: true,
	loop: true,
	slidesPerView: 1,
	spaceBetween: 20,
});

Fancybox.bind('[data-fancybox]', {
});

const setNameMask = el => {
	if (el.mask) throw Error(`${el} already masked`);

	el.mask = true;
	el.addEventListener('input', () => (el.value = el.value.replace(/\d/g, '')));
};

const isValidNumber = (number) => {
	const regexp = /^(?:\+7|8)?9(?:\d{9})$/;
	return regexp.test(number.replace(/ /g, ''));
};

/**
 * @name throttle
 * @param func {function} callback function
 * @param ms {number} delay
 * @returns function wrapper
 * @example let throttledExampleFunc = throttle(exampleFunc, 1000);
 */
const throttle = function (func, ms) {
	let isThrottled = false,
		savedArgs,
		savedThis;

	function wrapper() {
		if (isThrottled) {
			savedArgs = arguments;
			savedThis = this;
			return;
		}

		func.apply(this, arguments);

		isThrottled = true;

		setTimeout(function () {
			isThrottled = false;
			if (savedArgs) {
				wrapper.apply(savedThis, savedArgs);
				savedArgs = savedThis = null;
			}
		}, ms);
	}

	return wrapper;
};

/**
 * @name FormValidity
 * @param form {HTMLFormElement}
 */
class FormValidity {
	constructor(form, onSubmit = true) {
		this.form = form;
		this.fields = [];
		this.onSubmit = onSubmit;
		this.status = false;

		this.init();
	}

	init() {
		const nameField = this.form.querySelector('[name=name]'),
			phoneField = this.form.querySelector('[name=phone]'),
			policyField = this.form.querySelector('[name=user-policy]');

		if (nameField) this.fields.name = { input: nameField };
		if (phoneField) this.fields.phone = { input: phoneField };
		if (policyField) this.fields.policy = { input: policyField };

		this.bindListeners();
		this.setStatus();
	}

	toggleInvalid(input, status, message) {
		const inputMessageElement = input.closest('.form-group').querySelector('.form-text');

		if (status) {
			inputMessageElement.classList.remove('text-danger');
			inputMessageElement.classList.add('text-success');
			inputMessageElement.textContent = ' ';

			input.classList.remove('is-invalid');
			input.classList.add('is-valid');
		} else {
			inputMessageElement.classList.remove('text-success');
			inputMessageElement.classList.add('text-danger');
			inputMessageElement.textContent = message;

			input.classList.remove('is-valid');
			input.classList.add('is-invalid');
		}

		for (const field in this.fields) {
			if (this.fields[field].input === input) this.fields[field].status = status;
		}
	}

	validateName(min = 2, max = 50) {
		const { input } = this.fields.name,
			{ required } = input;

		if (required && input.value.length === 0) {
			this.toggleInvalid(input, false, 'Имя обязательное поле');
		} else if (input.value.match(/\d/) !== null) {
			this.toggleInvalid(input, false, 'Имя не должно содержать цифо');
		} else if (input.value.length > 0) {
			if (input.value.length < min) {
				this.toggleInvalid(input, false, `Имя должно содержать не менее ${min} букв`);
			} else if (input.value.length > max) {
				this.toggleInvalid(input, false, `Имя должно содержать не более ${max} букв`);
			} else {
				this.toggleInvalid(input, true);
			}
		}
	}

	throttleValidateName = throttle(this.validateName, 1000);

	validatePhone() {
		const { input } = this.fields.phone,
			{ required } = input;

		if (required && input.value.length === 0) {
			this.toggleInvalid(input, false, 'Телефон обязательное поле');
		} else if (input.value.length > 0) {
			if (!isValidNumber(input.value)) {
				this.toggleInvalid(input, false, 'Телефон введен некоректно');
			} else {
				this.toggleInvalid(input, true);
			}
		}
	}

	throttleValidatePhone = throttle(this.validatePhone, 1000);

	validatePolicy() {
		const { input } = this.fields.policy,
			{ required } = input;
		if (required && input.checked === false) {
			this.toggleInvalid(input, false, 'Соглашение с правилами политки обработки данных обязательный пункт!');
		} else {
			this.toggleInvalid(input, true);
		}
	}

	throttleValidatePolicy = throttle(this.validatePolicy, 1000);

	bindListeners() {
		if (this.onSubmit) {
			this.throttleValidateName();
			this.throttleValidatePhone();
			this.throttleValidatePolicy();
		}

		this.fields.name.input.addEventListener('input', () => {
			this.throttleValidateName();
		});
		this.fields.phone.input.addEventListener('input', () => {
			this.throttleValidatePhone();
		});
		this.fields.policy.input.addEventListener('input', () => {
			this.throttleValidatePolicy();
		});
	}

	setStatus() {
		this.status = true;

		for (const field in this.fields) {
			if (!this.fields[field].status) this.status = false;
		}
	}

	reset() {
		this.form.reset();

		for (const field in this.fields) {
			this.fields[field].input.classList.remove('is-valid');
		}
	}
}

/**
 * @name bsRequestResponse
 * @param status {Boolean}
 * @param title {String}
 * @param messages {Array}
 */
const bsRequestResponse = (status, title, messages) => {
	const template = document.getElementById('request-response').content.cloneNode(true),
		modalTitle = template.querySelector('.modal-title'),
		modalText = template.querySelector('.modal-text'),
		modalStart = template.querySelector('#modal-start');

	if (status) {
		modalTitle.classList.add('text-brown');
		modalStart.href = 'tg://resolve?domain=tanylienbot&start=c1720689597756-ds';
	} else {
		modalTitle.classList.add('text-danger');
	}

	modalTitle.textContent = title;

	for (const message of messages) {
		const messageEl = document.createElement('p');
		messageEl.classList.add('modal-paragraph');
		messageEl.textContent = message;

		modalText.appendChild(messageEl);
	}

	const div = document.createElement('div');
	div.appendChild(template);
	const modal = div.querySelector('.modal');
	const modalObjInst = new bootstrap.Modal(modal);
	modalObjInst.show();

	modal.addEventListener('hidden.bs.modal', function () {
		modal.remove();
		modalObjInst.dispose();
	});
};

const form = document.querySelector('.form');
if (form) {
	form.addEventListener('submit', function (e) {
		e.preventDefault();
		new Promise( resolve => {
			const validate = new FormValidity(this);
			resolve(validate);
		})
			.then(validate => {
				if (validate.status) {

					fetch('https://sheetdb.io/api/v1/bycl4paqrvil5', {
						method: 'POST',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							data: [
								{
									'name': `${form.querySelector('[name=name]').value}`,
									'phone': `${form.querySelector('[name=phone]').value}`,
									'date': 'DATETIME'
								}
							]
						})
					})
						.then((response) => {
							if (response) {
								if (response.status) {
									bsRequestResponse(true, 'Спасибо!', ['Ваша заявка успешно отправлена! Ваша ссылка для прохождения интенсива.']);

									validate.reset();
								} else {
									bsRequestResponse(false, 'Что-то пошло не так!', ['Проверьте корректность введенных данных и попробуйте заполнить форму заново.']);
								}
							}
						});
				}
			});
	});
}

const nameFields = document.querySelectorAll('[name=Name]');
if (nameFields.length > 0) nameFields.forEach(field => setNameMask(field));
