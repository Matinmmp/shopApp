
import Request from './Request.js';


const address = document.getElementById('address');
const orderList = document.getElementById('orderList');
const back = document.getElementById('back');
const shippingBox = document.getElementById('shippingBox');
const shipping = document.getElementById('shipping');
const amount = document.getElementById('amount');
const promo = document.getElementById('promo');
const totalPay = document.getElementById('totalPay');
const continueToPayment = document.getElementById('continueToPayment');


const prompInput = document.getElementById('prompInput');
const addPromo = document.getElementById('addPromo');
const promoBox = document.getElementById('promoList');


let shippingObj = localStorage.getItem('choosenShipping');
if (!shippingObj)
    shipping.textContent = `$ 0`;
else {
    shippingObj = JSON.parse(shippingObj)
    shipping.textContent = `$ ${shippingObj.pay}`;
}


const promoList = [];
let totalPrice = 0;

const Req = new Request({
    baseURL: 'http://localhost:3001',
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
});



let customer = JSON.parse(localStorage.getItem('customer'));
let orders = [];


address.addEventListener('click', () => {
    window.location.href = '../views/shippingaddress.html';
});

back.addEventListener('click', () => {
    window.location.href = '../views/cart.html';
});

addPromo.addEventListener('click', () => {

    if (prompInput.value === "a") {
       const pr = promoList.find(item => item.name === "a");
        if (!pr)
            promoList.push({ name: prompInput.value, amount: 30 });
        else
            alert('your promo is used');
        generatPromos(promoList);
    } else {
        alert("Your Promo is Wrong");
    }
    prompInput.value = "";
});

continueToPayment.addEventListener('click', () => {
    if (!shippingObj) {
        alert('Choose The Shipping Type');
        return;
    }
    window.location.href = '../views/payment.html';
});

function generatPromos(promos) {
    let p = 0;
    const list = promos.map((item, index) => {
        p += item.amount;
        return generatePromo(item, index)
    });
    promoBox.innerHTML = '';
    promoBox.append(...list);
    promo.textContent = `$ ${-totalPrice * (p / 100)}`

    totalPay.textContent = `$ ${totalPrice - (totalPrice * (p / 100)) + (shippingObj ? +shippingObj.pay : 0)}`;

}

function generatePromo(item, index) {
    const div = document.createElement('div');
    div.classList = 'bg-primary text-white p-3 px-4 rounded-full w-7/12 sm:w-3/12 lg:w-2/12  flex justify-between';
    div.innerHTML = ` <div>Discount ${item.amount}% Off </div> <i id="delete" class="bi bi-x ms-2 cursor-pointer"></i>`;
    div.querySelector('#delete').addEventListener('click', () => {
        promoList.splice(index, 1);
        generatPromos(promoList);
    });
    return div;
}


const getCustomer = async (id) => {
    const response = await Req.get(`/customer/${id}`);
    return await response;
}

customer = await getCustomer(customer._id);

function loadAddress() {

    let addr = localStorage.getItem('choosenAddress');
    if (!addr) {
        localStorage.setItem('choosenAddress', JSON.stringify(customer.customer_addres[0]));
        const key = Object.keys(customer.customer_addres[0])[0];
        address.querySelector('#address_name').textContent = key;
        address.querySelector('#address_des').textContent = customer.customer_addres[0][key];
    }
    else {
        addr = JSON.parse(addr);
        const key = Object.keys(addr);
        address.querySelector('#address_name').textContent = key;
        address.querySelector('#address_des').textContent = addr[key];
    }

}

function loadShipping() {
    let shipping = localStorage.getItem('choosenShipping');
    const div = document.createElement('div');
    if (!shipping) {
        div.className = 'flex items-center my-8 bg-white shadow-md shadow-gray-400 py-5 rounded-3xl ';
        div.innerHTML = `
        <div class="w-2/12 text-center ">
            <i class="bi bi-car-front-fill text-2xl"></i>
        </div>
        <div class="w-8/12 flex flex-col gap-2 px-2">
            <span class="text-secondary text-lg font-bold">Choose Shipping Type </span>
        </div>
        <div class="w-1/12">
            <i class="bi bi-chevron-right text-xl"></i>
        </div>`;
        div.addEventListener('click', () => {
            window.location.href = '../views/chooseshipping.html';
        });
    }
    else {
        shipping = JSON.parse(shipping);
        div.className = 'flex items-center my-2 bg-white shadow-md shadow-gray-400 py-5 rounded-3xl';
        div.innerHTML = `
        <div class="w-2/12 ps-1">
                <img src="../img/${shipping.img}" alt="">
            </div>
            <div class="w-6/12 flex flex-col gap-2 px-2">
                <span id="address_name" class="text-lg font-bold">${shipping.name}</span>
                <span id="address_des" class="text-secondary text-sm">${shipping.des} </span>
            </div>
            <div class="w-4/12 ps-6 flex gap-4 items-center">
                <div class= "text-lg font-bold"> $ ${shipping.pay}</div>
                <i class="bi bi-pencil-square"></i>
            </div>`;
        div.addEventListener('click', () => {
            window.location.href = '../views/chooseshipping.html';
        })
    }

    shippingBox.append(div)

}

loadAddress();
loadShipping();



//// Get Orders

const getOrders = async () => {
    const respons = await Req.get('/orderItem');
    let newList = respons.filter(item => item.customer_id === customer._id && item.orderItem_isOrdered === false);
    return newList;
}

const getProduct = async productId => {
    const respons = await Req.get(`/product/${productId}`);
    return await respons;
}

async function createObject() {
    orders = await getOrders();
    let products = [];
    totalPrice = 0;
    for (const element of orders) {
        const product = await getProduct(element.product_id);
        products.push([product, element]);
        totalPrice += element.orderItem_quantity * product.product_price;
    }
    amount.textContent = `$ ${totalPrice}`;
    if (!promoList.length) {
        promo.textContent = "$ 0"
    }
    totalPay.textContent = `$ ${totalPrice + (shippingObj ? +shippingObj.pay : 0)} `;
    generateOrders(products);
}

createObject();

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
            </div>

            <div class="flex items-center gap-4 text-secondary text-sm">
                <div  class="rounded-full w-5 h-5 " style="background-color:${order.orderItem_color} ;"></div>
                <div class=" h-4 w-[1px] bg-secondary"></div>
                <div > Size = ${order.orderItem_size}</div>
            </div>
            <div class="flex justify-between items-center">
                <span id="totalOrderPrice" class="text-lg text-primary font-bold">$ ${product.product_price * order.orderItem_quantity} </span>

                <div class=" bg-accent rounded-full  h-10 text-lg font-bold flex items-center ">
                    <span id="quantity" class=" px-3">${order.orderItem_quantity}</span>
                </div>
            </div>
        </div>
    </div>`;
    return section;
}