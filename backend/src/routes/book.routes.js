import { Router } from "express";
import { sellBook, buyBook } from "../controllers/book.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()

router.route("/sell-book").post(verifyJWT, sellBook) // http://localhost:8000/api/v1/books/sell-book   
router.route('/:bookId').post(verifyJWT, buyBook)
export default router