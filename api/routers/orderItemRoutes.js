import express from 'express';
import OrderItemModel from '../models/orderItem.js';


const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const orderItemrow = await OrderItemModel.find();
        res.json(orderItemrow);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});



router.post('/', async (req, res) => {

    const order = new OrderItemModel({
        ...req.body
    });
    try {
        const newOrder = await order.save();
        console.log(newOrder);
        res.json(newOrder);
    } catch (err) {
        res.json({ message: err.message });
        console.log(err.message);
    }
});


router.put('/:id', getOrderItem, async (req, res) => {
    try {
        res.orderItem.orderItem_quantity = req.body.orderItem_quantity;
        res.orderItem.orderItem_totalPrice = req.body.orderItem_totalPrice;
        res.orderItem.orderItem_status = req.body.orderItem_status;
        res.orderItem.orderItem_address = req.body.orderItem_address;
        res.orderItem.orderItem_shipping = req.body.orderItem_shipping;
        res.orderItem.orderItem_payment = req.body.orderItem_payment;
        res.orderItem.orderItem_isOrdered = req.body.orderItem_isOrdered;
        res.orderItem.save();
        res.json(res.orderItem);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});



router.delete("/:id", getOrderItem, async (req, res) => {
    try {
        await OrderItemModel.deleteOne(res.orderItem);
        res.json({ message: "Deleted orderItem" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});






async function getOrderItem(req, res, next) {
    let orderItem;
    try {
        orderItem = await OrderItemModel.findById(req.params.id);
        if (orderItem === null) {
            return res.status(404).json({ message: 'Can not find orderItem' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.orderItem = orderItem;
    next();
}


export default router;
