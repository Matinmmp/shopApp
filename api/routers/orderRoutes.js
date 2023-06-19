import express from 'express';
import OrderModel from '../models/order.js';


const router = express.Router();

router.get('/:costumerId', async (req, res) => {
    try {
        const orderRow = await OrderModel.find();
        const list = orderRow.filter(item => item.customer_id === req.body.costumerId);
        res.status(200).json(list);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    const order = new OrderModel({
        ...req.body
    });
    try {
        const newOrder = await order.save();
        res.json(newOrder);
    } catch (err) {
        res.json({ message: err.message });
    }
});


router.put('/:id', getOrder, async (req, res) => {
    try {   
        const order = await OrderModel.updateMany({
            ...req.body
        });
        res.json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});



async function getOrder(req, res, next) {
    let order;
    try {
        order = await OrderModel.findById(req.params.id);
        if (order === null) {
            return res.status(404).json({ message: 'Can not find order' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.order = order;
    next();
}


export default router;
