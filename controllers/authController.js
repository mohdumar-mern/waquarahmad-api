import Admin from "../models/authModel.js";
import asyncHandler from "express-async-handler";
import bcrypt from 'bcrypt';

import { generateToken } from "../utils/generateToken.js";

// Register Admin
export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const exists = await Admin.findOne({ $or: [{ email }, { username }] }).lean();
  if (exists) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newAdmin = await Admin.create({ username, email, password: hashedPassword });

  const token = generateToken(newAdmin._id);
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3 * 24 * 60 * 60 * 1000
  });

  res.status(201).json({
    success: true,
    message: "Admin registered successfully",
    admin: { id: newAdmin._id, username: newAdmin.username }
  });
});

// Login Admin
export const login = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const admin = await Admin.findOne({ $or: [{ email }, { username }] }).select('+password').lean();
  if (!admin) return res.status(404).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

  const token = generateToken(admin._id);
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3 * 24 * 60 * 60 * 1000
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    admin: {
      id: admin._id,
      username: admin.username,
      email: admin.email,
    },
    token: token,
  });
});

// Logout Admin
export const logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};
