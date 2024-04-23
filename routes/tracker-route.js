const express = require("express");
const devRouter = express.Router();
const { devTracker } = require("../controllers/tracker-controller");

devRouter.post("/tracker", devTracker);

module.exports = { devRouter };
