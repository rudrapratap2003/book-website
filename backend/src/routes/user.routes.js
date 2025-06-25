import { Router } from "express";
import { 
    loginUser,
    logoutUser, 
    registerUser,
    toggleWishlist,
    wishlistofUser,
    getMe
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()

router.route("/register").post(registerUser) // http://localhost:8000/api/v1/users/register    
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/toggle-wishlist").post(verifyJWT, toggleWishlist)
router.route("/wishlist").get(verifyJWT, wishlistofUser)
router.get("/me", verifyJWT, getMe);
export default router