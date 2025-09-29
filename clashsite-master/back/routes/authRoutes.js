const express = require("express");
const authController = require("../controllers/auth");
const roles = require("../middleware/role");
const requireAuth = require("../middleware/isAuth");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgetpassword", authController.forgetPassword);
router.post("/verify-email/:userId", authController.verifyEmail);

router.post("/addnewpassword", authController.addNewPassword);
router.post(
  "/updatePassword",
  requireAuth,
  roles.allowedTo("client", "admin"),
  authController.updatePassword
);
router.post(
  "/updateEmail",
  requireAuth,
  roles.allowedTo("client", "admin"),
  authController.updateEmail
);
router.post(
  "/logout",
  requireAuth,
  roles.allowedTo("client", "admin"),
  authController.logout
);

module.exports = router;
