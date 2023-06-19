const generateProduct = product => {
    const a = document.createElement('a');
    a.href = `../views/productdetail.html?id=${product._id}`;
    a.innerHTML = `
    <div class="w-[150px] h-[150px] bg-accent rounded-3xl flex">
        <img src="../img/${product.product_image_urls[1]}" class="w-[80%] h-[80%] m-auto" alt="">
    </div>
    <div class="text-primary">
    <h4 class="text-lg font-semibold break whitespace-nowrap">${product.product_name}</h4>
    <span class=" font-semibold">$ 85.00</span>
    </div>`;
    a.classList = 'w-[150px] h-[200px]';

    // div.addEventListener('click',()=>{
    //     window.location.href = `../views/productdetail.html?id=${product._id}`;
    // });
    return a;
}


export default generateProduct;