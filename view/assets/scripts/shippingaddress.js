import Request from './Request.js';


const addressList = document.getElementById('addressList');
const name = document.getElementById('name');
const address = document.getElementById('address');
const addAddress = document.getElementById('addAddress');
const back = document.getElementById('back');
const apply = document.getElementById('apply');

const Req = new Request({
    baseURL: 'http://localhost:3001',
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
});




let customer = JSON.parse(localStorage.getItem('customer'));

const getCustomer = async (id) => {
    const response = await Req.get(`/customer/${id}`);
    return await response;
}

back.addEventListener('click',()=>{
    window.location.href = '../views/checkout.html';
});

apply.addEventListener('click',()=>{
    window.location.href = '../views/checkout.html';

})

addAddress.addEventListener('click', async () => {
    if (name.value === '' || addAddress.value === '') {
        alert('Enter Address');
        return;
    }
    const addr = customer.customer_addres;
    const n = {};
    n[name.value] = address.value;
    addr.push(n)
    customer.customer_addres = addr;

    await Req.edit(`/customer/${customer._id}`, customer);

    customer = await getCustomer(customer._id);
    generateAdresses(customer.customer_addres);
});


customer = await getCustomer(customer._id);

function generateAdresses(addresses) {
    console.log();
    const list = addresses.map((item, index) => generateAddress(item, index));
    addressList.innerHTML = '';
    addressList.append(...list);
}

function generateAddress(item, index) {
    const key = Object.keys(item);
    const div = document.createElement('div');
    div.className = 'flex items-center my-2 bg-white shadow-md shadow-gray-400 py-5 rounded-3xl';
    div.innerHTML = `
    <div class="w-2/12 ps-1">
                <img src="../img/location.PNG" alt="">
            </div>
            <div class="w-8/12 flex flex-col gap-2 px-2">
                <span id="address_name" class="text-lg font-bold">${key}</span>
                <span id="address_des" class="text-secondary text-sm">${item[key]} </span>
            </div>
            <div class="w-2/12 ps-6">
                <input id="check" type="radio" name="radio-1" class="radio" ${index === 0 && 'checked '}  />
            </div>`;

    div.addEventListener('click', () => {
        div.querySelector('#check').checked = true;
        localStorage.setItem('choosenAddress', JSON.stringify(item));
    })
    return div;
}

generateAdresses(customer.customer_addres);