const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const sendEmail = require("../utiles/sendEmail");
const { verifyEmailTemplate } = require("../message/verifyEmail");
const generateToken = require("./generateToken");
const { ApiError } = require("../middleware/errorHandler");

exports.getUserData = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "this email is not exist " });
  }

  return res.status(201).json({
    email: user.email,
    linkedPlayers: user.linkedPlayers,
    linkedClans: user.linkedClans,
  });
});

exports.addlinkedPlayers = asyncHandler(async (req, res, next) => {
  const { email, playerTag } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "this email is not exist" });
  }

  if (user.linkedPlayers.includes(playerTag)) {
    return res
      .status(400)
      .json({ message: "this playerTag is already linked" });
  }
  user.linkedPlayers.push(playerTag);
  await user.save();
  return res
    .status(201)
    .json({ email: user.email, linkedPlayers: user.linkedPlayers });
});

exports.removelinkedPlayers = asyncHandler(async (req, res, next) => {
  const { email, playerTag } = req.body;
  const user = await User.findOne({
    email,
  });

  if (!user) {
    return res.status(400).json({ message: "this email is not exist" });
  }

  if (!user.linkedPlayers.includes(playerTag)) {
    return res.status(400).json({ message: "this playerTag is not linked" });
  }
  user.linkedPlayers = user.linkedPlayers.filter((tag) => tag !== playerTag);
  await user.save();
  return res
    .status(201)
    .json({ email: user.email, linkedPlayers: user.linkedPlayers });
});

// ok
exports.addlinkedClans = asyncHandler(async (req, res, next) => {
  const { email, clanTag } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "this email is not exist" });
  }

  // شوف هل فيه نفس التاج موجود بالفعل
  const alreadyLinked = user.linkedClans.some((c) => c.tag === clanTag);
  if (alreadyLinked) {
    return res.status(400).json({ message: "this clanTag is already linked" });
  }

  // ضيف object جديد بالـtag (و verify = false افتراضى)
  user.linkedClans.push({ tag: clanTag });

  await user.save();

  return res.status(201).json({
    email: user.email,
    linkedClans: user.linkedClans,
  });
});

exports.removelinkedClans = asyncHandler(async (req, res, next) => {
  const { email, clanTag } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "this email is not exist" });
  }

  const exists = user.linkedClans.some((c) => c.tag === clanTag);
  if (!exists) {
    return res.status(400).json({ message: "this clanTag is not linked" });
  }

  // احذف العنصر اللى تاجه = clanTag
  user.linkedClans = user.linkedClans.filter((c) => c.tag !== clanTag);

  await user.save();

  return res.status(201).json({
    email: user.email,
    linkedClans: user.linkedClans,
  });
});

exports.getVerifiedClanTags = asyncHandler(async (req, res) => {
  const users = await User.find(
    { "linkedClans.verify": true },
    { linkedClans: 1, email: 1 }
  );

  const verifiedTags = users.flatMap((u) =>
    u.linkedClans.filter((c) => c.verify).map((c) => c.tag)
  );

  return res.status(200).json({ verifiedTags });
});

//ok
exports.getAllClanTags = asyncHandler(async (req, res) => {
  const users = await User.find({}, { linkedClans: 1, email: 1 });

  const allTags = users.flatMap((u) => u.linkedClans.map((c) => c.tag));

  return res.status(200).json({ allTags });
});

exports.verifyClanTag = asyncHandler(async (req, res) => {
  const { email, clanTag } = req.body;

  const user = await User.findOneAndUpdate(
    { email, "linkedClans.tag": clanTag },
    { $set: { "linkedClans.$.verify": true } },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ message: "User or clan tag not found" });
  }

  return res.status(200).json({
    message: "Clan tag verified successfully",
    email: user.email,
    linkedClans: user.linkedClans,
  });
});

// PUT /api/users/update
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { email, linkedPlayers, role } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (linkedPlayers !== undefined) user.linkedPlayers = linkedPlayers;
  if (role !== undefined) user.role = role;

  await user.save();

  return res.status(200).json({
    message: "User updated successfully",
    user,
  });
});

// DELETE /api/users/delete
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOneAndDelete({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({ message: "User deleted successfully" });
});

//for admin

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  // const { email } = req.body;
  const users = await User.find();
  if (!users) {
    return res.status(400).json({ message: "not found users" });
  }

  return res.status(201).json({ users });
});
