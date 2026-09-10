import { body } from "express-validator";

export const registerValidator = [
    body("username")
        .trim()
        .notEmpty().withMessage("Username is required")
        .isLength({ min: 3 }).withMessage("Username must be at least 3 characters long")
        .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username can only contain letters, numbers, and underscores"),
        
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please enter a valid email address")
        .normalizeEmail(), 
        
    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
        
];

export const loginValidator = [
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please enter a valid email address"),
        
    body("password")
        .notEmpty().withMessage("Password is required")
];


export const createChatValidator = [
    body("title")
        .optional() 
        .trim()
        .isLength({ max: 100 }).withMessage("Title cannot exceed 100 characters")
];


export const createMessageValidator = [
    body("chatId")
        .trim()
        .notEmpty().withMessage("Chat ID is required")
        .isMongoId().withMessage("Invalid Chat ID format"), // Senior tip: Validates it's a real MongoDB ObjectId before hitting the DB
        
    body("content")
        .trim()
        .notEmpty().withMessage("Message content cannot be empty"),
        
    body("role")
        .trim()
        .notEmpty().withMessage("Role is required")
        .isIn(["user", "ai"]).withMessage("Role must be either 'user' or 'ai'")
];

export const forgetPasswordValidator = [
    body("email")
        .trim() 
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Please enter a valid email address")
        .normalizeEmail()
];


export const verifyForgetPasswordValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("otp")
    .trim()
    .notEmpty()
    .withMessage("OTP is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be exactly 6 digits")
    .isNumeric()
    .withMessage("OTP must contain only numbers"),
];
  
export const resetPasswordValidator = [
  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be between 8 and 128 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("Password must contain at least one special character"),

  body("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Passwords do not match");
      }

      return true;
    }),
];
