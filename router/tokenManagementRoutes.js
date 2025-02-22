const express = require("express");
const { incrementToken, getTokenStatus } = require("../controller/tokenController");

const router = express.Router();

router.post("/increment-token", incrementToken);
router.get("/token-status/:doctorId", getTokenStatus);

module.exports = router;
