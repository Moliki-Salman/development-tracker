const { Child } = require("../model/child-model");

// const child = async (req, res) => {
// const { fullname, biologicalSex, dob } = req.body
//   try {
//     const childData = {
//       fullname: req.body.fullname,
//       gender: req.body.gender,
//       dob: req.body.dob,
//       userEmail: req.body.userEmail,
//     };
//     const connection = await checkConnection();
//     const createChild = await queryValues(connection, createChildData, [
//       childData.fullname,
//       childData.gender,
//       childData.dob,
//       childData.userEmail,
//     ]);
//     // console.log(createChild);
//     res.status(200).json(createChild);
//   } catch (error) {
//     console.log(error);
//   }
// }

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
} catch (err) {
console.log(err);
}
}

module.exports = { userChild };
