import { getMe } from "../controllers/user.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get('/me', verifyJWT, getMe);

export default router