const bcrypt = require("bcrypt");
const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const sendEmail = require("../utiles/sendEmail");
const { verifyEmailTemplate } = require("../message/verifyEmail");
const generateToken = require("./generateToken");
const { ApiError } = require("../middleware/errorHandler");
const SALT_ROUNDS = 10;

exports.signup = asyncHandler(async (req, res, next) => {
  const { email, password, provider, id2 } = req.body;
  console.log(provider);

  if (provider === "normal" && (!email || !password)) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  if ((provider === "google" && !email) || (provider === "discord" && !email)) {
    return res.status(400).json({ message: " email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "this email is already exist" });
    }

    const newUser = await User.create(req.body);

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?user=${newUser._id}`;
    const html = verifyEmailTemplate(
      newUser.name || newUser.email,
      verificationUrl
    );

    const accessToken = generateToken.accessToken(newUser);
    const refreshToken = generateToken.refreshToken(newUser);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: false,
      // secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    try {
      emailSent = await sendEmail({
        email: newUser.email,
        subject: "confirm your email",
        html,
      });
    } catch (err) {
      console.error("Email sending error:", err);
    }

    return res.status(201).json({ newUser, accessToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ m: "server error" });
  }
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password, provider } = req.body;

  if (provider === "normal" && (!email || !password)) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  if ((provider === "google" && !email) || (provider === "discord" && !email)) {
    return res.status(400).json({ message: " email is required" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "this email not found" });
  }

  if (user.provider === "normal") {
    const passIsTrue = await bcrypt.compare(password, user.password);
    if (!passIsTrue) {
      return next(new ApiError("incorrect password or email", 404));
    }
  }

  const accessToken = generateToken.accessToken(user);
  const refreshToken = generateToken.refreshToken(user);

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: false,
    // secure: true,
    sameSite: "strict",
    domain: "localhost",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
  // console.log(accessToken);

  return res.status(201).json({ user, accessToken });
});

exports.forgetPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.json({ m: "this email is not exist" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/resetpassword?user=${user._id}&token=${resetToken}`;

    const html = `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2 style="text-align:center;color:#ffcc00;">ClashVip – Password Reset</h2>
    <p>Hi Chief,</p>
    <p>We received a request to reset the password for <strong>${
      user.email
    }</strong>.</p>
    <p>Click the button below to set a new password:</p>
    <p style="text-align:center;margin:20px 0;">
      <a href="${resetLink}" style="background:#ffcc00;color:#000;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">
        Set a new password
      </a>
    </p>
    <p>If you didn’t request this, you can safely ignore this email.</p>
    <p style="text-align:center;">
      <a href="${
        process.env.FRONTEND_URL
      }/login" style="color:#ffcc00;text-decoration:none;">
        Back to Login
      </a>
    </p>
    <hr/>
    <p style="font-size:12px;text-align:center;color:#888;">© ${new Date().getFullYear()} ClashVip</p>
  </div>
`;
    let emailSent = false;
    try {
      emailSent = await sendEmail({
        email: user.email,
        subject: "ClashVip – Reset Your Password",
        html,
        from: '"ClashVip" <no-reply@clashvip.com>',
      });
    } catch (err) {
      console.error("Email sending error:", err);
    }

    return res.json({ success: true, message: "Reset link sent successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ m: "server error" });
  }
};

exports.addNewPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ m: "Invalid request" });
  }

  try {
    const user = await User.findOne({ resetPasswordToken: token });

    if (!user) {
      return res.status(400).json({ m: "Invalid or expired reset token" });
    }

    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ m: "Reset token has expired" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ m: "Something went wrong" });
  }
};

exports.updateEmail = asyncHandler(async (req, res) => {
  const { localEmail, newEmail } = req.body;

  if (!localEmail || !newEmail) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findOne({ email: localEmail });
  if (!user) {
    return res.status(404).json({ message: "some thing wrong" });
  }

  const emailExists = await User.findOne({ email: newEmail });
  if (emailExists) {
    return res.status(200).json({ newEmail });
  }

  user.email = newEmail;
  await user.save();

  const responseUser = { email: user.email };
  if (user.name) {
    responseUser.name = user.name;
  }

  return res
    .status(200)
    .json({ user: responseUser, message: "Email updated successfully" });
});

exports.updatePassword = asyncHandler(async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  if (!email || !currentPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const passIsTrue = await bcrypt.compare(currentPassword, user.password);

  if (!passIsTrue) {
    return res.status(400).json({ message: "current password is not correct" });
  }

  user.password = newPassword;
  user.save();

  return res.status(200).json({ message: "password changed succesfully" });
});

exports.logout = asyncHandler(async (req, res, next) => {
  res.clearCookie("jwt", {
    HttpOnly: true,
    sameSite: "none",
  });
  res.json({ message: "logged out" });
});

// POST verify-email/:userId
exports.verifyEmail = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { verifyEmail: true } },
    { new: true }
  );

  if (!user) {
    return res.json({ success: false, message: err.message });
  }

  return res.json({ success: true, message: "Email verified" });
});
