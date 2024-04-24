const express = require('express');
const bodyParser = require('body-parser'); // Import bodyParser to parse POST request data
const path = require('path');
const fs = require('fs')
const crypto = require('crypto');
const dotenv = require("dotenv")
dotenv.config({ path: "./.env" })
const cookieParser = require('cookie-parser');
const app = express();
const secretKey = process.env.SECRET_STRING; // Replace with a long, random string for cookie signing
const cookieExpiry = 1000 * 60 * 60 * 24;
app.use(cookieParser(secretKey));
const randomTrolleys = require('./randomTrolley.js');
const Customer = require('./models/Customer.js'); // Import the Customer model
const Product = require('./models/Products.js');
const sendEmail = require('./sendEmail');


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const connectDB = require('./db.js');
// const generateFakeData = require ("./Fakedata.js")


connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on port 3000`);
    })
  })
  .catch((err) => {
    console.log(`mongoDB connection error: ${err}`);
  })

function generateSessionId() {
  return crypto.randomBytes(16).toString('hex'); // Generate a random session ID
}


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
    const sessionID = generateSessionId();

    // Create cookies with email and session ID (signed for security)
    res.cookie('email', email, { httpOnly: true, signed: true, maxAge: cookieExpiry });
    res.cookie('sessionId', sessionID, { httpOnly: true, maxAge: cookieExpiry });

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
        res.status(201).json(`Trolley with ID ${randomTrolleyId} is assigned to ${req.body.name} and session started`);
      })
      .catch((error) => {
        res.status(500).json(error.message);
      });
    console.log(randomTrolleyId, req.body.email, sessionID)
  } catch (error) {
    // If an error occurs, respond with an error message
    console.error('Error saving customer data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/products', async (req, res) => {
  // Check for presence of signed cookies
  const email = req.signedCookies.email;
  const sessionId = req.cookies.sessionId;
  console.log(email, sessionId);
  if (!email || !sessionId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const productLists = await Product.find();

    fs.readFile('public/product.html', 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading HTML file:', err);
        return res.status(500).send('Error');
      }
    })

    res.json(productLists); // Send product data as JSON
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
})
app.post('/order-receipt', async (req, res) => {
  const email = req.signedCookies.email;
  const products = await Product.find().select("-_id");
  sendEmail(email, products)
  res.json(`Order confirmation email sent to ${email}`);
})


