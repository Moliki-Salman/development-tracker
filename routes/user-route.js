const express = require("express");
const userRouter = express.Router();
const {
  signup,
  userEmailVerification,
  login,
  resendVerificationLink,
  resetPassword,
} = require("../controllers/user-controller");
const{ userAuth } = require("../config/authenticate")
// const { resetPassword } = require("../controllers/userResetPassword");
const { userChild } = require("../controllers/child-controller");

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/emailverification", userEmailVerification);
userRouter.get("/resetpassword", resetPassword);
userRouter.post("/resendverificationlink", resendVerificationLink);
userRouter.post("/child",userAuth, userChild);

module.exports = { userRouter };
