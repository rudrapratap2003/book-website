import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    registerUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()

router.route("/register").post(registerUser) // http://localhost:8000/api/v1/users/register    
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser)

export default router