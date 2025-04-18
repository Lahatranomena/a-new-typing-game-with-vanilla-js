const toggleButton = document.getElementById('toggle-mode');
const body = document.body;
const darkModeClass = 'dark-mode';
const lightModeClass = 'light-mode';
const whiteIcon = document.querySelector('.white-icon');
const blackIcon = document.querySelector('.black-icon');

const savedMode = localStorage.getItem('theme');

if (savedMode === darkModeClass) {
    body.classList.add(darkModeClass);
} else {
    body.classList.add(lightModeClass);
}

toggleButton.addEventListener('click', () => {
    if (body.classList.contains(darkModeClass)) {
        body.classList.remove(darkModeClass);
        body.classList.add(lightModeClass);
        localStorage.setItem('theme', lightModeClass);
    } else {
        body.classList.remove(lightModeClass);
        body.classList.add(darkModeClass);
        localStorage.setItem('theme', darkModeClass);
    }
});

