import { Book } from "../models/book.model.js";
import { asyncHandler } from "../utils/asynchandler.js";
import {ApiError} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const sellBook = asyncHandler(async (req,res) => {
    let {bookname, category, author, description, price, count} = req.body;
    if([bookname, category, author, description, price].some((field) => field ?.trim() ==="")) {
        throw new ApiError(400, "All fields are required")
    }
    category = category.toLowerCase()
    
    const bookImageLocalPath = req.files?.bookImage?.[0]?.path;
    if(!bookImageLocalPath) {
      throw new ApiError(400,"Book Image is Required")
    }
    const image = await uploadOnCloudinary(bookImageLocalPath)
    if(!image) {
      throw new ApiError(400,"Book Image is Required")
    }
    const pendingBook = await Book.create({
        bookname,
        category,
        description,
        author,
        price,
        count,
        bookImage: image.url,
        seller: req.user._id,
        status: "pending"
    })

    if(!pendingBook) {
        throw new ApiError(500,"Something went wrong while adding the book")
    }
    return res.status(200).json(
        new ApiResponse(200, pendingBook,"Book sold successfully")
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
    const category = req.params.category.toLowerCase();

    const books = await Book.find({
      category,
      status: "approved", // Only show books that are approved
    });

    res.status(200).json(books);
  } catch (error) {
    console.error("Error fetching category books:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const getAllApprovedBooks = asyncHandler(async (req, res) => {
  try {
    const approvedBooks = await Book.find({ status: "approved" });
    return res
      .status(200)
      .json(new ApiResponse(200, approvedBooks, "All approved books"));
  } catch (error) {
    console.error("Error fetching all approved books:", error);
    res.status(500).json({ message: "Server error" });
  }
});



 const getBooksSoldByMe = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  // Find all books posted by this user
  const soldBooks = await Book.find({ seller: userId }).sort({ updatedAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, soldBooks, "Books sold by user fetched.")
  );
});

const searchBooks = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === "") {
    return res.status(400).json({ message: "Search query is required" });
  }

  const regex = new RegExp(query.trim(), "i"); // case-insensitive search

  const books = await Book.find({
    $or: [
      { bookname: { $regex: regex } },
      { author: { $regex: regex } },
      { category: { $regex: regex } },
    ],
  });

  res.status(200).json(books);
});


export {
    sellBook,
    buyBook,
    fetchBookByCategory,
    getBooksSoldByMe,
    searchBooks,
    getAllApprovedBooks
}