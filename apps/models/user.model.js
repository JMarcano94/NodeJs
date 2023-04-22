module.exports = (sequelize, Datatypes) => {
    const user = sequelize.define("Users", {

      id: {
        primaryKey: true,
        autoIncrement: true,
        type: Datatypes.INTEGER,
        allowNull: false
      },
      
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
      resetPass: {
        type: Datatypes.BOOLEAN,
        default: false
      }
    });
  
    return user;
  };

