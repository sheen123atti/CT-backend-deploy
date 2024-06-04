const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://qwerty:qwerty123@cluster0.7v48ztj.mongodb.net/crop_tech_two")

const userSchema = mongoose.Schema({
    username: String,
    password: String
    // purchased: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Item'
    // }]
})

const leaseProductSchema = mongoose.Schema({
    // userId: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    // }],
    uN: String,
    productName: String,
    productImage: String,
    productPrice: Number,
    location: String,
    quantity: Number,
    isRented: {type: Boolean, default: false}
})


const User = mongoose.model('User', userSchema);
const LeaseProduct = mongoose.model('LeaseProduct', leaseProductSchema);

module.exports = {
    User,
    LeaseProduct
}