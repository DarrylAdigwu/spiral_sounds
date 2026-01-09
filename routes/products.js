import express from "express";
import { getGenres, getProducts } from "../controllers/productsControllers.js";

export const productsRouter = express.Router();

productsRouter.route("/genres")
  .get(getGenres)
  
productsRouter.route("/")
  .get(getProducts)
