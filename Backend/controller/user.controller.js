import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import createTokenAndSaveCookie from "../jwt/generateToken.js";

export const signup = async (req, res) => {
  const { fullname, email, password, confirmPassword } = req.body;
  try {
    console.log("📝 Signup Attempt for:", email);

    if (password !== confirmPassword) {
      console.log("❌ Passwords do not match");
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ User already exists:", email);
      return res.status(400).json({ error: "User already registered" });
    }

    // Hashing the password
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullname,
      email,
      password: hashPassword,
    });
    await newUser.save();

    if (newUser) {
      console.log("✅ User created successfully:", email);
      createTokenAndSaveCookie(newUser._id, res);
      return res.status(201).json({
        message: "User created successfully",
        user: {
          _id: newUser._id,
          fullname: newUser.fullname,
          email: newUser.email,
        },
      });
    }
  } catch (error) {
    console.error("❌ Signup Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log("🔑 Login Attempt for:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(400).json({ error: "Invalid user credentials" });
    }

    console.log("✅ User found:", user.email);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Incorrect password for:", email);
      return res.status(400).json({ error: "Invalid user credentials" });
    }

    createTokenAndSaveCookie(user._id, res);
    console.log("✅ Token generated and sent to user:", email);

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    console.log("🚪 Logout attempt");
    res.clearCookie("jwt", { httpOnly: true, secure: process.env.NODE_ENV === "production" });
    console.log("✅ User logged out successfully");
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("❌ Logout Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const allUsers = async (req, res) => {
  try {
    console.log("📄 Fetching all users");
    const loggedInUser = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUser },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("❌ Error in allUsers Controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
