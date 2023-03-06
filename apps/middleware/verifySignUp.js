const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: "Failed! Username is already in use!"
      
      }).then (user => {
        if (typeof username === 'undefined') {
        return res.status(400).json({ message: 'El parámetro "username" es requerido' });
      } 
      return;
    })
  };

    // Email
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        res.status(400).send({
          message: "Failed! Email is already in use!"
        });
        return;
      }

      next();
    });
  });
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: "Failed! Role does not exist = " + req.body.roles[i]
        });
        return;
      }
    }
  }
  
  next();
};





CheckEmailExist = (req, res, next) => {
// Email
User.findOne({
  where: {
    email: req.body.email
  }
}).then(user => {
  if (user) {
    res.status(200).send({
      message: "Correo enviado"
    });
    return;
  }

  next();
})
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted,
  CheckEmailExist: CheckEmailExist
};
module.exports = verifySignUp;


