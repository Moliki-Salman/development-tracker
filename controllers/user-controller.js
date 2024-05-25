const path = require("path");
const fs = require("fs");
const ErrorResponse = require("../controllers/error-response");
const { User } = require("../model/user-model");
const { authpassword, hash, generateOTP } = require("./encrypt-password");

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

module.exports = { signup };
