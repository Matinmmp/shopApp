import express from 'express';
import customerModel from '../models/customer.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const customerRow = await customerModel.find();
        res.json(customerRow);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/:id', getCustomer, async (req, res) => {
    res.json(res.customer);
});

router.post('/', async (req, res) => {
    const customer = new customerModel({
        customer_name: req.body.customer_name,
        customer_email: req.body.customer_email,
        customer_phone: req.body.customer_phone,
        customer_addres: req.body.customer_addres,
        customer_password: req.body.customer_password,
        customer_loged: req.body.customer_loged
    });

    try {
        const newCustomer = await customer.save();
        res.json(newCustomer);
    } catch (err) {
        res.json({ message: err.message });
    }
});

router.put('/:id', getCustomer, async (req, res) => {
    try {   
        const customer = await customerModel.updateMany({
            _id: req.body._id,
            customer_name: req.body.customer_name,
            customer_email: req.body.customer_email,
            customer_password: req.body.customer_password,
            customer_phone: req.body.customer_phone,
            customer_addres: req.body.customer_addres,
            customer_loged: req.body.customer_loged
        });
        res.json(customer);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

async function getCustomer(req, res, next) {
    let customer;
    try {
        customer = await customerModel.findById(req.params.id);
        if (customer === null) {
            return res.status(404).json({ message: 'Can not find customer' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.customer = customer;
    next();
}

export default router;
