const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email must be unique"],
      lowercase: true,
      trim: true,
    },
    verifyEmail: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
    },
    name: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "client", "manager"],
      default: "client",
    },
    id2: {
      type: String,
      trim: true,
    },
    dateOfChangePassword: {
      type: Date,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", userSchema);
