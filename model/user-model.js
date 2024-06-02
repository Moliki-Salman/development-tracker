const Sequelize = require("sequelize");
const { sequelize } = require("../config/connection");

const User = sequelize.define("user", {
  user_id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNul: false,
    primaryKey: true,
  },
  fullname: {
    type: Sequelize.STRING,
    allowNul: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNul: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNul: false,
  },
  salt: {
    type: Sequelize.STRING,
    allowNul: false,
  },
  otp: {
    type: Sequelize.STRING,
    allowNul: false,
  },
  isVerified: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

sequelize
  .sync()
  .then(() => {
    console.log("user table created successfully");
  })
  .catch((err) => {
    console.error("Error creating user table", err);
  });

module.exports = { User };
