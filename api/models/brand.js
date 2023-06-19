import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema({
    brand_name: {
        type: String,
        required: true
    },
    brand_icon:{
        type:String,
        required:true
    },
    brand_view:{
        type:Number,
        default:0
    }
});

export default mongoose.model('brand', brandSchema);
