import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";
import crypto from "crypto";
import { AppError } from "../utils/appError.mjs";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    googleId: {
      type: String,
      default: null,
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  }
);

userSchema
  .virtual("confirmPassword")
  .set(function (value) {
    this._confirmPassword = value;
  })
  .get(function () {
    return this._confirmPassword;
  });

userSchema.pre("save", async function (next) {
  // Only run if password is modified or new
  if (!this.isModified("password")) return next();
  // Validate confirmPassword matches
  if (this.password !== this._confirmPassword) {
    return next(new AppError("password and confirmPassword must match", 400));
  }
  // Hash the password
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ** methode to check if the password is correct
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// ** function to create a token for user to reset his password
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken; // plain token to send to user
};

const User = model("User", userSchema);
export default User;
