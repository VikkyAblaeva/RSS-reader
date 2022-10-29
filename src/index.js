import './styles.scss';
import isValid from './utils.js';

const input = document.querySelector('input');
input.focus();

const label = document.querySelector('.validResult');
const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
    isValid(input.value)
    .then((result) => {
        result === false ? label.innerHTML = 'Ссылка должна быть валидным URL' : label.innerHTML = 'Valid';
    });
    
    event.preventDefault();

})
