import jwt from "jsonwebtoken";

import { User } from "../models/index.js";
import { errorResponse } from "../utils/response.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, "Silakan login terlebih dahulu", 401);
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return errorResponse(res, "User tidak ditemukan", 401);
    }

    req.user = user;

    next();
  } catch (error) {
    return errorResponse(res, "Token tidak valid atau sudah expired", 401);
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);

    req.user = user || null;

    next();
  } catch (error) {
    req.user = null;
    next();
  }
};
