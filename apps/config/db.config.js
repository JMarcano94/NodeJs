module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "war30mjm10",
    DB: "NodeJs",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };