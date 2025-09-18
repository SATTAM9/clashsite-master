const express = require("express");
const authController = require("../controllers/user");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgetpassword", authController.forgetPassword);
router.post("/addnewpassword", authController.addNewPassword);
router.post("/updatePassword", authController.updatePassword);
router.post("/updateEmail", authController.updateEmail);

module.exports = router;
