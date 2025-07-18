import User from "../models/userSchema.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Attendance from "../models/atttendanceSchema.js";
import Advance from "../models/advanceSchema.js";
import Order from "../models/orderSchema.js";
import Finance from "../models/FinanceSchema.js";
import ApiResponse from "../utils/apiResponse.js";
import Employee from "../models/employeeSchema.js";
// POST route to create a new user
export const createUser = async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, null, "Name, email, and password are required.")
      );
  }

  // Check if user already exists
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json(
          new ApiResponse(409, null, "User with this email already exists.")
        );
    }

    // Create new user
    const newUser = new User({ name, email, password, phone, role });
    await newUser.save();

    // Return success response
    return res.status(201).json(
      new ApiResponse(
        201,
        {
          user: {
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            role: newUser.role,
          },
        },
        "User created successfully."
      )
    );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, `Error saving user. ${error.message}`));
  }
};



// Helper to generate tokens
const generateAccessAndRefreshTokens = async (userId, role) => {
  const accessToken = jwt.sign(
    { _id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  const refreshToken = jwt.sign(
    { _id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};

// Remove these imports:
// import bcrypt from "bcryptjs";
// import asyncHandler from "express-async-handler";

// ...existing code...

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Invalid credentials"));
  }
  try {
    const trimEmail = email.trim();
    const user = await User.findOne({ email: trimEmail });
    if (!user || user.password !== password) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Invalid credentials"));
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id.toString(),
      user.role
    );
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 60 * 60 * 1000, // 1 hour
    };
    const refreshOptions = {
      ...options,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };
    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, refreshOptions)
      .json(
        new ApiResponse(
          200,
          {
            user: {
              name: user.name,
              email: user.email,
              phone: user.phone,
              role: user.role,
            },
          },
          "Login successful"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, `Error logging in. ${error.message}`));
  }
};

// ...existing code...

// Refresh token route to get a new access token
export const refreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "No refresh token provided."));
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    
    const newAccessToken = jwt.sign(
      { _id: decoded._id, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Token refreshed successfully."));
  } catch (error) {
    return res
      .status(403)
      .json(new ApiResponse(403, null, "Invalid refresh token."));
  }
};

export const logoutUser = async (req, res) => {

  try {
 ;

    // Clear cookies
    res.clearCookie("token");
    res.clearCookie("refreshToken");

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Logout successful."));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, `Error logging out. ${error.message}`));
  }
};



// Delete an employee and all related records
export const deleteEmployeeController = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete employee
    const deletedEmployee = await Employee.findByIdAndDelete(id);
    if (!deletedEmployee) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Employee not found"));
    }

    // Delete related attendance records
    await Attendance.deleteMany({ employeeId: id });

    // Delete related advances and their finance records
    const advances = await Advance.find({ employeeId: id });
    const advanceIds = advances.map(a => a._id);
    await Advance.deleteMany({ employeeId: id });
    await Finance.deleteMany({ advanceId: { $in: advanceIds } });

    // Delete related orders and their finance records
    const orders = await Order.find({ createdBy: id });
    const orderIds = orders.map(o => o._id);
    await Order.deleteMany({ createdBy: id });
    await Finance.deleteMany({ orderId: { $in: orderIds } });

    // Optionally, delete finance records directly linked to employee
    await Finance.deleteMany({ createdBy: id });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Employee and all related records deleted successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, `Error deleting employee: ${error.message}`));
  }
};