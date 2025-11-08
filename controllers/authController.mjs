
import User from "../models/User.mjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { AppError } from "../utils/appError.mjs";

export async function signup(req, res, next) {
  try {
    const { username, email, password, confirmPassword } = req.body;

    const newUser = await User.create({
      username: username?.trim(),
      email: email?.trim(),
      password,
      confirmPassword,
      authProvider: "local",
    });

    res.status(201).json({
      status: "success",
      message: "you successfuly signed up, you can login now",
      data: { userId: newUser._id },
    });
  } catch (err) {
    return next(err);
  }
}


export async function signin(req, res, next) {
  try {
    const { email, password } = req.body;

  
    if (!email || !password) {
      return next(new AppError("Please provide both email and password.", 404));
    }

    
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new AppError("Invalid email or password.", 401));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new AppError("Invalid email or password.", 401));
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const cookieOptions = {
      httpOnly: true,
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res
      .status(200)
      .cookie("jwt", token, cookieOptions)
      .json({
        status: "success",
        message: "Logged in successfully",
        data: {
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
          },
        },
      });
  } catch (err) {
    console.error("Login Error:", err);
    return next(new AppError("Internal sever error , try again later", 500));
  }
}

export async function protect(req, res, next) {
  try {
    let token;
    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    } else if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(new AppError("Not authorized. No token. Please signin to generate content!", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(new AppError("User no longer exists.", 401));
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Protect middleware error:", err);
    return next(new AppError("Internal sever error , try again later", 500));
  }
}

export async function requestPasswordReset(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ status: "fail", error: "No user with this email" });
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `http://localhost:5000/auth/reset-password/${resetToken}`;

    res.status(200).json({
      status: "success",
      message: "Reset link generated successfully",
      resetURL,
    });
  } catch (err) {
    res
      .status(500)
      .json({ status: "fail", error: "Error generating reset link" });
  }
}

export async function resetPassword(req, res) {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        status: "fail",
        error: "Token is invalid or has expired",
      });
    }

    user.password = password;
    user.confirmPassword = confirmPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password reset successfully",
    });
  } catch (err) {
    console.error("Reset Error:", err);
    res.status(500).json({
      status: "fail",
      error: "Something went wrong during reset",
    });
  }
}
export async function getMe(req, res, next) {
  try {
    let token;
    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    } else if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(new AppError("Not logged in", 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
      return next(new AppError("User not found", 404));
    }
    res.status(200).json({
      status: "success",
      user: currentUser,
    });
  } catch (err) {
    next(new AppError("Invalid or expired token", 401));
  }
}

export function signout(req, res) {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "Lax",
  });

  res.status(200).json({ message: "Successfully logged out" });
}
