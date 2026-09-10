import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ], // Added Regex validation
    },
    password: {
      type: String,
        required: function () {
        return this.authProvider === "local";
      },
      minlength: [8, "Password must be at least 8 characters long"],
      select: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    forgotPasswordOtp: {
      type: String,
      default: null,
    },

     forgotPasswordOtpExpire: {
       type: Date,
       default: null,
    },
    resetPasswordToken: {
     type: String,
     default: null,
    },

     resetPasswordTokenExpire: {
     type: Date,
     default: null,
     },
    googleId: { 
      type: String, 
      unique: true,
       sparse: true 
      }, 
    avatar: String,
    authProvider: { 
      type: String,
       enum: ["local", "google"], 
       default: "local" },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const userModel = mongoose.model("User", userSchema);
export default userModel;
