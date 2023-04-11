const {User, password} = require('../models')
const bcrypt = require('bcryptjs')
const config = require('../config/auth.config');
const { generateHash } = require('../utils/login_utils');


exports.ChangePasswordEmail= async (req, res) => {
  const { newPassword, confirmPassword } = req.body;
  const { token } = req.params;

  try {
    if (newPassword && confirmPassword && token) {
      if (newPassword === confirmPassword) {
        // token verifiying
        const userEmail = await jwt.decoded(token, config.Secret_Email);
        const isUser = await User.findOne({
          where: {
            email: userEmail
          }
        })
        
        if (isUser) {
          // password hashing
          const hashedPass = await generateHash(password)

          const isSuccess = await isUser.update({
            where:{
            password : hashedPass
            }
          });

          if (isSuccess) {
            return res.status(200).json({
              message: "Password Changed Successfully",
            });
          }
        } else {
          return res.status(400).json({
            message: "Link has been Expired",
          });
        }
      } else {
        return res
          .status(400)
          .json({ message: "password and confirm password does not match" });
      }
    } else {
      return res.status(400).json({ message: "All fields are required" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};