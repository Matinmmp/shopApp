import Request from './Request.js';


const title = document.getElementById('title');
const description = document.getElementById('description');
const sizeList = document.getElementById('sizeList');
const colorList = document.getElementById('colorList');
const imagesList = document.getElementById('imagesList');
const price = document.getElementById('price');
const dec = document.getElementById('dec');
const quantity = document.getElementById('quantity');
const inc = document.getElementById('inc');
const totalPrice = document.getElementById('totalPrice');
const heart = document.getElementById('heart');
const back = document.getElementById('back');
const addToCart = document.getElementById('addToCart');

let colorChosed;
let sizeChosed;

const url = localStorage.getItem('url');

let quantityNumber = 0;

const param = new URLSearchParams(window.location.search);
const productId = param.get('id');
let product;
const customer = JSON.parse(localStorage.getItem('customer'));

const Req = new Request({
    baseURL: 'http://localhost:3001',
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
});




back.addEventListener('click', () => {
    window.location.href = url;
});

const getProductDetail = async id => {
    const response = await Req.get(`/product/${id}`);
    response.id = response._id;
    if (response.product_isliked === true)
        heart.src = '../img/heartred_24px.png';
    else heart.src = '../img/heart_24px.png';
    return await response;
}

const putProduct = async product => {

    await Req.edit(`/product/${product._id}`, product);
}

product = await getProductDetail(productId);


heart.addEventListener('click', () => {
    product.product_isliked = !product.product_isliked;

    putProduct(product)

    if (product.product_isliked === true)
        heart.src = '../img/heartred_24px.png';
    else heart.src = '../img/heart_24px.png';
})


dec.addEventListener('click', () => {
    if (quantityNumber > 0)
        quantityNumber--;
    quantity.textContent = quantityNumber;
    totalPrice.textContent = `$ ${quantityNumber * product.product_price}`;

});

inc.addEventListener('click', () => {
    quantityNumber++;
    quantity.textContent = quantityNumber;
    totalPrice.textContent = `$ ${quantityNumber * product.product_price}`;

});


////// Adding product to cart

const postOrderitem = async item => {
    const res = await Req.post('/orderItem', item);
    console.log(res);
}

addToCart.addEventListener('click', () => {
    if (quantity.textContent <= 0) {
        alert('increase quantity to one');
        return;
    }
    const orderItemObject = {
        product_id: productId,
        customer_id: customer._id,
        orderItem_color: colorChosed,
        orderItem_size: sizeChosed,
        orderItem_quantity: `${quantity.textContent}`,
        orderItem_totalPrice: quantity.textContent * product.product_price,
        orderItem_status: false,
        orderItem_address: customer.customer_addres[0],
        orderItem_shipping: '',
        orderItem_payment: '',
        orderItem_isOrdered:false
    }
    postOrderitem(orderItemObject).then(data => {
        const res = confirm(`
        its Add to your cart
         Do you want to go cart ?????`);
         if(res){
            window.location.href = '../views/cart.html';
            localStorage.setItem('url','http://127.0.0.1:5500/view/assets/views/home.html');
         }
    })
});






loadDate(product);

function loadDate(product) {
    title.textContent = product.product_name;
    description.textContent = product.product_description;
    price.textContent = `$ ${product.product_price}`;
    colorChosed = product.product_colors[0];
    sizeChosed = product.product_sizes[0];
    generateSizes(product.product_sizes, product.product_sizes[0]);
    generateColors(product.product_colors, product.product_colors[0]);
    generateImages(product.product_image_urls);
}



// load Size
function generateSizes(sizes, chosenSize) {
    const list = sizes.map(item => generateSize(item, chosenSize, sizes));
    sizeList.innerHTML = "";
    sizeList.append(...list);
}

function generateSize(size, chosenSize, sizes) {
    const div = document.createElement('div');
    div.innerHTML = `
    <div class="flex flex-col items-center justify-center gap-2 cursor-pointer ">
        <div class="size ${size === chosenSize ? "active" : ""} ">
        ${size}
        </div>
    </div>`;
    div.addEventListener('click', () => {
        generateSizes(sizes, size);
        sizeChosed = size;
    });
    return div;
}



// load color

function generateColor(color, chosenColor, colors) {
    const div = document.createElement('div');
    div.innerHTML = `
        <div class="flex flex-col items-center justify-center gap-2 cursor-pointer ">
            <div class="w-12 h-12 rounded-full flex items-center justify-center text-primary text-3xl"  style="background-color:${color} ;">
            ${color === chosenColor ? '<i class="bi bi-check-lg"></i>' : ""}
            </div>
        </div>`;

    div.addEventListener('click', () => {
        generateColors(colors, color);
        colorChosed = color;
    })
    return div;
}

function generateColors(colors, chosenColor) {
    const list = colors.map(item => generateColor(item, chosenColor, colors));
    colorList.innerHTML = "";
    colorList.append(...list);
}



//load image

function generateImage(image) {
    const div = document.createElement('div');
    div.classList = ' swiper-slide flex';
    div.innerHTML = `
    <div style="background-color:#F3F3F3!important;">
    <div class="w-[70%] h-[70%] m-auto ">
        <img src="../img/${image}" class="w-full h-full " alt="">
    </div>
    </div>`;

    return div;
}

function generateImages(images) {
    const list = images.map(item => generateImage(item));

    imagesList.innerHTML = "";
    imagesList.append(...list);
}





