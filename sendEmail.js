const nodemailer = require('nodemailer');
const ejs = require('ejs');
const dotenv = require("dotenv")
const fs = require('fs');
dotenv.config({ path: "./.env" })

module.exports = async (email, products) => {
  const config = {
    service: "gmail",
    host: "smtp.google.com",
    port: 587,
    secure: false,
    auth: {
      user: `${process.env.EMAIL}`,
      pass: `${process.env.EMAIL_PASSWORD}`,
    }
  };
  const transporter = nodemailer.createTransport(config);



  try {
    const templateString = fs.readFileSync('./email-template.ejs', 'utf-8');
    const html = ejs.render(templateString, { products });

    // console.log(html, products);
    // Set email options
    let mailOptions = {
      from: 'vrs.vish@gmail.com',
      to: email,
      subject: 'Your Automated Shopping Bill',
      html: html
    }

    // Send email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`Email sent successfully`);
      }
    });

  }
  catch (error) {
    console.error('Error sending email:', error);
    throw error;

  }

}

