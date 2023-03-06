module.exports = (sequelize, Datatypes) => {
    const Role = sequelize.define("roles", {
      id: {
        type: Datatypes.INTEGER,
        primaryKey: true
      },
      name: {
        type: Datatypes.STRING
      }
    });
  
    return Role;
  };