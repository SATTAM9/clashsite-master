const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");
const bcrypt = require("bcrypt");
const validatorMiddleware = require("../middleware/validatorMiddleware");
const User = require("../models/User");

exports.createUserValidator = [
  check("first_name")
    .notEmpty()
    .withMessage("name required!")
    .isLength({ min: 3 })
    .withMessage("too short")
    .isLength({ max: 32 })
    .withMessage("too long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("email required!")
    .isEmail()
    .withMessage("enter valid email ")
    .custom((email) =>
      User.findOne({ email: email }).then((user) => {
        if (user) {
          // eslint-disable-next-line prefer-promise-reject-errors
          return Promise.reject("this email already used");
        }
      })
    ),

  check("password")
    .notEmpty()
    .withMessage("password required!")
    .isLength({ min: 6 })
    .withMessage("too short")
    .isLength({ max: 32 })
  
,
  check("role")
    .optional()
    .isIn(["admin", "client", "manager"])
    .withMessage(" admin or client or manager "),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage(" enter valid phone "),

  check("profileImage").optional(),

  check("active").optional(),

  validatorMiddleware,
];
//admin
exports.updateUserValidator = [
  check("id").isMongoId().withMessage("invalid user id"),
  check("first_name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("too short")
    .isLength({ max: 32 })
    .withMessage("too long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .optional()
    .isEmail()
    .withMessage("enter valid email ")
    .custom((email) =>
      User.findOne({ email: email }).then((user) => {
        if (user) {
          // eslint-disable-next-line prefer-promise-reject-errors
          return Promise.reject("this email already used");
        }
      })
    ),

  check("role")
    .optional()
    .isIn(["admin", "client", "manager"])
    .withMessage(" admin or client or manager "),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage(" enter valid phone "),

  check("profileImage").optional(),

  check("active").optional(),
  validatorMiddleware,
];

//user
exports.updateME = [
  check("first_name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("too short")
    .isLength({ max: 32 })
    .withMessage("too long")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .optional()
    .isEmail()
    .withMessage("enter valid email ")
    .custom((email) =>
      User.findOne({ email: email }).then((user) => {
        if (user) {
          // eslint-disable-next-line prefer-promise-reject-errors
          return Promise.reject("this email already used");
        }
      })
    ),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage(" enter valid phone "),

  check("profileImage").optional(),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("invalid category id"),
  validatorMiddleware,
];

exports.getUserValidator = [
  check("id").isMongoId().withMessage("invalid user id enter valid "),
  validatorMiddleware,
];
//admin
exports.changeUserPassValidator = [
  check("id").isMongoId().withMessage("Invalid user ID"),
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .custom(async (val, { req }) => {
      const user = await User.findById(req.params.id);
      if (!user) throw new Error("User not found");

      const isCorrect = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrect) throw new Error("Current password is incorrect");
    }),
  body("confermPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((val, { req }) => {
      if (val !== req.body.newPassword) {
        throw new Error("Confirm password must match new password");
      }
      return true;
    }),
  validatorMiddleware,
];

//user
exports.changeMyPassword = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  body("password")
    .notEmpty()
    .withMessage("New password is required")
    .custom(async (val, { req }) => {
      const user = await User.findById(req.user.id);
      if (!user) throw new Error("User not found");
      const isCorrect = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrect) throw new Error("Current password is incorrect");
    }),

  body("confermPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error("Confirm password must match new password");
      }
      return true;
    }),
  validatorMiddleware,
];
