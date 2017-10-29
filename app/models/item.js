const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var ItemSchema = new Schema({
    name: String,
    price: Number,
    brand: String
});

module.exports = mongoose.model('Item', ItemSchema);