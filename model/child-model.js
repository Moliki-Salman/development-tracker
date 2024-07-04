const Sequelize = require("sequelize");
const { sequelize } = require("../config/connection");

const Child = sequelize.define("child", {
  child_id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  fullname: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  biologicalSex: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  dob: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});

sequelize
  .sync()
  .then(() => {
    console.log("child table created successfully");
  })
  .catch((err) => {
    console.error("Error creating child database table", err);
  });

module.exports = { Child };
