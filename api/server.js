import express from 'express';
import mongoose from 'mongoose';

import adminRoute from './routers/adminRoutes.js';
import customerRoute from './routers/customerRoutes.js'

const app = express();
mongoose.connect(
    'mongodb://127.0.0.1:27017/shoeshop?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.9.1',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

const db = mongoose.connection;

db.on('error', error => console.log(error));
db.once('open', () => console.log('open'));

app.use(express.json());

app.use('/admin', adminRoute);
app.use('/customer', customerRoute);


app.listen(3001, () => console.log('Server Started'));
