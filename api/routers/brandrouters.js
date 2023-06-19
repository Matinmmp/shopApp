import express from 'express';
import BrandModel from '../models/brand.js';


const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const brandRow = await BrandModel.find();
        res.json(brandRow);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/',async(req,res)=>{
    const brand = new BrandModel({
        brand_name:req.body.brand_name,
        brand_icon:req.body.brand_icon,
        brand_view:req.body.brand_view
    });
    try {
        const newBrand = await brand.save();
        res.status(201).json(newBrand);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
