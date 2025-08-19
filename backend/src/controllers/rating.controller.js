import { Rating } from "../models/rating.model.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asynchandler.js";
import mongoose from "mongoose";

const addOrUpdateRating = asyncHandler(async (req, res) => {
  const { bookId, rating } = req.body;
  if(!bookId) {
    throw new ApiError(400,"Book ID is required")
  }
  const userId = req.user._id;

  let existing = await Rating.findOne({ book: bookId, user: userId });

  if (existing) {
    existing.rating = rating;
    await existing.save();
    return res.status(200).json(
        new ApiResponse(200,existing,"Rating updated")
    );
  }

  const newRating = await Rating.create({
    book: bookId,
    user: userId,
    rating
  });

  res.status(201).json(
    new ApiResponse(201,newRating,"New Rating added")
  );
})

const getUserRatings = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const userRatings = await Rating.find({ user: userId }).select("book rating");

  res.status(200).json(
    new ApiResponse(200, userRatings, "User ratings fetched successfully")
  );
});

const getBookRatings = asyncHandler(async (req, res) => {
  const result = await Rating.aggregate([
    {
      $group: {
        _id: "$book",
        averageRating: { 
          $avg: "$rating" 
        },
        totalRatings: { 
          $sum: 1 
        },
      }
    },
    {
      $project: {
        bookId: "$_id",
        _id: 0,
        averageRating: { 
          $floor: { 
            $add: ["$averageRating", 0.5] 
          } 
        },
        totalRatings: 1,
      }
    }
  ]);

  res.status(200).json(
    new ApiResponse(200, result, "All book ratings fetched successfully")
  );
});

export {
    addOrUpdateRating,
    getUserRatings,
    getBookRatings
}