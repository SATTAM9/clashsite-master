const mongoose = require("mongoose");
const bcrypt = require("bcrypt");



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
      minlength: [6, "password id to short"],
    },
    name: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "client"],
      default: "client",
    },
    provider: {
      type: String,
      enum: ["normal", "google", "discord"],
      default: "normal",
    },
    providerId: String,
    id2: {
      type: String,
      trim: true,
    },
    dateOfChangePassword: {
      type: Date,
    },
    
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    passwordResetCode: String,
    expireResetCode: Date,
    verifyResetCode: Boolean,


    linkedPlayers: {
      type: [String],
      default: [],
    },
    linkedPlayers: {
      type: [String],
      default: [],
    },

    linkedClans: {
      type: [
        {
          tag: {
            type: String,
            required: true,
            trim: true,
          },
          verify: { type: Boolean, default : false },
          createdAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// module.exports = mongoose.model("user", userSchema);
module.exports = mongoose.models.user || mongoose.model("user", userSchema);
