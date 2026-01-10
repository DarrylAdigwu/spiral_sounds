import express from "express";
import { addToCart } from "../controllers/cartController.js";

export const cartRotuer = express.Router();

cartRotuer.route("/add")
.post(addToCart)