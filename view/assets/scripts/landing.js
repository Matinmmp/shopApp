const loading = document.getElementById('loading');
const navigation = document.getElementById('navigation');
const swappers = document.querySelectorAll('.swapper > div');
const stpes = document.querySelectorAll('.my-step > div');
const loadingFlag = localStorage.getItem('loadingFlag');
const btn_next = document.querySelector('.btn-next');
let counter = 0;
loadSteps();

btn_next.addEventListener('click', () => {
    counter++;
    loadSteps();
});

function loadSteps() {
    stpes.forEach((item, index) => {
        item.classList = 'bg-secondary w-14 h-2 rounded-3xl ';
        if (index === counter)
            item.classList = 'bg-primary w-14 h-2 rounded-3xl ';
        if (counter === 2) btn_next.textContent = 'Get Started';
        if (counter === 3) btn_next.href = '../views/login.html';
    });

    swappers.forEach((item, index) => {
        item.classList = 'w-0 overflow-hidden';
        if (index === counter) item.classList = 'w-full';
    });
}

if (!loadingFlag) localStorage.setItem('loadingFlag', false);
else {
    navigation.classList.add('navigate');
}
