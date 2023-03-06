const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const nodemailer = require('nodemailer');

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // guardando el usuario en la base de datos
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  }) // verificando que el usuario ya no este registrado
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User was registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User was registered successfully!" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

//verificando credenciales del usuario

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      //creando token para el logueo

      var jwtToken = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      //verificando roles del usuario

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: jwtToken
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.resetPassword = (req, res) => {
  User.findOne({where: {
    userEmail: req.body.email
  }
}).then(user => {
  if (!user) {
    return res.status(404).send({ message: "User Not found." });
  }
    //generando token para el correo electronico 
    const tokenEmail = jwt.sign({ email: userEmail }, config.Secret_Email, { expiresIn: 300 });

  });
 //actualizando el estado del usuario para realizar bloqueo por uso de  reset
  return User.updateOne({resetPass : 1},(err,success) => {
    if (err){
      return res.status(400).json({error: "Error en link solicitado"})
      }else { //enviando el correo al usuario

        const transporter = nodemailer.createTransport({
          host: process.env.Email_host,
          port: process.env.Email_Port,
          auth: {
            user: process.env.Email_User,
            pass: process.env.Email_Pass
          }
        });
        
        const mailOptions = {
          from: 'lgsus@inbox.mailtrap.io',
          to: userEmail,
          subject: 'Reinicio de contraseña',
          text: `Para reiniciar tu contraseña, haz clic en el siguiente enlace: http://localhost:3000/reset-password/${tokenEmail}`
        };
        
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log('Correo electrónico enviado: ' + info.response);
          }
        });
      }
    });
  };
  

