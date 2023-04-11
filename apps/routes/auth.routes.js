const { verifySignUp, authJwt } = require("../middleware");
const controller = require("../controllers/auth.controller");
const resetPwd = require("../controllers/forgotPasswordController");
const resetUserpwd = require('../controllers/ResetPassword')

var express = require('express');
var router = express.Router();

module.exports = function(router) {
  router.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
//ruta para registro
  router.post("/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
      verifySignUp.checkNullValue
    ],
    controller.signup
  );

//ruta para logueo

  router.post("/api/auth/signin", controller.signin);

  //ruta para enviar el correo electronico.

  router.post("/api/auth/reset-password",  
  [
    verifySignUp.checkNullValue
  ],
   resetPwd .forgetPassword
  );

};



  //ruta para reiniciar la contraseña 
 
router.put('/api/reset-password/:token', [
  verifySignUp.checkNullValue,
  authJwt.verifyToken
],
resetUserpwd.ChangePasswordEmail


  // código para verificar el token y mostrar la página de reinicio de contraseña
);


