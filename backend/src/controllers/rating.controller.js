import { Rating } from "../models/rating.model.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asynchandler.js";
import mongoose from "mongoose";

const addOrUpdateRating = asyncHandler(async (req, res) => {
  const { bookId, rating, comment } = req.body;
  if(!bookId) {
    throw new ApiError(400,"Book ID is required")
  }
  const userId = req.user._id;

  let existing = await Rating.findOne({ book: bookId, user: userId });

  if (existing) {
    existing.rating = rating;
    existing.comment = comment;
    await existing.save();
    return res.status(200).json(
        new ApiResponse(200,existing,"Rating updated")
    );
  }

  const newRating = await Rating.create({
    book: bookId,
    user: userId,
    rating,
    comment
  });

  res.status(201).json(
    new ApiResponse(201,newRating,"New Rating added")
  );
})

const getBookRatings = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  const objectBookId = new mongoose.Types.ObjectId(bookId);

  const result = await Rating.aggregate([
    {
      $match: {
        book: objectBookId
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "ratedBy",
        pipeline: [
          {
            $project: {
              username: 1
            }
          }
        ]
      }
    },
    {
      $unwind: "$ratedBy"
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        totalRatings: { $sum: 1 },
        usernames: { $addToSet: "$ratedBy.username" }
      }
    },
    {
      $project: {
        _id: 0,
        averageRating: {
          $floor: { $add: ["$averageRating", 0.5] } // rounding to nearest int
        },
        totalRatings: 1,
        usernames: 1
      }
    }
  ]);

  // if no ratings found
  if (!result || result.length === 0) {
    return res.status(200).json(
      new ApiResponse(200, { averageRating: 0, totalRatings: 0, usernames: [] }, "No ratings yet")
    );
  }

  return res.status(200).json(
    new ApiResponse(200, result[0], `Ratings for book ID - ${bookId} fetched successfully`)
  );
});


export {
    addOrUpdateRating,
    getBookRatings
}