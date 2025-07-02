import jwt from "jsonwebtoken";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/apiError.js";
import User from "../models/userSchema.js";

const verifyJWT = async (req, res, next) => {
  try {
    console.log("Cookies:", req.cookies);
console.log("Token from cookie:", req.cookies.accessToken);

    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      res.status(401);
      return next(new Error("Unauthorized request"));
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      res.status(401);
      return next(new Error("Invalid Access Token"));
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    return next(new Error(error?.message || "Invalid access token"));
  }
};

export default verifyJWT;
