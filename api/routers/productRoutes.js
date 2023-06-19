import express from 'express';
import ProductModel from '../models/product.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const productRow = await ProductModel.find();
        res.json(productRow);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/:id', getProduct, (req, res) => {
    res.json(res.product);
});



router.get('/sort/:order', async (req, res) => {
    try {
        let sortedList = [];
        const productRow = await ProductModel.find();
        if (req.params.order === 'descending')
            sortedList = productRow.sort((a, b) => b.product_view - a.product_view);
        if (req.params.order === "ascending")
            sortedList = productRow.sort((a, b) => a.product_view - b.product_view);
        res.json(sortedList);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});



router.get('/brand/:name', async (req, res) => {
    try {
        let sortedList = [];
        const productRow = await ProductModel.find();
        sortedList = productRow.filter(item => item.product_brand === req.params.name)
        res.json(sortedList);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});



router.post('/', async (req, res) => {
    const product = new ProductModel({
        ...req.body
    });
    try {
        const newProduct = await product.save();
        res.json(newProduct);
    } catch (err) {
        res.json({ message: err.message });
    }
});


router.put('/:id', getProduct, async (req, res) => {
    try {

        // const product = await ProductModel.updateMany({}, {
        //     _id:req.body._id  ,
        //     product_name:req.body.product_name  ,
        //     product_description:req.body.product_description ,
        //     product_price:req.body.product_price ,
        //     product_sizes:req.body.product_sizes ,
        //     product_colors:req.body.product_colors ,
        //     product_brand:req.body.product_brand,
        //     product_image_urls:req.body.product_image_urls,
        //     product_quantity:req.body.product_quantity,
        //     product_soldnumber:req.body.product_soldnumber ,
        //     product_hashtags:req.body.product_hashtags ,
        //     product_score:req.body.product_score ,
        //     product_view:req.body.product_view ,
        //     product_isliked:req.body.product_isliked,
        //     __v:req.body.__v 
        // });

        // const product = await ProductModel.updateMany( {
        //     ...req.body
        // });
        // console.log(req.body.product_isliked);
        // res.product.product_isliked = req.product.product_isliked;
        res.product.product_isliked= req.body.product_isliked;
        res.product.save();
        res.json(res.product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})

async function getProduct(req, res, next) {
    let product;
    try {
        product = await ProductModel.findById(req.params.id);
        if (product === null) {
            return res.status(404).json({ message: 'Can not find product' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    res.product = product;
    next();
}

export default router;
