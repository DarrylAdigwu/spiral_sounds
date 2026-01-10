import express from "express";
import { addToCart, getAll, getCartCount, deleteItem, deleteAll} from "../controllers/cartController.js";
import { requireAuth } from "../middleware/requireAuth.js";

export const cartRouter = express.Router();

cartRouter.route("/add")
.post(requireAuth, addToCart)

cartRouter.route("/cart-count")
  .get(requireAuth, getCartCount)

cartRouter.route("/")
  .get(requireAuth, getAll)

  cartRouter.route("/all")
    .delete(requireAuth, deleteAll)
    
cartRouter.route("/:itemId")
  .delete(requireAuth, deleteItem)
