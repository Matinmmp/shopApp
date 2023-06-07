import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    admin_username: {
        type: String,
        required: true
    },
    admin_password: {
        type: String,
        required: true
    },
    admin_fullname: {
        type: String,
        required: true
    }
});

export default mongoose.model('admin',adminSchema);
