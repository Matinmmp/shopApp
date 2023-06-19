import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
    customer_name: {
        type: String,
        required: true
    },
    customer_email: {
        type: String,
        required: true
    },
    customer_password:{
        type: String,
        required: true
    },
    customer_phone: {
        type: String,
        required: true
    },
    customer_addres: {
        type: Array,
        required: true
    },
    customer_loged: {
        type: Boolean,
        required: true
    }
});

export default mongoose.model('customer',customerSchema);