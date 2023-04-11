

module.exports = (sequelize, Datatypes) => {
  const userPassword = sequelize.define("UsersPassword", {
    
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: Datatypes.INTEGER,
      allowNull: false
    },
    userID: {
      type: Datatypes.INTEGER,
      field: 'user_id',
      allowNull: false
    },

    email: {
      type: Datatypes.STRING,
      unique: true,
      isEmail: true, //Verificando si cumple parametro email
      allowNull: false
    },
    resetPass:{
      type: Datatypes.BOOLEAN,
      defaultValue: false,
      field: 'is_used',
    },
    token: {
      type: Datatypes.STRING,
      required: true,
    },
    
  });

  return userPassword;
};

