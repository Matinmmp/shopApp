import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({

    orderItem_date: {
        type: String,
        required: true,
        default:new Date()
    },

    product_id:{
        type: String,
        required: true
    },
    customer_id:{
        type:String,
        required:true
    },

    orderItem_color:{
        type:String,
        required:true
    },

    orderItem_size:{
        type:String,
        default:0
    },

    orderItem_quantity:{
        type:String,
        default:"0"
    },
    
    orderItem_totalPrice:{
        type:String,
        default:"0"
    },
    orderItem_status:{
        type:Boolean,
        default:false
    },
    orderItem_address:{
        type:Object,
    },
    orderItem_shipping:{
        type:String
    },
    orderItem_payment:{
        type:String
    },
    orderItem_isOrdered:{
        type:Boolean,
        default:false
    }
});

export default mongoose.model('orderItems', orderItemSchema);
