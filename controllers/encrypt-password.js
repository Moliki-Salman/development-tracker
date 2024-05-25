const crypto = require("crypto");
const OTP = require("otp-generator");
const dotenv = require("dotenv");
const path = require("path");
// Construct the path to the .env file in the root folder
const envPath = path.resolve(__dirname, "../.env");
dotenv.config({ path: envPath });

const authpassword = (salt, password) => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(process.env.SECRET_KEY)
    .digest("hex");
};

const hash = () => crypto.randomBytes(64).toString("hex");

const generateOTP = () => {
  const otp = OTP.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });
return otp
};

module.exports = { authpassword, hash, generateOTP };
