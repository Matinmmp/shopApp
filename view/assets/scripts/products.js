import Request from './Request.js';

const mpBrandsBox = document.getElementById('mpBrandsBox');
const productsBox = document.getElementById('productsBox');
const back = document.getElementById('back');

const Req = new Request({
    baseURL: 'http://localhost:3001',
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
});


back.addEventListener('click', () => {
    window.location.href = "../views/home.html";
});



let brandList = [];
let productList = [];

const getBrands = async () => {
    const response = await Req.get('/brand');
    return await response;
};

const getPopularProducts = async () => {
    const response = await Req.get('/product/sort/descending');
    return await response;
}

brandList = await getBrands();
productList = await getPopularProducts();


generateMPBrands(brandList);
generateProducts(productList);



// for generating most popular brands

function generateMPBrand(brand, chosenBrand = "All") {
    const span = document.createElement('span');
    span.className = 'brand_item ';
    if (brand.brand_name === chosenBrand)
        span.className = 'brand_item active';

    span.addEventListener('click', () => {
        generateMPBrands(brandList,brand.brand_name);
        generateProducts(productList,brand.brand_name !== "All" && brand.brand_name);
    });

    span.textContent = brand.brand_name;
    return span;
}

function generateMPBrands(brnadList, chosenBrand) {
    const list = [...brnadList];
    list.unshift({ brand_name: 'All' });
    const brands = list.map(item => generateMPBrand(item, chosenBrand));

    mpBrandsBox.innerHTML = '';
    mpBrandsBox.append(...brands);
}



// for generating most popular products

function generateProduct(product) {
    const div = document.createElement('div');
    div.innerHTML = `
    <div class="w-[150px] h-[150px] bg-accent rounded-3xl flex">
        <img src="../img/${product.product_image_urls[1]}" class="w-[80%] h-[80%] m-auto" alt="">
    </div>
    <div class="text-primary">
    <h4 class="text-lg font-semibold break whitespace-nowrap">${product.product_name}</h4>
    <span class=" font-semibold">$ 85.00</span>
    </div>`;
    div.classList = 'w-[150px] h-[200px]';
    return div;
}

function generateProducts(productList, fillterByName) {
    
    let list = [];
    if (fillterByName )
        list = productList.filter(item => item.product_brand === fillterByName).map(item => generateProduct(item));
    else {
        list = productList.slice(0, 10).map(item => generateProduct(item));
    }

    productsBox.innerHTML = "";
    productsBox.append(...list);
}

