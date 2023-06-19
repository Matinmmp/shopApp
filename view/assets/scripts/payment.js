import Request from './Request.js';

const confirmPayment = document.getElementById('confirmPayment');
const viewOrder = document.getElementById('viewOrder');
const back = document.getElementById('back');

const Req = new Request({
    baseURL: 'http://localhost:3001',
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
});


const setOrders = async () => {
    const response = await Req.get('/orderItem');

    for (const item of response) {
        item.orderItem_isOrdered = true;
        await Req.edit(`/orderItem/${item._id}`,item);
    }
}

viewOrder.addEventListener('click',()=>{
    window.location.href = '../views/order.html';
});

confirmPayment.addEventListener('click', () => {
    setOrders();
    localStorage.setItem('choosenAddress',"");
    localStorage.setItem('choosenShipping','');
});

back.addEventListener('click',()=>{
    window.location.href = '../views/checkout.html';
});