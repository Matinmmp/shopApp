import Request from './Request.js';
import generateProduct from './productGenerator.js';

const productsBox = document.getElementById('productsBox');
const back = document.getElementById('back');
const title = document.getElementById('title');
const param = new URLSearchParams(window.location.search);
const brandName = param.get('name')
title.textContent = brandName;


const Req = new Request({
    baseURL: 'http://localhost:3001',
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
});
localStorage.setItem('url', `${window.location.href}`);

back.addEventListener('click', () => {
    window.location.href = '../views/home.html';
});


let productList = [];



const getPopularProducts = async () => {
    const response = await Req.get('/product/sort/descending');
    return await response;
}

productList = await getPopularProducts();

generateProducts(productList, brandName);




// for generating most popular products

// function generateProduct(product) {
//     const div = document.createElement('div');
//     div.innerHTML = `
//     <div class="w-[150px] h-[150px] bg-accent rounded-3xl flex">
//         <img src="../img/${product.product_image_urls[1]}" class="w-[80%] h-[80%] m-auto" alt="">
//     </div>
//     <div class="text-primary">
//     <h4 class="text-lg font-semibold break whitespace-nowrap">${product.product_name}</h4>
//     <span class=" font-semibold">$ 85.00</span>
//     </div>`;
//     div.classList = 'w-[150px] h-[200px]';
//     return div;
// }

function generateProducts(productList, fillterByName) {

    let list = [];
    if (fillterByName)
        list = productList.filter(item => item.product_brand === fillterByName).map(item => generateProduct(item));
    else {
        list = productList.slice(0, 10).map(item => generateProduct(item));
    }

    productsBox.innerHTML = "";
    productsBox.append(...list);
}

