import Request from './Request.js';
import productGenerator from './productGenerator.js'

const brnadsBox = document.getElementById('brnadsBox');
const mpBrandsBox = document.getElementById('mpBrandsBox');
const productsBox = document.getElementById('productsBox');
const seeAll = document.getElementById('seeAll');
const searchBox = document.getElementById('searchBox');
const search = document.getElementById('search');
const searchInput = document.getElementById('searchInput');
const isLoged = localStorage.getItem('isLoged');

if(isLoged == 'false'){
    console.log("asdfasd");
    window.location.href = '../views/login.html'
}


const Req = new Request({
    baseURL: 'http://localhost:3001',
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
});

seeAll.addEventListener('click', () => {
    window.location.href = "../views/products.html";
});

search.addEventListener('click', () => {
    searchBox.classList.remove('hidden');
});

localStorage.setItem('url', `${window.location.href}`);


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


generateBrnads(brandList);
generateMPBrands(brandList);
generateProducts(productList);


// for genarating brands

function generateBrnad(brand) {
    const div = document.createElement('div');
    div.innerHTML = `
        <div class="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
            <img class="w-7 h-7" src="../img/${brand.brand_icon}" alt="">
        </div>
        <span class="text-sm font-bold">${brand.brand_name}</span>`;
    div.classList = 'flex flex-col items-center justify-center gap-2 cursor-pointer';
    div.addEventListener('click', () => {
        window.location.href = `../views/productbybrand.html?name=${brand.brand_name}`;
    });
    return div;
}

function generateBrnads(brnadList) {
    const brands = brnadList.slice(0, 7).map(item => generateBrnad(item));
    if (brnadList.length > 7)
        brands.push(
            generateBrnad({ brand_icon: 'more_30px.png', brand_name: 'More' })
        );
    brnadsBox.innerHTML = '';
    brnadsBox.append(...brands);
}


// for generating most popular brands

function generateMPBrand(brand, chosenBrand = "All") {
    const span = document.createElement('span');
    span.className = 'brand_item ';
    if (brand.brand_name === chosenBrand)
        span.className = 'brand_item active';

    span.addEventListener('click', () => {
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



function generateProducts(productList, fillterByName) {

    let list = [];
    if (fillterByName)
        list = productList.filter(item => item.product_brand === fillterByName).slice(0, 10).map(item => productGenerator(item));
    else {
        list = productList.slice(0, 10).map(item => productGenerator(item));
    }

    productsBox.innerHTML = "";
    productsBox.append(...list);
}



///// for search box


const suggestionList = document.getElementById('suggestionList');
const clearAll = document.getElementById('clearAll');
const searchSection = document.getElementById('searchSection');
const resualtSection = document.getElementById('resualtSection');
const resualtList = document.getElementById('resualtList');
const notFound = document.getElementById('notFound');
const back = document.getElementById('back');
const resultFor = document.getElementById('resultFor');
const foundNumber = document.getElementById('foundNumber');

const Suggestions = localStorage.getItem('Suggestions');
if (Suggestions)
    generateSuggestions(Suggestions.split(','));


function generateProductsForSearch(productList) {
    console.log(productList);
    const list = productList.map(item => productGenerator(item));
    resualtList.innerHTML = "";
    resualtList.append(...list);
}

const searchByFilter = async filter => {
    const response = await Req.get('/product/sort/descending');
    const list = await response.filter(item => item.product_name.includes(filter));
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

back.addEventListener('click', () => {
    searchBox.classList.add('hidden');
    searchInput.value = '';
    searchSection.classList.replace('hidden', 'block');
    resualtSection.classList.replace('block', 'hidden');
});

clearAll.addEventListener('click', () => {
    localStorage.setItem('Suggestions', '');
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
    let Suggestions = localStorage.getItem('Suggestions');
    if (Suggestions) {
        Suggestions = Suggestions.split(',');
        if (!Suggestions.includes(input))
            Suggestions.unshift(input);
        localStorage.setItem('Suggestions', Suggestions.join(','));
    } else
        localStorage.setItem('Suggestions', input);

    return localStorage.getItem('Suggestions').split(',');
}

function generateSuggestion(item) {
    const div = document.createElement('div');
    div.classList = 'flex items-center justify-between cursor-pointer py-2';
    div.innerHTML = `
    <span>${item}</span>
    <i class="bi bi-x-square "></i>`;
    div.querySelector('i').addEventListener('click', (event) => {
        let Suggestions = localStorage.getItem('Suggestions');
        Suggestions = Suggestions.split(',');
        Suggestions = Suggestions.filter(item1 => item1 !== item);
        console.log(Suggestions);
        localStorage.setItem('Suggestions', Suggestions.join(','));
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