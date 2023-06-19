import Request from './Request.js';


const productsBox = document.getElementById('productsBox');
const mpBrandsBox = document.getElementById('mpBrandsBox');
const search = document.getElementById('search');


const Req = new Request({
    baseURL: 'http://localhost:3001',
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
});

productsBox.innerHTML = ""

let productList = [];
let brandList = [];


localStorage.setItem('url', `${window.location.href}`);


const getPopularProducts = async (filter = "All") => {

    let response = await Req.get('/product/sort/descending');

    response = await response.filter(item => item.product_isliked === true);
    console.log(response);
    if (filter !== 'All') {
        response = response.filter(item => item.product_brand === filter)
    }

    return await response;
}

const getBrands = async () => {
    const response = await Req.get('/brand');
    return await response;
};


const back = document.getElementById('back');

back.addEventListener('click', () => {
    window.location.href = "../views/home.html";
});




productList = await getPopularProducts();
brandList = await getBrands();

generateMPBrands(brandList);

generateProducts(productList, undefined);

function generateProduct(product) {
    const a = document.createElement('a');
    a.href = `../views/productdetail.html?id=${product._id}`;
    a.innerHTML = `
    <div class="w-[150px] h-[150px] bg-accent rounded-3xl flex">
        <img src="../img/${product.product_image_urls[1]}" class="w-[80%] h-[80%] m-auto" alt="">
        <img src="../img/heartred_24px.png" class="absolute top-2 right-2 "/>
    </div>
    <div class="text-primary">
    <h4 class="text-lg font-semibold break whitespace-nowrap">${product.product_name}</h4>
    <div class="flex gap-3 items-center">
        <i class="bi bi-star-half">
        </i>
        <span>4.8</span>
        <div class=" h-4 w-[1px] bg-secondary"></div>
        <span class="bg-accent rounded-md p-2 text-xs">5000 sold</span>
    </div>
    <span class=" font-semibold">$ 85.00</span>
    </div>`;

    a.classList = 'w-[150px] h-[230px] relative ';
    return a;
}

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

function generateMPBrand(brand, chosenBrand = "All") {
    const span = document.createElement('span');
    span.className = 'brand_item ';
    if (brand.brand_name === chosenBrand)
        span.className = 'brand_item active';

    span.addEventListener('click', async () => {
        productList = await getPopularProducts(brand.brand_name);
        generateMPBrands(brandList, brand.brand_name);
        generateProducts(productList, brand.brand_name !== "All" && brand.brand_name);

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




//////

const searchBox = document.getElementById('searchBox');
const searchInput = document.getElementById('searchInput');
const suggestionList = document.getElementById('suggestionList');
const clearAll = document.getElementById('clearAll');
const searchSection = document.getElementById('searchSection');
const resualtSection = document.getElementById('resualtSection');
const resualtList = document.getElementById('resualtList');
const notFound = document.getElementById('notFound');
const back2 = document.getElementById('back2');
const resultFor = document.getElementById('resultFor');
const foundNumber = document.getElementById('foundNumber');

const Suggestions = localStorage.getItem('Suggestionsf');
if (Suggestions)
    generateSuggestions(Suggestions.split(','));


search.addEventListener('click', () => {
    searchBox.classList.remove('hidden')
});

function generateProductsForSearch(productList) {
    console.log(productList);
    const list = productList.map(item => generateProduct(item));
    resualtList.innerHTML = "";
    resualtList.append(...list);
}

const searchByFilter = async filter => {
    const response = await Req.get('/product/sort/descending');
    const list = await response.filter(item => item.product_name.includes(filter) && item.product_isliked === true);
    const ls = await addToSuggestion(searchInput.value);
    await generateSuggestions(ls);

    if (list.length) {
        notFound.classList.replace('block', 'hidden');
        resualtList.classList.replace('hidden', 'grid');
    } else {
        notFound.classList.replace('hidden', 'block');
        resualtList.classList.replace('grid', 'hidden');
    }


    resultFor.textContent = `Result for ${searchInput.value}`;
    foundNumber.textContent = `${list.length} found`;


    generateProductsForSearch(list);
    searchSection.classList.replace('block', 'hidden');
    resualtSection.classList.replace('hidden', 'block');
}

const searchResault = searchDebounce(searchByFilter, 1500);

searchInput.addEventListener('input', () => {
    searchResault(searchInput.value);
});

searchInput.addEventListener('click', () => {
    searchSection.classList.replace('hidden', 'block');
    resualtSection.classList.replace('block', 'hidden');
});

back2.addEventListener('click', () => {
    searchBox.classList.add('hidden');
    searchInput.value = '';
    searchSection.classList.replace('hidden', 'block');
    resualtSection.classList.replace('block', 'hidden');
});

clearAll.addEventListener('click', () => {
    localStorage.setItem('Suggestionsf', '');
    generateSuggestions([]);
});


let timeout;
function searchDebounce(fn, delay) {
    return (input) => {
        clearTimeout(timeout);
        if (input === '') return;
        timeout = setTimeout(() => {
            fn(input);
        }, delay);
    }
}


function addToSuggestion(input) {
    let Suggestions = localStorage.getItem('Suggestionsf');
    if (Suggestions) {
        Suggestions = Suggestions.split(',');
        if (!Suggestions.includes(input))
            Suggestions.unshift(input);
        localStorage.setItem('Suggestionsf', Suggestions.join(','));
    } else
        localStorage.setItem('Suggestionsf', input);

    return localStorage.getItem('Suggestionsf').split(',');
}

function generateSuggestion(item) {
    const div = document.createElement('div');
    div.classList = 'flex items-center justify-between cursor-pointer py-2';
    div.innerHTML = `
    <span>${item}</span>
    <i class="bi bi-x-square "></i>`;
    div.querySelector('i').addEventListener('click', (event) => {
        let Suggestions = localStorage.getItem('Suggestionsf');
        Suggestions = Suggestions.split(',');
        Suggestions = Suggestions.filter(item1 => item1 !== item);
        console.log(Suggestions);
        localStorage.setItem('Suggestionsf', Suggestions.join(','));
        event.stopPropagation();
        if (Suggestions)
            generateSuggestions(Suggestions);
    });
    div.addEventListener('click', () => {
        console.log(item);
        searchInput.value = item;
        searchResault(searchInput.value)
    });
    return div;
}

function generateSuggestions(list) {
    const sList = list.map(item => generateSuggestion(item));

    suggestionList.innerHTML = "";
    suggestionList.append(...sList);
}