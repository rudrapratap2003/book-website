import { Router } from "express";
import { addOrUpdateRating, getBookRatings } from "../controllers/rating.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/add").post(verifyJWT,addOrUpdateRating)
router.route("/:bookId").get(verifyJWT,getBookRatings)

export default router