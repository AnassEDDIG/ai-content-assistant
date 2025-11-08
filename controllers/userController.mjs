import User from "../models/User.mjs";

export async function updateUser(req, res, next) {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return next(new AppError("Unauthorized. Please login.", 401));
    }
    
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        return next(new AppError("All password fields are required.", 400));
      }

      if (newPassword !== confirmPassword) {
        return next(new AppError("Passwords do not match", 400));
      }

      const user = await User.findById(userId).select("+password");

      const isMatch = await user.comparePassword(
        currentPassword,
        user.password
      );
      if (!isMatch) {
        return next(new AppError("Current password is incorrect.", 401));
      }

      user.password = newPassword;
      user.confirmPassword = confirmPassword;
      await user.save();

      return res.status(200).json({
        status: "success",
        message: "Password updated successfully",
      });
    }

    // Profile update flow
    const updates = {};
    const allowedFields = ["username", "email"];
    allowedFields.forEach((field) => {
      if (req.body[field]) {
        updates[field] = req.body[field].trim?.() || req.body[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      data: {
        user: {
          id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
        },
      },
    });
  } catch (err) {
    console.error("Update Error:", err);
    next(new AppError("Something went wrong while updating", 500));
  }
}
