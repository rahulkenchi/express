const mongoose = require('mongoose');
const logger = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    MobileNo: {
        type: Number,
        required: true
    },

    password: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("log", logger)