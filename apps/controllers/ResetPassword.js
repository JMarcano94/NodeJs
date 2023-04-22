const  db = require('../models');
const User = db.user
const bcrypt = require('bcryptjs')
const config = require('../config/auth.config');
const jwt = require('jsonwebtoken')




exports.ChangePasswordEmail = async (req, res) => {
  const { newPassword, confirmPassword } = req.body;
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  try {
    if (newPassword !== confirmPassword) {
      return res.status(402).json({ message: "Contraseñas no coinciden" });
    }

    const decoded = jwt.verify(token, config.Secret_Email);

    if (!decoded) {
      return res.status(406).json({ message: "Link expirado" });
    }

    const userEmail = decoded.email;
    const isUser = await User.findOne({ where: { email: userEmail } });

    if (!isUser) {
      return res.status(404).json({ message: "Revise su bandeja de entrada de correo electronico" });
    }

    if (isUser.resetPass === false) {
      return res.status(400).json({ message: "Su contraseña ya fue cambiada intente nuevamente" });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    const isSuccess = await isUser.update({ password: hashedPassword, resetPass: false });

    if (isSuccess) {
      return res.status(200).json({ message: "Password Changed Successfully" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};