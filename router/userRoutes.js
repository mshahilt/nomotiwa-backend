const express = require("express");
const { authenticateUser, verifyOTP, getUserWithEmail } = require("../controller/userController"); // Check this path

const router = express.Router();

router.post("/authanticate", authenticateUser);
router.post("/verify-otp", verifyOTP);
router.get('/getUser/:email', getUserWithEmail);
module.exports = router;
