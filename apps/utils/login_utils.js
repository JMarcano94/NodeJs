const bcrypt = require('bcryptjs');
const { text } = require('body-parser');

const saltRounds = 10
const salt= bcrypt.genSaltSync(saltRounds);

const generateHash = (text)=> {
  return bcrypt.hashSync(text, salt);
}


module.exports = {
  generateHash,
};