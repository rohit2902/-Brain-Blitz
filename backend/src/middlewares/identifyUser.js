import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

export const identifyUser = async (req, res, next) => {
  try {
    let token;


    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } 
    
    else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }


    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Not authorized to access this resource. Please log in." 
      });
    }

   
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ success: false, message: "User session not found. Please re-authenticate." });
    }

    
    if (!user.verified) {
      return res.status(403).json({ success: false, message: "Please verify your email address first." });
    }


    req.user = user;

    
    next();

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Your session has expired. Please log in again." });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid session token." });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: "Authentication server error", 
      error: error.message 
    });
  }
};