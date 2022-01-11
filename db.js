const mongoose = require('mongoose');
const mongooseURI = 'mongodb+srv://admin:superansh123456@cluster0.entib.mongodb.net/iTodoNGDB';

const connectToMongo = () => {
    mongoose.connect(mongooseURI, () => {
        console.log('Connected To Mongo Successfully!!!');
    });
};

module.exports = connectToMongo;
