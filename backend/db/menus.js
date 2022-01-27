const mongoose = require('mongoose');
const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: { type: Number, required: true },
    path: { type: String, required: true }
})
module.exports = mongoose.model("chart", menuSchema)
