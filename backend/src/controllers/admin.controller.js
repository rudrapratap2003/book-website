import { Book } from "../models/book.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

const getPendingBooks = asyncHandler(async (req,res) => {
    const pending = await Book.find({status: "pending"}).sort({createdAt: -1})
    res.json(pending)
})

const approveBook = asyncHandler(async (req,res) => {
    const {bookId} = req.body
    if(!bookId) {
        throw new ApiError(400,"Book ID is required")
    }
    const book = await Book.findById(bookId)
    if(!book) {
        throw new ApiError(404,"Book not found")
    }
    if(book.status !== "pending") {
        throw new ApiError(400,"Book is already processed")
    }
    book.status = "approved"
    await book.save()
    return res.status(200).json(
        new ApiResponse(200,book,"Book approved")
    )
})

const rejectBook = asyncHandler(async(req,res) => {
    const {bookId,message} = req.body

    if(!message?.trim()) {
        throw new ApiError(400,"Rejection reason is required")
    }

    if(!bookId) {
        throw new ApiError(400,"Book ID is required")
    }

    const book = await Book.findById(bookId)
    if(!book) {
        throw new ApiError(404,"Book not found")
    }

    book.status = "rejected"
    book.rejectionReason = message.trim()
    await book.save()

    return res.status(200).json(
        new ApiResponse(200,book,"Book rejected")
    )
})

export {
    getPendingBooks,
    approveBook,
    rejectBook
}