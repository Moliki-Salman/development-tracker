const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const userAuth = async (req, res, next) => {
  const bearer = req.headers["authorization"];
  if (typeof bearer == "undefined") {
    res.status(403).json({ message: "unauthorized user" });
  } else {
    try {
      const webToken = bearer.split(" ")[1];
      if (!webToken) {
        res.status(404).json({ message: "valid token required" });
      }
      req.decodedToken = jwt.verify(webToken, process.env.SECRET_KEY);
    } catch (err) {
      return next(err);
    }
  }
};

module.exports = { userAuth };