const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        minLength: 3,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        minLength: 6
    },
    password: {
        type: String,
        trim: true,
        minLength: 4
    },
    cart: {
        type: Array,
        default: [],
    },
    orders: {
        type: Array,
        default: [],
    },
    contact: Number,
    picture: String,

})

const userModel = mongoose.model('user', userSchema)
module.exports = userModel;