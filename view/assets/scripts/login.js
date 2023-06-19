import Request from './Request.js';
const email = document.getElementById('email');
const password = document.getElementById('password');
const remember = document.getElementById('remember');
const sub = document.getElementById('sub');
const eye = document.getElementById('eye');
 
let customer;

const Req = new Request({
    baseURL: 'http://localhost:3001/customer',
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
});

const isLoged = localStorage.getItem('isLoged');
const rememberMe = localStorage.getItem('rememberMe');
if (isLoged == 'true')
    window.location.href = '../views/home.html'
if (rememberMe) {
    const customer = JSON.parse(localStorage.getItem('customer'));
    email.value = customer.customer_email;
    password.value = customer.customer_password;
}

const getCustomer = async () => {
    const response = await Req.get();
    return await response;
};

const updateCustomer = async (customer, isLoged) => {
    customer.customer_loged = isLoged;
    await Req.edit(`/${customer._id}`, customer);
}

const customerList = await getCustomer();

eye.addEventListener('click', () => {
    if (eye.textContent === 'visibility_off') {
        eye.textContent = 'visibility';
        password.type = 'text';
    } else {
        eye.textContent = 'visibility_off';
        password.type = 'password';
    }
});


sub.addEventListener('click', async () => {
    if (checkInputs() && customerExist()) {
        updateCustomer(customer, true);
        localStorage.setItem('customer', JSON.stringify(customer));
        localStorage.setItem('isLoged', true);
        window.location.replace('../views/home.html');
        if(remember.checked)
            localStorage.setItem('rememberMe',true);
        else
            localStorage.setItem('rememberMe',false);
    }
});

email.addEventListener('input', checkInputs);
password.addEventListener('input', checkInputs);

function checkInputs() {
    if (email.value !== '' && password.value != '') {
        sub.classList.replace('bg-zinc-700', 'btn-primary');
        return true;
    } else {
        sub.classList.replace('btn-primary', 'bg-zinc-700');
        return false;
    }
}

function customerExist() {
    customer = customerList.find(
        item =>
            item.customer_email.toLocaleLowerCase() ===
            email.value.toLocaleLowerCase()
    );
    if (!customer) {
        alert('Email is Wrong');
        return false;
    }
    if (customer.customer_password !== password.value) {
        alert('Password is Wrong');
        return false;
    }
    if (remember.checked) {
        customer.customer_loged = true;
        localStorage.setItem("customer", JSON.stringify(customer));
    }
    else {
        localStorage.removeItem("customer");
    }
    return true;
}
