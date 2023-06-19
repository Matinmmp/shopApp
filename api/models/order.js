import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    order_date: {
        type: String,
        required: true,
        default:new Date()
    },   

    order_totalPrice:{
        type:String,
        default:0
    },

    order_address:{
        type:String,
        required:false
    },
    order_shiping:{
        type:String,
        required:false
    },
    order_status:{
        type:String,
        required:true
    },
    order_ispaied:{
        type:Boolean,
        required:true,
        default:false
    },
    customer_id:{
        type: String,
        required: true,
    }
});

export default mongoose.model('orders', orderSchema);