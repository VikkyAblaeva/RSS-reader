import './styles.scss';
import isValid from './utils.js';

const input = document.querySelector('input');
input.focus();
let links = [];
const renderLabel = (inputValue, result) => {
    
    if (result === true && links.includes(inputValue)) {
        return {
            label: {
                innerHTML: 'RSS уже существует',
                addClass: 'text-danger',
                removeClass: 'text-success',
            },
            input: {
                removeClass: 'is-valid',
                addClass: 'is-invalid',
            }
        };
    };
    if (result === true && !links.includes(inputValue)) {
        links.push(inputValue);
        return {
            label: {
                innerHTML: 'RSS успешно загружен',
                addClass: 'text-success',
                removeClass: 'text-danger',
            },
            input: {
                removeClass: 'is-invalid',
                addClass: 'is-valid',
            }
        };
    };
    if (result === false) {
        return {
            label: {
                innerHTML: 'Ссылка должна быть валидным URL',
                addClass: 'text-danger',
                removeClass: 'text-success',
            },
            input: {
                removeClass: 'is-valid',
                addClass: 'is-invalid',
            }
        };
    };
}

const label = document.querySelector('.validResult');
const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
    isValid(input.value)
    .then((result) => {
        const render = renderLabel(input.value, result);
        label.innerHTML = render.label.innerHTML;
        input.classList.remove(render.input.removeClass);
        input.classList.add(render.input.addClass);
        label.classList.remove(render.label.removeClass);
        label.classList.add(render.label.addClass);
    });
    
    event.preventDefault();

})
