const mongoose = require('mongoose');

// Define the schema for the Customer model
const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    assignedTrolleyId: {
        type: String,
        required: true // Store the assigned trolley ID
    }
});

// Create the Customer model based on the schema
const Customer = mongoose.model('Customer', customerSchema);


module.exports = Customer; // Export the Customer model
