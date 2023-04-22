const  db = require('../models');
const User = db.user
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const config = require("../config/auth.config");


async function forgetPassword(req, res) {
    try {
      const { email } = req.body;
  
      if (!email) {
        return res.status(400).json({ message: "email is required" });
      }
  
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: "Invalid Email" });
      }
  
      // Generate token
      const token = jwt.sign({ email }, config.Secret_Email, {
        expiresIn: "5m",
      });
  
      // Update user's resetPass status
      await user.update({ resetPass: true });
  
      // Send email
      const transport = createTransport();
      const mailOptions = createMailOptions(email, token);
      await transport.sendMail(mailOptions);
  
      return res.status(200).json({ message: "Email Sent" });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
  
  function createTransport() {
    return nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "90724db3e6970a",
        pass: "5f2cfc0c002c19",
      },
    });
  }
  
  function createMailOptions(email, token) {
    const resetUrl = `http://localhost:4000/api/auth/change-password/${token}`;
    return {
      from: "jesus@admin.com",
      to: email,
      subject: "Password Reset Request",
      text: resetUrl,
    };
  }

module.exports ={
    forgetPassword
}