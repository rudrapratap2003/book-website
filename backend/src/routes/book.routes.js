import { Router } from "express";
import { sellBook, buyBook, fetchBookByCategory, getBooksSoldByMe } from "../controllers/book.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/sell-book").post(verifyJWT, sellBook) // http://localhost:8000/api/v1/books/sell-book   
router.route('/:bookId').post(verifyJWT, buyBook)
// Inside bookRoutes.js or similar
router.route("/category/:category").get(verifyJWT, fetchBookByCategory);
router.route("/sold-by-user").get(verifyJWT, getBooksSoldByMe)


export default router