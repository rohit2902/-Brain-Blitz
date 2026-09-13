import dotenv from "dotenv";
dotenv.config();
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import crypto from "crypto";
import { forgotPasswordTemplate } from "../services/email/forgot-password.template.js";
import verifyEmail from "../services/email/verify-email.template.js";

export const registerController = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const userExists = await userModel.findOne({
    $or: [{ email }, { username }],
  });
  if (userExists) {
    if (userExists.email === email) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    if (userExists.username === username) {
      return res.status(409).json({
        success: false,
        message: "Username already exists",
      });
    }
  }

  const user = await userModel.create({ username, email, password });

  const emailVerifyToken = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1d" },
  );
  try {
    await sendEmail({
      to: email,
      subject: "🎉 Welcome to Perplexity AI",
      html: verifyEmail(user, emailVerifyToken),
    });
  } catch (emailError) {
    throw new Error(`Failed to send verification email: ${emailError.message}`);
  }
  const createdUser = await userModel.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        createdUser,
        "User registered successfully. Please check your email to verify your account.",
      ),
    );
});

export const verifyEmailController = asyncHandler(async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or missing token." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await userModel.findOne({ email: decoded.email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    if (user.verified) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Email is already verified. Please log in.",
        });
    }

    user.verified = true;
    await user.save();

    const successHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Verification Successful</title>
      </head>
      <body style="margin:0;padding:0;background:#fff4ec;font-family:Arial,sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 5px 15px rgba(255,122,26,0.15);text-align:center;">
          <tr>
            <td style="background:#FF7A1A;padding:30px;">
              <h1 style="color:#ffffff;margin:0;">⚡ Verified Successfully!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;color:#333;">
              <h2 style="margin-top:0;">Welcome aboard, ${user.username}!</h2>
              <p style="font-size:16px;line-height:28px;">
                Your email has been verified. Your BrainBlitz account is fully set up and ready to go.
              </p>
               <div style="margin:40px 0;">
                <a href="${process.env.FRONTED_URL || 'https://brain-blitz-1.onrender.com'}/login" style="display:inline-block;padding:14px 30px;background:#FF7A1A;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:bold;">
                  Go to Login
                </a>
              </div>
            </td>
          </tr>
        </table>
      </body>
    </html>
    `;

    return res.send(successHtml);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Verification link has expired. Please register again.",
        });
    }
    if (error.name === "JsonWebTokenError") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid verification link." });
    }
    return res
      .status(500)
      .json({
        success: false,
        message: "Server error during verification",
        error: error.message,
      });
  }
});

export const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  if (!user.verified) {
    throw new ApiError(
      403,
      "Email not verified. Please check your email for the verification link.",
    );
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "30d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  await userModel
    .findByIdAndUpdate(user._id, { lastLogin: new Date() })
    .select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "Login successful."));
});

export const logoutController = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Logout failed", error: error.message });
  }
};

export const getMeController = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  res.set("Cache-Control", "no-store");
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        id: user._id,
        username: user.username,
        email: user.email,
        verified: user.verified,
        createdAt: user.createdAt,
      },
      "User profile fetched successfully",
    ),
  );
});

export const googleAuthController = asyncHandler(async (req, res) => {
  const userProfile = req.user;
  const email = userProfile.emails?.[0]?.value;
  const googleId = userProfile.id;
  const username = userProfile.displayName;
  const avatar = userProfile.photos?.[0]?.value;
 if (!email) {
    const frontendUrl = process.env.FRONTED_URL || "https://brain-blitz-1.onrender.com";
    return res.redirect(`${frontendUrl}/login?error=no_email`);
  }

  let user = await userModel.findOne({
    $or: [{ googleId }, { email }],
  });

  if (!user) {
    user = await userModel.create({
      username,
      email,
      googleId,
      avatar,
      authProvider: "google",
      verified: true,
    });
  } else if (!user.googleId) {
    user.googleId = googleId;
    user.avatar = user.avatar || avatar;

    await user.save();
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.redirect(process.env.FRONTED_URL + "/");
});

export const forgetPasswordController = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User with this email does not exist.");
  }

  const otp = crypto.randomInt(100000, 1000000).toString();

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  user.forgotPasswordOtp = hashedOtp;
  user.forgotPasswordOtpExpire = new Date(Date.now() + 10 * 60 * 1000);

  await user.save({
    validateBeforeSave: false,
  });

  await sendEmail({
    to: email,
    subject: "🔒 Password Reset Request",
    html: forgotPasswordTemplate(user, otp),
  });
  return res
    .status(201)
    .json(new ApiResponse(200, null, "OTP sent successfully"));
});

export const verifyOtpController = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User with this email does not exist.");
  }

  if (!user.forgotPasswordOtp || !user.forgotPasswordOtpExpire) {
    throw new ApiError(400, "No OTP request found. Please request a new OTP.");
  }

  if (new Date() > user.forgotPasswordOtpExpire) {
    throw new ApiError(400, "OTP has expired. Please request a new OTP.");
  }

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  if (hashedOtp !== user.forgotPasswordOtp) {
    throw new ApiError(400, "Invalid OTP. Please try again.");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashedResetToken;
  user.resetPasswordTokenExpire = new Date(Date.now() + 10 * 60 * 1000);

  user.forgotPasswordOtp = null;
  user.forgotPasswordOtpExpire = null;
  await user.save({ validateBeforeSave: false });

  res.cookie("resetPasswordToken", resetToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 10 * 60 * 1000,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { resetToken },
        "OTP verified successfully. You can now reset your password.",
      ),
    );
});

export const resetPasswordController = asyncHandler(async (req, res) => {
  const { newPassword, confirmPassword } = req.body;
  let resetPasswordToken;
  if (req.cookies && req.cookies.resetPasswordToken) {
    resetPasswordToken = req.cookies.resetPasswordToken;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    resetPasswordToken = req.headers.authorization.split(" ")[1];
  } else if (req.body && req.body.resetToken) {
    resetPasswordToken = req.body.resetToken;
  }
  if (!resetPasswordToken) {
    throw new ApiError(401, "Password reset token is missing or expired");
  }

  const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetPasswordToken)
      .digest("hex");

       const user = await userModel.findOne({
      resetPasswordToken: hashedResetToken,
      resetPasswordTokenExpire: {
        $gt: new Date(),
      },
     });

      if (!user) {
      throw new ApiError(
        401,
        "Invalid or expired reset password token"
      );
    }
   
    if (newPassword !== confirmPassword) {
      throw new ApiError(
        400,
        "Passwords do not match"
      );
    }  
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpire = null;
    await user.save();
    res.clearCookie("resetPasswordToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production"
        ? "none"
        : "lax",
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        null,
        "Password reset successfully"
      )
    );


     


});

export const testStreamController = async (req, res) => {
  try {
    res.setHeader(
      "Content-Type",
      "text/plain; charset=utf-8"
    );

    res.setHeader(
      "Cache-Control",
      "no-cache"
    );

    res.setHeader(
      "Connection",
      "keep-alive"
    );

    const words = [
      "Hello",
      "how",
      "are",
      "you",
      "today?",
    ];

    for (const word of words) {
      res.write(word + " ");

      await new Promise((resolve) =>
        setTimeout(resolve, 500)
      );
    }

    res.end();
  } catch (error) {
    console.error(error);
    res.end();
  }
};
