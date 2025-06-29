import {
    getCart,
    addToCart,
    removeCartItems
} from "../controllers/cart.controller.js"
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()
router.route("/").get(verifyJWT, getCart)
router.route("/add").post(verifyJWT, addToCart)
router.route("/remove").post(verifyJWT, removeCartItems)

export default router