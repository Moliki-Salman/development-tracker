const { Child } = require("../model/child-model");
const ErrorResponse = require("../controllers/error-response");

const userChild = async (req, res, next) => {
const childData  = {
  fullname: req.body.fullname,
  biologicalSex: req.body.biologicalSex,
  dob: req.body.dob
 }
try {
if (!childData) {
  return next(new ErrorResponse("Content cannot be empty", 400));
}
const result = await Child.create(childData)
res.status(200).json({message: "child data registered successfully", result});
next()
} catch (err) {
console.log(err);
return next(err)
}
}

module.exports = { userChild };
