const {
  checkConnection,
  queryValues,
  createChildData,
} = require("../model/child-model");

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

const child = async

module.exports = { child };
