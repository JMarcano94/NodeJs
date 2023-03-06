module.exports = (sequelize, Datatypes) => {
    const User = sequelize.define("users", {
      
      username: {
        type: Datatypes.STRING,
        allowNull: false

      },
      email: {
        type: Datatypes.STRING,
        unique: true,
        isEmail: true, //Verificando si cumple parametro email
        allowNull: false
      },
      password: {
        type: Datatypes.STRING,
        allowNull: false
      },
      resetPass:{
        type: Datatypes.BOOLEAN,
        // los valores boleanos a partir de la v5 fueron cambiado a 1 y 0 haciendo referencia a true y false
        default: 0,
      },
    });
  
    return User;
  };

