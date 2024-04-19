const express = require('express');
const bodyParser = require('body-parser'); // Import bodyParser to parse POST request data
const path = require('path');
const randomTrolleys = require('./randomTrolley.js');
const Customer = require('./models/Customer'); // Import the Customer model

const connectDB = require('./db.js')
const dotenv = require("dotenv")
dotenv.config({ path: "./.env" });
const generateFakeData = require ("./Fakedata.js")

const app = express();
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

connectDB()
.then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port 3000`);
  })
})
.catch((err) => {
  console.log(`mongoDB connection error: ${err}`);
})

// Define routes
app.get('/', (req, res) => {
    // Send the HTML file when the root route is accessed
    res.sendFile(path.join(__dirname, 'GetTrolley.html'));
});

// // POST request to handle customer data
app.post('/', async (req, res) => {
    try {
        // Extract customer data from the POST request body
        const { name, email } = req.body;

        // Validate if name and email are provided
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        // Get a random trolley ID from the randomTrolleys array
        const randomTrolleyIndex = Math.floor(Math.random() * randomTrolleys.length);
        const randomTrolleyId = randomTrolleys[randomTrolleyIndex];

        // Save the assigned trolley ID temporarily in the database
        const customer = new Customer({
            name: req.body.name,
            email: req.body.email,
            assignedTrolleyId: randomTrolleyId // Save the assigned trolley ID
        });

        customer.save()
            .then(() => {
                res.status(201).send(`Trolley with ID ${randomTrolleyId} is assigned to ${req.body.name}`);
            })
            .catch((error) => {
                res.status(500).send(error.message);
            });

    } catch (error) {
        // If an error occurs, respond with an error message
        console.error('Error saving customer data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/fetchdata',async(req,res)=>
    generateFakeData
)


