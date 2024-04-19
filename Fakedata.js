const mongoose = require('mongoose');
const faker = require('faker');
const connectDB = require('./db.js')
const dotenv = require("dotenv")
dotenv.config({ path: "./.env" });
// Import Customer and Product models
const Customer = require('./models/Customer');
const Product = require('./models/Products');

// Function to generate fake data
async function generateFakeData() {
    try {
        // Retrieve emails of customers who have taken a trolley
        const customers = await Customer.find({}, 'email');

        // Loop through each customer
        customers.forEach(async (customer) => {
            const date = faker.date.past(); // Generate a random past date
            const products = []; // Array to store products purchased by the customer

            // Retrieve product information from the Products collection
            const allProducts = await Product.find({}, 'name price weight');

            // Randomly select a number of products purchased by the customer
            const numProducts = faker.random.number({ min: 1, max: 5 });

            // Randomly select products and add them to the products array
            for (let i = 0; i < numProducts; i++) {
                const randomProductIndex = faker.random.number({ min: 0, max: allProducts.length - 1 });
                const randomProduct = allProducts[randomProductIndex];
                products.push({
                    name: randomProduct.name,
                    price: randomProduct.price,
                    weight: randomProduct.weight
                });
            }

            // Log the fake data for the customer
            console.log(`Email: ${customer.email}, Date: ${date}, Products:`, products);
        });
    } catch (error) {
        console.error('Error generating fake data:', error);
    }
}

// Connect to MongoDB
connectDB()
.then(() => {
    console.log('Connected to MongoDB');
    // Call the function to generate fake data
    generateFakeData();
})
.catch((err) => {
  console.log(`mongoDB connection error: ${err}`);
})

module.exports = { generateFakeData };