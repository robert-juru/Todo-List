import './style.css'

const menuButton = document.getElementById('menu-svg-button');
const nav = document.querySelector('aside');

menuButton.addEventListener('click', () => {
    nav.classList.toggle('show-aside');
});

let navButtons = document.querySelectorAll('.nav-btn');
let lastSelectedButton = null;

navButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (lastSelectedButton) {
            lastSelectedButton.classList.remove('button-selected');
        }
        button.classList.add('button-selected')
        lastSelectedButton = button;
    })
});
