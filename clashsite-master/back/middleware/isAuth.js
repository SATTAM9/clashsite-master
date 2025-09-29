const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const requireAuth = asyncHandler(async (req, res, next) => {
  // check if token exists
  const authheader = req.headers.authorization || req.headers.Authorization;
  if (!authheader || !authheader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "unAuth" });
  }

  const token = authheader.split(" ")[1];

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  // check if user exists
  const user = await User.findById(decoded.userInfo.id);
  if (!user) {
    return res.status(401).json({ message: "unAuth user" });
  }
  //check if user change password after generate token
  if (user.dateOfChangePassword) {
    const passChangesAt = parseInt(
      user.dateOfChangePassword.getTime() / 1000,
      10
    );
    if (passChangesAt > decoded.iat) {
      return next(new Error("password is changed please login again", 401));
    }
  }

  req.user = decoded.userInfo;
  next();
});

module.exports = requireAuth;