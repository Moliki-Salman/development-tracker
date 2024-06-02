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
// get otp from the request body
  const otp = req.query.otp;
  //find if otp eixst in database
  const checkOTP = await User.findOne({ where: { otp: otp } });
  console.log(checkOTP);
};
if (!checkOTP) {
  return next(new ErrorResponse("otp not found....", 404));
} else{
  return res
    .status(201)
    .json({ message: "Email Verification successful, Proceed to login" });
}

// check that the otp in the req is the same as the stored in the database


module.exports = { signup };


const verifyAdminEmail = async (req, res, next) => {
  try {
    // create connection to database
    const connection = await connectDB();

    // get credentials entered during login
    const emailToken = req.query.emailToken;

    console.log(emailToken);

    // run a query to confirm the email enetered exists in the database
    const checkToken = await runQuery(connection, AdminEmailToken, [
      emailToken,
    ]);

    console.log(checkToken);

    if (!emailToken) {
      return next(new ErrorResponse("EmailToken not found....", 404));
    }

    // check that the emailToken in the req is the same as the on in the database
    if (
      !checkToken ||
      checkToken.length === 0 ||
      checkToken[0].emailToken !== emailToken
    ) {
      return next(
        new ErrorResponse("Email Verification Failed, invalid token", 401)
      );
    }

    // checkToken.emailToken = null;
    isVerified = true;

    const updateVerification = await runQuery(connection, updatAdminVerify, [
      isVerified,
      emailToken,
    ]);

    // send a successful login message to the client side
    res.status(200).json({
      status: true,
      message: "Email Verification successful, Proceed to login",
      data: { isVerified: true },
    });
  } catch (err) {
    // handle error using the inbult error details
    return next(err);
  }
};