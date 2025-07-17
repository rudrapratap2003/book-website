import  { checkout,verifyPayment } from "../controllers/payment.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/checkout").post(verifyJWT,checkout)
router.route("/verifyPayment").post(verifyJWT,verifyPayment)

export default router