const path = require("path");
const fs = require("fs");
const ErrorResponse = require("../controllers/error-response");
const { User } = require("../model/user-model");
const { authpassword, hash, generateOTP } = require("./encrypt-password");
const { sendMail } = require("../controllers/email-config");

const readEmailTemplate = (templateName) => {
  const emailTemplatePath = path.join(
    __dirname,
    "..",
    "templates",
    `${templateName}.html`
  );
  const emailTemplate = fs.readFileSync(emailTemplatePath, "utf-8");
  return emailTemplate;
};

//register a user by email, email verification
/*
email template function
signup{
  req.body fullname,emAIL, PASSWORD
  check if email already exist in the database
define validEmailRegex
check for !validEmailRegex
check for  the password entered meets the requirements
define salt and hash the salt
define password // hash the password entered using the function created to hash
read email template
send email
return result
//what i want to learn better insighnt in my proficiency in pyton to 80%
i want to learn and grow at what percentage.
i want to be able to add machine learning skills to my better science skills.
show me you are already in point a and ineed to move to point be.
do i have skiils gaps, why not create the skill gaps as a point  to learn.
*/
const signup = async (req, res, next) => {
  const salt = hash();
  const { fullname, email, password } = req.body;
  if (!fullname || !email || !password) {
    return next(new ErrorResponse("Content cannot be empty", 400));
  }
  try {
    const validEmailRegex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (!validEmailRegex.test(email)) {
      return next(new ErrorResponse("Invalid email format", 400));
    }

    if (
      !(
        password.length >= 6 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password)
      )
    ) {
      return next(
        new ErrorResponse("Password does not meet the requirements", 401)
      );
    }

    const hashedPassword = authpassword(salt, password);

    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return next(new ErrorResponse("User already exist", 401));
    }

    const otp = generateOTP();

    const newUser = {
      fullname: req.body.fullname,
      email: req.body.email,
      password: hashedPassword,
      salt: salt,
      otp: otp,
    };
    const result = await User.create(newUser);

    const emailTemplate = readEmailTemplate("verification-email");
    const firstName = fullname.split(" ")[0];
    const emailContent = emailTemplate
      .replace("{{firstName}}", firstName)
      .replace("{{otp}}", otp);

    const options = {
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: "Verify your email...",
      html: emailContent,
    };

    await sendMail(options);
    return res
      .status(201)
      .json({ message: "User created successfully", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server error",
      error: JSON.stringify(error),
    });
  }
};

const userEmailVerification = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!otp) {
      return next(new ErrorResponse("Input OTP....", 400));
    }

    if (!email) {
      return next(new ErrorResponse("Email is required....", 400));
    }

    console.log("Checking for user with email:", email);

    const user = await User.findOne({
      where: { email },
    });

    console.log("User found:", user);

    if (!user) {
      return next(new ErrorResponse("User not found....", 404));
    }

    if (user.otp !== otp) {
      return next(new ErrorResponse("Invalid OTP....", 401));
    }

    console.log("OTP is valid, updating user status");

    const result = await User.update(
      { isVerified: true, otp: "" },
      { where: { email } }
    );

    console.log("User update result:", result);

    res.status(200).json({
      message: "Email Verification successful, Proceed to login",
    });
  } catch (err) {
    console.error("Error during user verification:", err);
    return next(err);
  }
};

const login = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return next(new ErrorResponse("Account does not exist. Signup", 409));
    }
    const userSalt = await User.findOne({
      where: { email: email },
      attributes: ["salt"],
    });
    if (!userSalt) {
      return next(new ErrorResponse("User salt not found", 404));
    }
    const hashedPassword = authpassword(salt, password);
    console.log("HERE IS THE SALT", userSalt);
    res.status(200).json(userSalt);
  } catch (err) {
    console.error("Error during user verification:", err);
    return next(err);
  }
};

//function to resend verification link
const resendVerificatioLink = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({
      where: { email },
    });
    if (!user) {
      return next(new ErrorResponse("Invalid Email", 401));
    }
    const otp = generateOTP();

    const result = await User.update({ otp: otp }, { where: { email } });

    const emailTemplate = readEmailTemplate("verification-email");
    const firstName = fullname.split(" ")[0];
    const verificationLink = `http://localhost:3000/resentvericationlink?otp=${otp}`;

    const emailContent = emailTemplate
      .replace("{{firstName}}", firstName)
      .replace("{verificationLink}}", verificationLink);

    const options = {
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: "Verify your email...",
      html: emailContent,
    };

    await sendMail(options);
    return res
      .status(200)
      .json({ message: "Email resent  successfully", result: otp });
  } catch (err) {
    return next(err);
  }
};

const resetPassword = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return next(new ErrorResponse("User does not exist", 409));
    }
    const salt = hash();
    const hassPassword = authpassword(salt, password);

    const result = await User.update(
      { salt: salt, password: hassPassword },
      { where: { email } }
    );

    return res
      .status(200)
      .json({ message: "Pssword reset successfully", result });
  } catch (err) {
    console.error("Error during reset:", err);
    return next(err);
  }
};

module.exports = {
  signup,
  userEmailVerification,
  login,
  resendVerificatioLink,
};
