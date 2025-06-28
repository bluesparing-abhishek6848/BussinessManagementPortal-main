import User from "../models/userSchema.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import ApiResponse from "../utils/apiResponse.js";

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

// Login route to authenticate user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Email and password are required."));
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res
        .status(401)
        .json(new ApiResponse(401, null, "Invalid email or password."));
    }

    // Generate JWT access token
    const token = jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Generate refresh token (random string)
    const refreshToken = crypto.randomBytes(40).toString("hex");

    // Save refresh token to user in DB
    user.refreshToken = refreshToken;
    await user.save();

    // Set tokens in HTTP-only cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      maxAge: 60 * 60 * 1000, // 1 hour
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return success response with tokens
    return res.status(200).json(
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
        "Login successful."
      )
    );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, `Error logging in. ${error.message}`));
  }
};

// Refresh token route to get a new access token
export const refreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "No refresh token provided."));
  }

  try {
    // Find user with this refresh token
    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res
        .status(403)
        .json(new ApiResponse(403, null, "Invalid refresh token."));
    }

    // Generate new access token
    const token = jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res
      .status(200)
      .json(new ApiResponse(200, { token }, "Token refreshed successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(500, null, `Error refreshing token. ${error.message}`)
      );
  }
};

export const logoutUser = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "No refresh token provided."));
  }

  try {
    // Find user with this refresh token
    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res
        .status(403)
        .json(new ApiResponse(403, null, "Invalid refresh token."));
    }

    // Clear the refresh token from the user
    user.refreshToken = null;
    await user.save();

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
