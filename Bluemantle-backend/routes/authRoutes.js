const express = require("express");
const router = express.Router();
const { login, verifyOtp } = require("../controllers/authController");
const { validateLogin } = require("../validations/authValidation");

router.post("/login", validateLogin, login);
router.post("/verify-otp", verifyOtp);

module.exports = router;
