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
    customer_phone: {
        type: String,
        required: true
    },
    customer_addres: {
        type: Array,
        required: true
    }
});

export default mongoose.model('customer',customerSchema);