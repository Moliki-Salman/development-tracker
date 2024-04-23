const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
// const { userRouter } = require("./routes/user-route");
// const { devRouter } = require("./routes/devTracker-route");
const dotenv = require("dotenv");
dotenv.config();
PORT= process.env.PORT

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
// app.use("/", userRouter);
// app.use("/", devRouter);

app.listen(PORT, () => {
  console.log(`app is listening to port ${PORT}`);
});
