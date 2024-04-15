const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // Import bodyParser to parse POST request data
const path = require('path');
const Customer = require('./models/Customer'); // Import the Customer model


const app = express();

// Serve static files from the 'public' directory
app.use(express.static(__dirname));
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Parse application/json
app.use(bodyParser.json());

// Define routes
app.get('/', (req, res) => {
    // Send the HTML file when the root route is accessed
    res.sendFile(path.join(__dirname, 'GetTrolley.html'));
});

// POST request to handle customer data
app.post('/', async (req, res) => {
    try {
        // Extract customer data from the POST request body
        const { name, email } = req.body;

        // Validate if name and email are provided
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        // Create a new document (record) in your MongoDB collection
        const customer = await Customer.create({ name, email });

        // Respond with a success message
        res.status(201).json({ message: 'Customer data saved successfully', customer });
    } catch (error) {
        // If an error occurs, respond with an error message
        console.error('Error saving customer data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

mongoose.connect("mongodb+srv://shreekantp0008:zQklak9s5suP25b6@rfidsmttrolley.wcoool5.mongodb.net/")
    .then(() => {
        console.log('Connected to MongoDB');
        // Start the server
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
    });
