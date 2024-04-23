const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();
// const saltRounds = bcrypt.genSaltSync(10);
const saltRounds = 10;
const {
  checkConnection,
  queryValues,
  userSignup,
  userLogin,
} = require("../model/users-model");

const signup = async (req, res) => {
  const user = {
    fullname: req.body.fullname,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, saltRounds),
  };
  if (!user) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const connection = await checkConnection();
  try {
    const result = await queryValues(connection, userSignup, [
      user.fullname,
      user.email,
      user.password,
    ]);
    const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY);
    res
      .status(201)
      .json({ mesaage: "User created Successfully", result, token });
  } catch (err) {
    res.satus(400).json({ err, message: "invalid" });
    console.log(err);
  }
};

const login = async (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };
  const connection = await checkConnection();
  try {
    const result = await queryValues(connection, userLogin, [user.email]);
    const comparePassword = bcrypt.compare(user.password, result[0].password);
    if (comparePassword) {
      const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY);
      res.status(200).json({ message: "User login successful", token });
      console.log(token);
    } else {
      res.status(403).json({ message: "invalid Login Credentials" });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { signup, login };
