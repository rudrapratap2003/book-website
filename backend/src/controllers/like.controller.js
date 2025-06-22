import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import {asyncHandler} from "../utils/asynchandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {Book} from "../models/book.model.js"
import {Comment} from "../models/comment.model.js"

const toggleBookLike = asyncHandler(async (req,res) => {
    const {bookId} = req.params
    if(!bookId && !isValidObjectId(bookId)) {
        throw new ApiError(400,"Invalid Book ID")
    }

    const book = await Book.findById(bookId)
    if(!book) {
        throw new ApiError(400,"Book not found")
    }

    const bookLiked = await Like.findOne(
        {
            book: bookId,
            likedBy: req.user._id
        },
        {new: true}
    )
    if(!bookLiked) {
        await Like.create({
            book:bookId,
            likedBy: req.user._id
        })
    } else {
        await Like.findByIdAndDelete(bookLiked._id)
    }

    return res
    .status(200)
    .json(new ApiResponse(200,book, "book likes toggled successfully"))
})

const toggleCommentLike = asyncHandler(async (req,res) => {
    const {commentId} = req.params
    if(!commentId && !isValidObjectId(commentId)) {
        throw new ApiError(400,"Invalid Comment ID")
    }

    const comment = await Comment.findById(commentId)
    if(!comment) {
        throw new ApiError(400,"Comment not found")
    }

    const commentLiked = await Like.findOne(
        {
            comment: commentId,
            likedBy: req.user._id
        },
        {new: true}
    )
    if(!commentLiked) {
        await Like.create({
            comment:commentId,
            likedBy: req.user._id
        })
    } else {
        await Like.findByIdAndDelete(commentLiked._id)
    }

    return res
    .status(200)
    .json(new ApiResponse(200,comment, "Comment likes toggled successfully"))
})