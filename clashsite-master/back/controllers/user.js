const bcrypt = require("bcrypt");
const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const sendEmail = require("../utiles/sendEmail");
const { verifyEmailTemplate } = require("../message/verifyEmail");

const SALT_ROUNDS = 10;

const buildUserPayload = async ({ email, password, name, id2 }) => {
  const userPayload = { email };
  if (typeof name === "string" && name.trim()) {
    userPayload.name = name.trim();
  }
  if (typeof id2 === "string" && id2.trim()) {
    userPayload.id2 = id2.trim();
  }
  if (typeof password === "string" && password) {
    userPayload.password = await bcrypt.hash(password, SALT_ROUNDS);
  }
  return userPayload;
};

exports.signup = async (req, res) => {
  const { email, password, id2, name } = req.body;

  if (!email || (!password && !id2 && !name)) {
    return res.status(400).json({ m: "fill all fields" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ m: "this email is already exist" });
    }

    const userPayload = await buildUserPayload({ email, password, id2, name });
    const newUser = await User.create(userPayload);

    const verificationUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/verify-email?user=${newUser._id}`;
    const html = verifyEmailTemplate(newUser.name || newUser.email, verificationUrl);

    let emailSent = false;
    try {
      emailSent = await sendEmail({
        email: newUser.email,
        subject: "confirm your email",
        html,
      });
    } catch (err) {
      console.error("Email sending error:", err);
    }

    return res.status(201).json({ user: newUser, emailSent });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ m: "server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password, id2, name } = req.body;

  if (!email || (!password && !id2 && !name)) {
    return res.json({ m: "fill all fields" });
  }

  try {
    const user = await User.findOne({ email });

    if (user) {
      const passwordProvided = typeof password === "string" && password;
      const idProvided = typeof id2 === "string" && id2;

      if (passwordProvided && user.password) {
        const storedPassword = user.password;
        let isMatch = false;

        if (storedPassword.startsWith("$2")) {
          isMatch = await bcrypt.compare(password, storedPassword);
        } else {
          isMatch = storedPassword === password;
          if (isMatch) {
            user.password = await bcrypt.hash(password, SALT_ROUNDS);
            await user.save();
          }
        }

        if (!isMatch) {
          return res.json({ m: "enter a valid password " });
        }
      } else if (idProvided && user.id2) {
        if (user.id2 !== id2) {
          return res.json({ m: "enter a valid password " });
        }
      } else {
        return res.json({ m: "enter a valid password " });
      }

      return res.json({ user });
    }

    const userPayload = await buildUserPayload({ email, password, id2, name });
    const newUser = await User.create(userPayload);
    return res.json({ newUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ m: "server error" });
  }
};

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

    const resetLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/resetpassword?user=${user._id}&token=${resetToken}`;
    const html = `
  <p>Hey Chief,</p>
  <p>Someone has requested to reset the password for <strong>${user.email}</strong>.</p>
  <p>You can click the button below to set a new password.</p>
  <p style="text-align:center;margin:20px 0">
    <a href="${resetLink}" style="background:#ffcc00;color:#000;padding:10px 20px;border-radius:6px;text-decoration:none;">
      Set a new password
    </a>
  </p>
  <p>If you don't know what this is about, you can just ignore this email.</p>
  <p><a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/login">Login</a></p>
  `;

    let emailSent = false;
    try {
      emailSent = await sendEmail({
        email: user.email,
        subject: "reset password page",
        html,
      });
    } catch (err) {
      console.error("Email sending error:", err);
    }

    return res.json({ message: "the code is sent", user, emailSent });
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

    user.password = await bcrypt.hash(password, SALT_ROUNDS);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.json({ m: "Password changed successfully", user });
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

  if (!user.password) {
    return res.status(400).json({ message: "Password change is not available" });
  }

  let isMatch = false;
  if (user.password.startsWith("$2")) {
    isMatch = await bcrypt.compare(currentPassword, user.password);
  } else {
    isMatch = user.password === currentPassword;
  }

  if (!isMatch) {
    return res.status(404).json({ message: "current password not correct" });
  }

  user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await user.save();

  return res.status(200).json({ message: "password changed succesfully" });
});
