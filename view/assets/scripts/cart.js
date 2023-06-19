
import Request from './Request.js';


const orderList = document.getElementById('orderList');
const addToCart = document.getElementById('addToCart');
const totalPriceEl = document.getElementById('totalPrice');
const removeBakcground = document.getElementById('removeBakcground');
const removeSlider = document.getElementById('removeSlider');
const removeItemBox = document.getElementById('removeItemBox');
const cancelRemoveItem = document.getElementById('cancelRemoveItem');
const yesRemoveItem = document.getElementById('yesRemoveItem');
const search = document.getElementById('search');


const customer = JSON.parse(localStorage.getItem('customer'));
let deleteItme_orderId;

let orders = [];



const Req = new Request({
    baseURL: 'http://localhost:3001',
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
});


addToCart.addEventListener('click', () => {
    if (orders.length)
    {
        window.location.href = '../views/checkout.html'
    }
});

search.addEventListener('input', () => {
    createObject(search.value);
});

removeSlider.addEventListener('click', (event) => {
    event.stopPropagation();
})

removeBakcground.addEventListener('click', (event) => {

    setTimeout(() => removeBakcground.classList.add('hidden'), 300);
    removeSlider.classList.add('translate-y-[45vh]');
});

cancelRemoveItem.addEventListener('click', () => {
    setTimeout(() => removeBakcground.classList.add('hidden'), 300);
    removeSlider.classList.add('translate-y-[45vh]');
});

yesRemoveItem.addEventListener('click', () => {
    setTimeout(() => removeBakcground.classList.add('hidden'), 300);
    removeSlider.classList.add('translate-y-[45vh]');
    deleteOrder(deleteItme_orderId);
});

const getOrders = async () => {
    const respons = await Req.get('/orderItem');
    let newList = respons.filter(item => item.customer_id === customer._id && item.orderItem_isOrdered === false);
    console.log(newList);
    return newList;
}

const getProduct = async productId => {
    const respons = await Req.get(`/product/${productId}`);
    return await respons;
}


async function createObject(filter) {
    orders = await getOrders();
    let products = [];
    let totalPrice = 0;
    for (const element of orders) {
        const product = await getProduct(element.product_id);
        products.push([product, element]);
        totalPrice += element.orderItem_quantity * product.product_price;
    }
    if (orders.length < 1) {
        addToCart.classList.add('opacity-40');

    } else
        addToCart.classList.remove('opacity-40');
    totalPriceEl.textContent = `$ ${totalPrice}`;

    if (filter) {
        products = products.filter(item => item[0].product_name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()));
    }
    generateOrders(products);
}

createObject();

function removeItemGenerator(product, order) {
    deleteItme_orderId = order;
    const section = document.createElement('section');
    section.classList = 'bg-white rounded-3xl w-full h-[9rem] shadow-md shadow-accent';
    section.innerHTML = `
    <div class="flex w-full h-full p-4">
        <div class="w-28 h-28 bg-accent rounded-3xl p-2">
            <div class="h-full w-full">
                <img  src="../img/${product.product_image_urls[0]}" alt="" class="w-full h-full">
            </div>
        </div>
        <div class="flex flex-col gap-3 w-8/12 ps-4 py-2">  
            <div class="flex items-center justify-between w-full">
                <span  class="text-xl text-primary font-bold">${product.product_name}</span>
            </div>

            <div class="flex items-center gap-4 text-secondary text-sm">
                <div  class="rounded-full w-5 h-5 " style="background-color:${order.orderItem_color} ;"></div>
                <div class=" h-4 w-[1px] bg-secondary"></div>
                <div > Size = ${order.orderItem_size}</div>
            </div>
            <div class="flex justify-between items-center">
                <span id="totalOrderPrice" class="text-lg text-primary font-bold">$ ${product.product_price * order.orderItem_quantity} </span>

                <div class=" bg-accent rounded-full  h-10 text-lg font-bold flex items-center ">
                    <span id="dec"  class=" px-3">-</span>
                    <span id="quantity" class=" px-3">${order.orderItem_quantity}</span>
                    <span id="inc" class=" px-3">+</span>
                </div>
            </div>
        </div>
    </div>`;

    section.querySelector('#dec').addEventListener('click', async () => {
        decreaseOrder(order);
        removeItemGenerator(product, order);
    });

    section.querySelector('#inc').addEventListener('click', async () => {
        increaseOrder(order);
        removeItemGenerator(product, order);
    });

    removeItemBox.innerHTML = "";
    removeItemBox.append(section);
}

function generateOrders(orders) {
    const list = orders.map(item => generateOrder(item[0], item[1]));

    orderList.innerHTML = "";
    orderList.append(...list);
}

function generateOrder(product, order) {
    const section = document.createElement('section');
    section.classList = 'bg-white rounded-3xl w-full h-[9rem] shadow-md shadow-accent';
    section.innerHTML = `
    <div class="flex w-full h-full p-4">
        <div class="w-28 h-28 bg-accent rounded-3xl p-2">
            <div class="h-full w-full">
                <img  src="../img/${product.product_image_urls[0]}" alt="" class="w-full h-full">
            </div>
        </div>
        <div class="flex flex-col gap-3 w-8/12 ps-4 py-2">  
            <div class="flex items-center justify-between w-full">
                <span  class="text-xl text-primary font-bold">${product.product_name}</span>
                <i id="delete" class="bi bi-trash3 cursor-pointer"></i>
            </div>

            <div class="flex items-center gap-4 text-secondary text-sm">
                <div  class="rounded-full w-5 h-5 " style="background-color:${order.orderItem_color} ;"></div>
                <div class=" h-4 w-[1px] bg-secondary"></div>
                <div > Size = ${order.orderItem_size}</div>
            </div>
            <div class="flex justify-between items-center">
                <span id="totalOrderPrice" class="text-lg text-primary font-bold">$ ${product.product_price * order.orderItem_quantity} </span>

                <div class=" bg-accent rounded-full  h-10 text-lg font-bold flex items-center ">
                    <span id="dec"  class=" px-3">-</span>
                    <span id="quantity" class=" px-3">${order.orderItem_quantity}</span>
                    <span id="inc" class=" px-3">+</span>
                </div>
            </div>
        </div>
    </div>`;

    section.querySelector('#dec').addEventListener('click', async () => {
        decreaseOrder(order);
    });

    section.querySelector('#inc').addEventListener('click', async () => {
        increaseOrder(order);
    });

    section.querySelector('#delete').addEventListener('click', () => {
        removeBakcground.classList.remove('hidden');
        setTimeout(() => removeSlider.classList.remove('translate-y-[45vh]'), 100);
        removeItemGenerator(product, order);
    });

    return section;
}

async function decreaseOrder(order) {
    if (order.orderItem_quantity === '1') {
        const res = confirm('It Will Delete');
        if (!res) return;
        deleteOrder(order);
    }
    if (order.orderItem_quantity > 1) {
        let quan = order.orderItem_quantity;
        quan--;
        order.orderItem_quantity = String(quan);
        const response = await Req.edit(`/orderItem/${order._id}`, order);
        createObject();
    }
}

async function increaseOrder(order) {
    let quan = order.orderItem_quantity;
    quan++;
    order.orderItem_quantity = String(quan);
    const response = await Req.edit(`/orderItem/${order._id}`, order);
    createObject();
}


async function deleteOrder(order) {
    await Req.delete(`/orderItem/${order._id}`);
    createObject();
}



