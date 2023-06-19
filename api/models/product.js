import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true
    },
    product_description: {
        type: String,
        required: true
    },
    product_price: {
        type: String,
        required: true
    },
    product_sizes: {
        type: Array,
        required: true
    },
    product_colors: {
        type: Array,
        required: true
    },
    product_brand: {
        type: String,
        required: true
    },
    product_image_urls: {
        type: Array,
        required: true
    },
    product_quantity:{
        type:Number,
        required:false,
        default:0
    },
    product_soldnumber:{
        type:Number,
        required:false,
        default:0
    },
    product_hashtags:{
        type:Array,
        required:false,
    },
    product_score:{
        type:Number,
        required:false,
        default:0
    },
    product_view:{
        type:Number,
        required:false,
        default:0
    },
    product_isliked:{
        type:Boolean,
        default:false
    }
});


export default mongoose.model('products',productSchema);