const bcrypt = require("bcrypt");
const saltRounds = 10;
const {
  checkConnection,
  queryValues,
  userLogin,
  userResetPassword,
} = require("../model/user-model");

const resetPassword = async (req, res) => {
  const user = {
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, saltRounds),
  };
  const connection = await checkConnection();
  try {
    const resultLogin = await queryValues(connection, userLogin, [user.email]);
    if (resultLogin) {
      const resultResetPassword = await queryValues(
        connection,
        userResetPassword,
        [user.password, user.email]
      );
      res
        .status(200)
        .json({ message: "reset password successful", resultResetPassword });
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports = { resetPassword };
