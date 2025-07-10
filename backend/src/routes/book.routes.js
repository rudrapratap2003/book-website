import { Router } from "express";

import { sellBook, buyBook, fetchAllBooks, getBooksSoldByMe, searchBooks } from "../controllers/book.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router()

router.route("/sell-book").post(verifyJWT,upload.fields([
    {
        name:"bookImage",
        maxCount: 1
    }
]), sellBook) // http://localhost:8000/api/v1/books/sell-book   
router.route('/:bookId').post(verifyJWT, buyBook)
// Inside bookRoutes.js or similar
router.route("/get-books").get(verifyJWT, fetchAllBooks);
router.route("/sold-by-user").get(verifyJWT, getBooksSoldByMe)
router.route("/search").get(searchBooks)



export default router