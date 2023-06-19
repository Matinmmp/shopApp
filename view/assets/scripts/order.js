import Request from './Request.js';

const activeTab = document.getElementById('activeTab');
const completedTab = document.getElementById('completedTab');
const notFound = document.getElementById('notFound');
const resualtList = document.getElementById('resualtList');
const search = document.getElementById('search');

const Req = new Request({
    baseURL: 'http://localhost:3001',
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
});



let tab = 'active';
search.value = '';
createObject(undefined);

search.addEventListener('input', () => {
    createObject(search.value);
});


activeTab.addEventListener('click', async () => {
    activeTab.classList.add('tab-active')
    completedTab.classList.remove('tab-active');
    tab = 'active';
    createObject(undefined);
});

completedTab.addEventListener('click', async () => {
    activeTab.classList.remove('tab-active')
    completedTab.classList.add('tab-active');
    tab = 'completed';
    createObject(undefined);
});


async function getOrders(tab) {
    const response = await Req.get('/orderItem');
    let list = response.filter(item => item.orderItem_isOrdered === true);
    if (tab === 'active') {
        list = list.filter(item => item.orderItem_status === false);
    } else {
        list = list.filter(item => item.orderItem_status === true);
    }
    if (list.length) {
        notFound.classList.replace('block', 'hidden');
        resualtList.classList.replace('hidden', 'grid');
    } else {
        notFound.classList.replace('hidden', 'block');
        resualtList.classList.replace('grid', 'hidden');
    }
    return await list;
}


function generateActiveOrders(orders) {
    const list = orders.map(item => generateActiveOrder(item[0], item[1]));
    resualtList.innerHTML = '';
    resualtList.append(...list);
}

function generateActiveOrder(product, order) {
    const section = document.createElement('section');
    section.classList = 'bg-white rounded-3xl w-full h-[9rem] shadow-md shadow-secondary';
    section.innerHTML = `
    <div class="flex w-full h-full p-4">
        <div class="w-28 h-32 bg-accent rounded-3xl p-2">
            <div class="h-full w-full">
                <img  src="../img/${product.product_image_urls[0]}" alt="" class="w-full h-full">
            </div>
        </div>
        <div class="flex flex-col gap-[2px] w-8/12 ps-4 py-2">  
            <div class="flex items-center justify-between w-full">
                <span  class="text-xl text-primary font-bold">${product.product_name}</span>
            </div>

            <div class="flex items-center gap-2 text-secondary text-sm">
                <div  class="rounded-full w-5 h-5 " style="background-color:${order.orderItem_color} ;"></div>
                <div class=" h-4 w-[1px] bg-secondary"></div>
                <div > Size = ${order.orderItem_size}</div>
                <div class=" h-4 w-[1px] bg-secondary"></div>
                <div> Qty = ${order.orderItem_quantity}</div>
            </div>
            <div >
                <div class="bg-accent py-1 px-2 text-xs rounded-md w-24">${tab === "active" ? "In Delivery " : "Completed"} </div>
            </div>
            <div class="flex justify-between items-center">
                <span id="totalOrderPrice" class="text-lg text-primary font-bold">$ ${product.product_price * order.orderItem_quantity} </span>

                <div class=" bg-accent rounded-full h-10 flex items-center ">
                    <div class="bg-primary py-2 px-3 text-white text-xs rounded-full">${tab === "active" ? "Track Order" : "Leave Review"} </div>
                </div>
            </div>
        </div>
    </div>`;
    return section;
}

const getProduct = async productId => {
    const respons = await Req.get(`/product/${productId}`);
    return await respons;
}

async function createObject(filter) {
    const orders = await getOrders(tab);
    let products = [];
    for (const element of orders) {
        const product = await getProduct(element.product_id);
        products.push([product, element]);
    }
    if (filter) {
        products = products.filter(item => item[0].product_name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()));
    }
    generateActiveOrders(products);
}