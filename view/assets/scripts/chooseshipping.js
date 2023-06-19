import Request from './Request.js';


const shippingList = document.getElementById('shippingList');
const back = document.getElementById('back');
const apply = document.getElementById('apply');


const Req = new Request({
    baseURL: 'http://localhost:3001',
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
});


const shipping = [
    {
        img: '../img/s1.png',
        name: 'Economy',
        des: 'Estimated Arrival, Dec 20-23',
        pay: '10'
    },
    {
        img: '../img/s2.png',
        name: 'Regular',
        des: 'Estimated Arrival, Dec 20-22',
        pay: '15'
    },
    {
        img: '../img/s3.png',
        name: 'Cargo',
        des: 'Estimated Arrival, Dec 20-21',
        pay: '20'
    },
    {
        img: '../img/s4.png',
        name: 'Express',
        des: 'Estimated Arrival, Dec 20-23',
        pay: '30'
    },
]

back.addEventListener('click',()=>{
    window.location.href = '../views/checkout.html';
});
apply.addEventListener('click',()=>{
    window.location.href = '../views/checkout.html';

})



function generateShippings(shipps) {
    const list = shipps.map((item, index) => generatesShipping(item, index));
    shippingList.innerHTML = '';

    shippingList.append(...list);
}

generateShippings(shipping);

function generatesShipping(item, index) {
    const div = document.createElement('div');
    div.className = 'flex items-center my-2 bg-white shadow-md shadow-gray-400 py-5 rounded-3xl';
    div.innerHTML = `
    <div class="w-2/12 ps-1">
                <img src="../img/${item.img}" alt="">
            </div>
            <div class="w-6/12 flex flex-col gap-2 px-2">
                <span id="address_name" class="text-lg font-bold">${item.name}</span>
                <span id="address_des" class="text-secondary text-sm">${item.des} </span>
            </div>
            <div class="w-4/12 ps-6 flex gap-4 items-center">
                <div class= "text-lg font-bold"> $ ${item.pay}</div>
                <input id="check" type="radio" name="radio-1" class="radio" ${index === 0 && 'checked '}  />
            </div>`;

    div.addEventListener('click', () => {
        div.querySelector('#check').checked = true;
        localStorage.setItem('choosenShipping', JSON.stringify(item));
    })
    return div;
}