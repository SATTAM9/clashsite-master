const express = require("express");
const userController = require("../controllers/user");
const roles = require("../middleware/role");
const requireAuth = require("../middleware/isAuth");

const router = express.Router();

router.post(
  "/mydata",
  requireAuth,
  roles.allowedTo("client", "admin"),
  userController.getUserData
);

router.post(
  "/addlinkedClans",
  requireAuth,
  roles.allowedTo("client", "admin"),
  userController.addlinkedClans
);

router.get(
  "/getVerifiedClanTags",
  requireAuth,
  roles.allowedTo("client", "admin"),
  userController.getVerifiedClanTags
);
router.post(
  "/verifyClanTag",
  requireAuth,
  roles.allowedTo("admin"),
  userController.verifyClanTag
);

router.post(
  "/addlinkedplayers",
  requireAuth,
  roles.allowedTo("client", "admin"),
  userController.addlinkedPlayers
);
router.get(
  "/getAllClanTags",
  requireAuth,
  roles.allowedTo("client", "admin"),
  userController.getAllClanTags
);

router.get(
  "/users",
  requireAuth,
  roles.allowedTo("admin"),
  userController.getAllUsers
);

router.put(
  "/update-user",
  requireAuth,
  roles.allowedTo("admin"),
  userController.updateUser
);
router.delete(
  "/delete-user",
  requireAuth,
  roles.allowedTo("admin"),
  userController.deleteUser
);
router.delete(
  "/removelinkedClans",
  requireAuth,
  roles.allowedTo("admin","client"),
  userController.removelinkedClans
);

module.exports = router;
