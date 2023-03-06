const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
//ruta para registro
  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

//ruta para logueo

  app.post("/api/auth/signin", controller.signin);

  //ruta para enviar el correo electronico.

  app.put('/reset-password', 
  [verifySignUp.CheckEmailExist],
  controller.resetPassword,
  );

  //ruta para reiniciar la contraseña 
 
app.put('/reset-password/:token', (req, res) => {
  const token = req.params.token;
  // código para verificar el token y mostrar la página de reinicio de contraseña
});

};


