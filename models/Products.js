const mongoose = require('mongoose');

// Define the schema for the Product model
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    }, 
},
{ timestamps: true } );


// Create the Product model based on the schema
const Product = mongoose.model('Product', productSchema);

// Export the Product model
module.exports = Product;
