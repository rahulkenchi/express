const mongoose = require('mongoose')
const order = new mongoose.Schema({
    email:
    {
        type: String,
        required: true
    },
    list: {
        type: Array,
        required: true
    }
})

module.exports = mongoose.model("order", order)