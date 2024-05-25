const mysql2 = require("mysql2");
const Sequelize = require("sequelize");
const dotenv = require("dotenv");
const path = require("path")

const envPath = path.resolve(__dirname, "../.env");
dotenv.config({ path: envPath });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST, //for local, set it to localhost
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
