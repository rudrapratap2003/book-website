import express from "express"
import {addToWishlist, removeFromWishlist, getWishlist} from "../controllers/wishlist.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router()

router.route("/add/:bookId").post(verifyJWT, addToWishlist);
router.route("/remove/:bookId").delete(verifyJWT, removeFromWishlist);
router.route("/").get(verifyJWT, getWishlist);

export default router;