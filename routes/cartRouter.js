import express from "express";
import { addToCart, getAll, getCartCount, deleteItem, deleteAll} from "../controllers/cartController.js";

export const cartRouter = express.Router();

cartRouter.route("/add")
.post(addToCart)

cartRouter.route("/cart-count")
  .get(getCartCount)

cartRouter.route("/")
  .get(getAll)

  cartRouter.route("/all")
    .delete(deleteAll)
    
cartRouter.route("/:itemId")
  .delete(deleteItem)
