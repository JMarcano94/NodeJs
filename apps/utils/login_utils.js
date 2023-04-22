const bcrypt = require('bcryptjs');
const { text } = require('body-parser');

const saltRounds = 10
const salt= bcrypt.genSaltSync(saltRounds);

const generateHash = (data)=> {
  return bcrypt.hashSync(data, salt);
}


module.exports = {
  generateHash,
};