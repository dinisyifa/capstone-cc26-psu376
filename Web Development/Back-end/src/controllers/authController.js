import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "../models/index.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return errorResponse(res, "Nama, email, dan password wajib diisi", 400);
  }

  if (password.length < 6) {
    return errorResponse(res, "Password minimal 6 karakter", 400);
  }

  const normalizedEmail = email.toLowerCase();

  const existingUser = await User.findOne({
    where: {
      email: normalizedEmail,
    },
  });

  if (existingUser) {
    return errorResponse(res, "Email sudah terdaftar", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
  });

  const token = generateToken(user.id);

  return successResponse(
    res,
    "Registrasi berhasil",
    {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    },
    201,
  );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return errorResponse(res, "Email dan password wajib diisi", 400);
  }

  const normalizedEmail = email.toLowerCase();

  const user = await User.findOne({
    where: {
      email: normalizedEmail,
    },
  });

  if (!user) {
    return errorResponse(res, "Email atau password salah", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return errorResponse(res, "Email atau password salah", 401);
  }

  const token = generateToken(user.id);

  return successResponse(res, "Login berhasil", {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  });
});

export const getMe = asyncHandler(async (req, res) => {
  return successResponse(res, "Data user berhasil diambil", {
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    },
  });
});
