import { registerUser, loginUser, logoutUser } from "../controllers/authController.js";
import express from "express";

export const authRouter = express.Router();

authRouter.route("/register")
  .post(registerUser)

authRouter.route("/login")
  .post(loginUser)

authRouter.route("/logout/")
  .get(logoutUser)