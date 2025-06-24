import { Book } from "../models/book.model.js";
import { asyncHandler } from "../utils/asynchandler.js";
import {ApiError} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const sellBook = asyncHandler(async (req,res) => {
    let {bookname, category, author, description, price, count} = req.body;
    const user = await User.findById(req.user?._id)
    if([bookname, category, author, description, price].some((field) => field ?.trim() ==="")) {
        throw new ApiError(400, "All fields are required")
    }
    category = category.toLowerCase()
    const existingBook = await Book.findOne({bookname})
    if(existingBook) {
      existingBook.count += 1;
      await existingBook.save();
      return res.status(200).json(
        new ApiResponse(200, existingBook,"Book Count Updated")
      )
    }

    const newBook = await Book.create({
        bookname,
        category,
        description,
        author,
        price,
        count,
        seller: user.id,
    })

    if(!newBook) {
        throw new ApiError(500,"Something went wrong while adding the book")
    }
    return res.status(200).json(
        new ApiResponse(200, newBook,"Book sold successfully")
    )
})

const buyBook = asyncHandler(async (req,res) => {
    try {
        const {bookId} = req.params
        const buyerId = req.user?._id
        const book = await Book.findById(bookId)
        if(!book) {
            throw new ApiError(404,"Book not found")
        }
        if(book.count>0) {
            book.count -= 1;
            if (!book.buyers.includes(buyerId)) {
                book.buyers.push(buyerId);
            }
            await book.save()
            return res.status(200).json(
                new ApiResponse(200,book,"Book purchased succesfully")
            )
        } else {
            throw new ApiError(400,"Book is out of stock")
        }
    } catch(error) {
        throw new ApiError(500,"Something went wrong")
    }
})

const fetchBookByCategory = asyncHandler(async (req, res) => {
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
})

 const getBooksSoldByMe = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  // Find all books posted by this user
  const soldBooks = await Book.find({ seller: userId }).sort({ updatedAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, soldBooks, "Books sold by user fetched.")
  );
});

export {
    sellBook,
    buyBook,
    fetchBookByCategory,
    getBooksSoldByMe
}