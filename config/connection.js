const Sequelize = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const mysql2 = require("mysql2");
const sequelize = new Sequelize(
  "biw5tmo9kixy1gopsdof", //db name
  "uvllhavataemedaz", //user , for local db set it to root
  "RPBEtYuwBVkKDH7H3fjd", // password
  {
    host: "biw5tmo9kixy1gopsdof-mysql.services.clever-cloud.com", //for local, set it to localhost
    dialect: "mysql",
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Database is connected");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = { sequelize };
