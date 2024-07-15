const express = require("express");
const devRouter = express.Router();
const { dev1 } = require("../controllers/tracker-controller");

// devRouter.post("/tracker", devTracker);

devRouter.get("/dev", dev1);

module.exports = { devRouter };
