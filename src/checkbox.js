const Theme = {
    LIGHT: 'light-theme',
    DARK: 'dark-theme',
};

const querySelector = {
    input: document.querySelector('.toggle--checkbox'),
    body: document.querySelector('body'),
    text: document.querySelector('body')
};



if (!localStorage.getItem('theme')) {
    localStorage.setItem('theme', Theme.LIGHT)
    querySelector.body.classList.remove(Theme.DARK)
    querySelector.body.classList.add(Theme.LIGHT)

    querySelector.input.checked = false
}

if (localStorage.getItem('theme') === Theme.DARK) {
    querySelector.input.checked = true
    querySelector.body.classList.remove(Theme.LIGHT)
    querySelector.body.classList.add(Theme.DARK)
} else {
    querySelector.input.checked = false
    querySelector.body.classList.remove(Theme.DARK)
    querySelector.body.classList.add(Theme.LIGHT)

}



const a = () => {
    // querySelector.body.classList.toggle(Theme.DARK)
    if (localStorage.getItem('theme') === Theme.LIGHT) {
        console.log(`Ви вибрали ${Theme.DARK}🌑!`);
        localStorage.setItem('theme', Theme.DARK)
        querySelector.body.classList.remove(Theme.LIGHT)
        querySelector.body.classList.add(Theme.DARK)
    }
    else {
        console.log(`Ви вибрали ${Theme.LIGHT}🌞!`);
        localStorage.setItem('theme', Theme.LIGHT)
        querySelector.body.classList.remove(Theme.DARK)
        querySelector.body.classList.add(Theme.LIGHT)
    }
    // localStorage.getItem('theme') === querySelector.body.className || Theme.LIGHT;
}

querySelector.input.addEventListener('change', a);