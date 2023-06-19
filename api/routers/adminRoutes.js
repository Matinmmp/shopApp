import express from 'express';
import AdminModel from '../models/admin.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const userRow = await AdminModel.find();
        res.json(userRow);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/',async(req,res)=>{
    const admin = new AdminModel({
        admin_username:req.body.admin_username,
        admin_password:req.body.admin_password,
        admin_fullname:req.body.admin_fullname
    });
    try {
        const newAdmin = await admin.save();
        res.status(201).json(newAdmin);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})

export default router;
