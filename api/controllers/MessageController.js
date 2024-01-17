const express = require("express");
const router = express.Router();
const oneSignal = require("../config/onesignal");
const User = require("../models/UserMakeupModel");
router.post("/", async (req, res) => {
  try {
    const oneSignalReceivedMessage = util.format(
      req.body.name,
      req.body.image,
      req.body.title,
      req.body.description
    );
    const devices = [];
    req.body.devices.map((d) => {
      if (d) {
        if (d.oneSignalId !== "") devices.push(d.oneSignalId);
      }
    });
    if (devices.length > 0) {
      oneSignal.sendNotification(devices, oneSignalReceivedMessage);
    }
  } catch (err) {
    res.send("Error");
  }
});
router.post("/all", async (req, res) => {
  try {
    const oneSignalReceivedMessage = util.format(
      req.body.name,
      req.body.image,
      req.body.title,
      req.body.description
    );
    const data = await User.find(
      {},
      {
        device: 1,
      }
    ).sort({ dateUpdate: -1 });
    const devices = [];
    data.map((d) => {
      if (d) {
        if (d.oneSignalId !== "") devices.push(d.oneSignalId);
      }
    });
    if (devices.length > 0) {
      oneSignal.sendNotification(devices, oneSignalReceivedMessage);
    }
  } catch (err) {
    res.send("Error");
  }
});
module.exports = router;
