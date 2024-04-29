import '@/styles/index.scss';
import * as bootstrap from 'bootstrap';
import './helpers/focus-visible';
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
	// grabCursor: true,
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


// form
const fetchRequest = async function (url, options) {
	return await fetch(url, options)
		.then(response => {
			return response;
		})
		.then(res => {
			if (res) return res.json();
		})
		.catch(err => {
			return err;
		});
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
 * @name triggerEvent
 * @description - trigger event like jquery .trigger();
 * @param el {HTMLElement} - DOM element
 * @param event {string} - event name (click, change, etc)
 * @param options {object} - event options (bubbles {boolean}, cancelable {boolean}, composed {boolean})
 * @return dispatch event
 */
const triggerEvent = (el, event, options = { bubbles: true, cancelable: false }) => {
	return el.dispatchEvent(new Event(event, options));
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
		const nameField = this.form.querySelector('[name=user-name]'),
			phoneField = this.form.querySelector('[name=user-phone]'),
			emailField = this.form.querySelector('[name=user-email]'),
			policyField = this.form.querySelector('[name=user-policy]');

		if (nameField) this.fields.name = { input: nameField };
		if (emailField) this.fields.email = { input: emailField };
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
			this.toggleInvalid(input, false, 'Имя не должно содержать цифр');
		} else if (input.value.length > 0) {
			if (input.value.length < min) {
				this.toggleInvalid(input, false, `Имя должно быть не менее ${min} букв`);
			} else if (input.value.length > max) {
				this.toggleInvalid(input, false, `Имя должно быть не более ${max} букв`);
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
			if (!input.mask.isValidNumber()) {
				this.toggleInvalid(input, false, 'Телефон введен некоректно');
			} else {
				this.toggleInvalid(input, true);
			}
		}
	}

	throttleValidatePhone = throttle(this.validatePhone, 1000);

	validateEmail() {
		const { input } = this.fields.email,
			{ required } = input;

		if (required && input.value.length === 0) {
			this.toggleInvalid(input, false, 'Email field is required');
		} else if (!required && input.value.length === 0) {
			this.toggleInvalid(input, true);
		} else if (input.value.length > 0) {
			const re =
				/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if (!re.test(input.value.trim())) {
				this.toggleInvalid(input, false, 'Email field is not valid');
			} else {
				this.toggleInvalid(input, true);
			}
		}
	}

	throttleValidateEmail = throttle(this.validateEmail, 1000);

	validatePolicy() {
		const { input } = this.fields.policy,
			{ required } = input;
		if (required && input.checked === false) {
			this.toggleInvalid(input, false, 'Policy field is required');
		} else {
			this.toggleInvalid(input, true);
		}
	}

	throttleValidatePolicy = throttle(this.validatePolicy, 1000);

	bindListeners() {
		if (this.onSubmit) {
			this.throttleValidateName();
			this.throttleValidateEmail();
			this.throttleValidatePhone();
			this.throttleValidatePolicy();
		}

		this.fields.name.input.addEventListener('input', () => {
			this.throttleValidateName();
		});
		this.fields.phone.input.addEventListener('input', () => {
			this.throttleValidatePhone();
		});
		this.fields.resume?.input.addEventListener('input', () => {
			 this.throttleValidateResume();
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
		modalText = template.querySelector('.modal-text');

	if (status) {
		modalTitle.classList.add('text-success');
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

const formSubmit = form => {
	form.addEventListener('submit', function (e) {
		e.preventDefault();

		new Promise(resolve => {
			const validate = new FormValidity(this);
			resolve(validate);
		}).then(validate => {
			if (validate.status) {
				fetchRequest('form.php', {
					method: 'post',
					body: new FormData(form),
					headers: new Headers({
						'X-Requested-With': 'XMLHttpRequest',
					}),
					credentials: 'same-origin',
				}).then(response => {
					if (response) {
						if (response.status) {
							bsRequestResponse(true, 'Заявка успешно отправлена!', ['Наш менеджер скоро свяжется с вами.']);

							validate.reset();

							const modal = form.closest('.modal');
							if (modal) modal.bsModalInst.hide();
						} else {
							bsRequestResponse(false, 'Что-то пошло не так!', [...Object.values(response.messages)]);
						}
					}
				});
			}
		});
	});
};
const throttleFormSubmit = throttle(formSubmit, 1000);

const createCallbackModal = () => {
	const template = document.getElementById('callback').content.cloneNode(true);

	const div = document.createElement('div');
	div.appendChild(template);

	const callback = div.querySelector('.modal');
	callback.bsModalInst = new bootstrap.Modal(callback);
	callback.bsModalInst.show();

	callback.addEventListener('hidden.bs.modal', function () {
		callback.remove();
		callback.bsModalInst.dispose();
	});

	return callback;
};

const nameFields = document.querySelectorAll('[name=user-name]');
if (nameFields.length > 0) nameFields.forEach(field => setNameMask(field));

const phoneFields = document.querySelectorAll('[name=user-phone]');
if (phoneFields.length > 0) phoneFields.forEach(field => setPhoneMask(field));

const forms = document.querySelectorAll('.form');
if (forms.length > 0) forms.forEach(form => throttleFormSubmit(form));

/** Callback in modal */
document.addEventListener('click', e => {
	let that = e.target;

	if (that.matches('[data-callback]') || that.closest('[data-callback]')) {
		e.preventDefault();

		new Promise(resolve => {
			resolve(createCallbackModal());
		}).then(modal => {
			if (modal) {
				setNameMask(modal.querySelector('[name=user-name]'));
				setPhoneMask(modal.querySelector('[name=user-phone]'));
				throttleFormSubmit(modal.querySelector('.modal-form'));
			}
		});
	}
});
