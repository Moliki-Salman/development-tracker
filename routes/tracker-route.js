const express = require("express");
const devRouter = express.Router();
const { devTracker, dev1 } = require("../controllers/tracker-controller");

devRouter.post("/tracker", devTracker);

devRouter.post("/dev", dev1);

module.exports = { devRouter };
