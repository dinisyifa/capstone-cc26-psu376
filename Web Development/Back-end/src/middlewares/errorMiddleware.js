import { errorResponse } from "../utils/response.js";

export const notFoundHandler = (req, res, next) => {
  return errorResponse(res, `Endpoint ${req.originalUrl} tidak ditemukan`, 404);
};

export const globalErrorHandler = (err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Terjadi kesalahan pada server";

  return errorResponse(res, message, statusCode);
};
