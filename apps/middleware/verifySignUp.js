const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;
const config = require("../config/auth.config");

checkpasswordIsSecure = (req,res,next)=>{
  let SecurePassword  = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/;

const passwordSecure = {
  async reset(req, res){
    if (!SecurePassword.test(req.body.password)){
      res.send({
        message:
        "La contraseña debe ser entre 8 y 16 caracteres ademas debe incluir los siguientes caracteres, 1 numero, 1 letra minuscula, 1 letra mayuscula y una letra especial."
          });
        }
      }
    }
}

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
   User.findOne({
    where: {
      username: req.body.username
    }
    }).then (user => {
        if (user) {
          return res.status(400).json({
            message: "Failed! Username is already in use!"});
      } 
     
    })

    // Email
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        return res.status(400).json({
          message: "Failed! Email is already in use!"
        })
       
      }

      next();
    });
  };

checkNullValue = (req, res, next)=>{

    if (req.body.username === "" || req.body.email  === "" || req.body.password === "" ) {
      return res.status(400).json({
       message: 'Verifique Los campos escritos' });
     };
         next();
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

checkEmailIsCorrect = (req,res,next) => {
   // Email
   User.findOne({
    where: {
      email: req.body.email
    }
  }).then(user => {
    if (user) {
      res.status(200).send({
        message: "Correo Enviado"
      });

      return;
    }

    next();
  });

}
verifiedEmail = async (req, res) => {
  const { token } = req.params;
  try {
    if (token) {
      // token verify
      
      const isEmailVerified = await jwt.verify(token, config.Secret_Email);
      if (isEmailVerified) {
        const getUser = await User.findOne({
          email: isEmailVerified.email,
        });

        if (getUser) {
          (getUser.resetPass === 0 )
          return res
            .status(400)
            .json({ message: "Envie Nuevamente el correo de reinicio de contraseña" });
        }

        //
      } else {
        return res.status(400).json({ message: "Link Expirado" });
      }
    } else {
      return res.status(400).json({ message: "Invalid URL" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};




const verifySignUp = {
  checkpasswordIsSecure: checkpasswordIsSecure,
  verifiedEmail : verifiedEmail,
  checkNullValue : checkNullValue,
  checkEmailIsCorrect : checkEmailIsCorrect,
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted,
};
module.exports = verifySignUp;


