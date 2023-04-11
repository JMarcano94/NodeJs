const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const generateHash = require('../utils/login_utils')


const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { password } = require("../models");

require('dotenv').config()

exports.signup = (req, res) => {
  
  const pwdHash=generateHash(password)
  // guardando el usuario en la base de datos
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: pwdHash
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

      var jwtToken = jwt.sign({ email: user.email}, config.secret, {
        expiresIn: '1h' // 1 hora
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





  




