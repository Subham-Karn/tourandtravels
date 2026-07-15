import User from "../models/User.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { normalize } from "../utils/normalize.js";
import sendMail from "../utils/sendEmail.js";

const signupUser = async (req, res) => {
  try {
    const { fullName, age, gender, email, password } = req.body;
    if (!fullName || !age || !gender || !email || !password) {
      return res.render("pages/user/signup", {
        success: false,
        message: "All fields are required",
      });
    }
    const userExist = await User.find({ email: normalize(email) });
    if (userExist.length > 0) {
      return res.render("pages/user/signup", {
        success: false,
        message: "User already exist with this email try another email",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const userPayload = {
      fullName: fullName,
      email: email,
      password: hashPassword,
      age: age,
      gender: gender,
    };
    await User.insertOne(userPayload);
    return res.render("pages/user/signup", {
      success: true,
      message: "User created successfully please login",
    });
  } catch (error) {
    return res.render("pages/user/signup", {
      success: false,
      message: "Internal server error please try after sometime",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.render("pages/user/login", {
        success: false,
        message: "All fields are required",
      });
    }
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.render("pages/user/login", {
        success: false,
        message: "User Not Found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.render("pages/user/login", {
        success: false,
        message: "Invalid email or password",
      });
    }

    req.session.user = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      age: user.age,
      gender: user.gender,
    };
    return res.redirect("/");
  } catch (error) {
    return res.render("pages/user/login", {
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.render("index", {
        success: false,
        loading: loading,
        message: "Something went wrong. Please try again.",
      });
    }
    return res.redirect("/auth/login");
  });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.render("pages/user/forgot-password", {
      success: false,
      message: "Email not found",
    });
  }

  const token = crypto.randomBytes(32).toString("hex");

  user.resetToken = token;
  user.resetTokenExpire = Date.now() + 15 * 60 * 1000;

  await user.save();

  await sendMail(user.email, token);

  return res.render("pages/user/forgot-password", {
    success: true,
    message: "Password reset link sent to your email.",
  });
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.render("pages/user/reset-password", {
      token: token,
      success: false,
      message: "Invalid or expired token",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  user.password = hashPassword;
  user.resetToken = undefined;
  user.resetTokenExpire = undefined;

  await user.save();

  return res.render("pages/user/reset-password", {
    token:token,
    success: true,
    message: "Password reset successfully",
  });
};

const changePassword = async (req, res) => {
    try {

        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.render("pages/user/change-password", {
                user:req.session.user,
                success: false,
                message: "All fields are required.",
            });
        }

        if (newPassword !== confirmPassword) {
            return res.render("pages/user/change-password", {
                user:req.session.user,
                success: false,
                message: "New password and confirm password do not match.",
            });
        }

        const user = await User.findById(req.session.user.id);

        if (!user) {
            return res.redirect("/auth/login");
        }

        const isMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isMatch) {
            return res.render("pages/user/change-password", {
                user:req.session.user,
                success: false,
                message: "Current password is incorrect.",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;

        await user.save();

        return res.render("pages/user/change-password", {
            user:req.session.user,
            success: true,
            message: "Password changed successfully.",
        });

    } catch (error) {

        console.log(error);

        return res.render("pages/user/change-password", {
            user:req.session.user,
            success: false,
            message: "Internal Server Error.",
        });

    }
};

export { signupUser, loginUser, logoutUser, forgotPassword, resetPassword ,changePassword};
