import { Router } from "express";
import { sellBook, buyBook } from "../controllers/book.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {Book} from "../models/book.model.js";

const router = Router()

router.route("/sell-book").post(verifyJWT, sellBook) // http://localhost:8000/api/v1/books/sell-book   
router.route('/:bookId').post(verifyJWT, buyBook)
// Inside bookRoutes.js or similar
router.get("/category/:category", async (req, res) => {
  try {
    console.log("Fetching books for category:", req.params.category); // Debug log
    const books = await Book.find({
      category: req.params.category.toLowerCase(),
    });
    res.status(200).json(books);
  } catch (error) {
    console.error("Error fetching category books:", error);
    res.status(500).json({ message: "Server error" });
  }
});


export default router