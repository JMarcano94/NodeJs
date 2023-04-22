const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const generateHash = require('../utils/login_utils')


const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");


require('dotenv').config()

async function signup(req, res) {
  try {
    const { username, email, password, roles } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = await createUser(username, email, hashedPassword);
    const userRoles = roles ? await findRolesByName(roles) : [1];
    await user.setRoles(userRoles);

    return sendSuccessResponse(res, "User was registered successfully!");
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
}

async function createUser(username, email, password) {
  return await User.create({ username, email, password });
}

async function findRolesByName(roleNames) {
  return await Role.findAll({
    where: {
      name: {
        [Op.or]: roleNames,
      },
    },
  });
}

function sendSuccessResponse(res, message) {
  return res.send({ message });
}


//verificando credenciales del usuario

async function signin(req, res) {
  try {
    const { username, password } = req.body;
    const user = await findUserByUsername(username);
    validateUser(user);

    const passwordIsValid = validatePassword(password, user.password);
    validatePasswordIsValid(passwordIsValid);

    const jwtToken = generateJwtToken(user);
    const authorities = await verifyUserRoles(user);

    return sendSuccessResponse(res, {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: jwtToken
    });
  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
}

async function findUserByUsername(username) {
  return await User.findOne({ where: { username } });
}

function validateUser(user) {
  if (!user) {
    throw new Error("User Not found.");
  }
}

function validatePassword(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}

function validatePasswordIsValid(passwordIsValid) {
  if (!passwordIsValid) {
    throw new Error("Invalid Password!");
  }
}

function generateJwtToken(user) {
  return jwt.sign({ email: user.email }, config.secret, {
    expiresIn: '1h'
  });
}

async function verifyUserRoles(user) {
  const authorities = [];
  const roles = await user.getRoles();
  for (let i = 0; i < roles.length; i++) {
    authorities.push("ROLE_" + roles[i].name.toUpperCase());
  }
  return authorities;
}

function sendSuccessResponse(res, data) {
  return res.status(200).send(data);
}

function sendErrorResponse(res, message) {
  return res.status(500).send({ message });
};

module.exports= {
  signin,
  signup
}



  




