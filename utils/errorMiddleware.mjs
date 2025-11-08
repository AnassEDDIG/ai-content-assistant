import { StatusCodes } from "http-status-codes";
import { AppError } from "./appError.mjs";

const sendErrorInDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    name: err.name,
    stack: err.stack,
    error: err,
  });
};

const sendErrorInProd = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("ERROR 💥", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "something went wrong!",
    });
  }
};

const handleCatsError = (err) => {
  const message = `invalid '${err.path}' value : '${err.value}'`;
  return new AppError(message, 400);
};

const handleDuplicatesError = (err) => {
  const [[key, value]] = Object.entries(err.keyValue);
  const message = `'${key}' : '${value}' already exists`;
  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((ele) => ele.message);
  const message = `Invalid Input:
   ${[...errors]}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Invalid token please login or try to a valid token!", 401);

const handleExpiredJWTError = () =>
  new AppError("Your token has expired, please login again!", 401);

export default function errorMiddleware(err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV.trim() === "development") {
    sendErrorInDev(err, res);
  } else if (process.env.NODE_ENV.trim() === "production") {
    let error = Object.assign({}, err, {
      name: err.name,
      message: err.message,
    });
    if (err.name === "CastError") error = handleCatsError(err);
    if (err.name === "ValidationError") error = handleValidationError(err);
    if (err.code === 11000) error = handleDuplicatesError(err);
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (err.name === "TokenExpiredError") error = handleExpiredJWTError();
    sendErrorInProd(error, res);
  }
}
