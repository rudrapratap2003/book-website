import { Router } from "express";
import { addOrUpdateRating, getBookRatings, getUserRatings } from "../controllers/rating.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/add").post(verifyJWT,addOrUpdateRating)
router.route("/").get(verifyJWT,getBookRatings)
router.route("/my-rating").get(verifyJWT,getUserRatings)

export default router