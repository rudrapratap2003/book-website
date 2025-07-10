import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Book } from "../models/book.model.js";
import mongoose from "mongoose";

const placeOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { bookId, quantity = 1, items = [] } = req.body;

  const user = await User.findById(userId).populate("cart.book");
  if (!user) throw new ApiError(404, "User not found");

  let itemsToOrder = [];

  if (bookId) {
    // ✅ Buy Now
    const book = await Book.findById(bookId);
    if (!book) throw new ApiError(404, "Book not found");
    if (book.count < quantity) throw new ApiError(400, `Only ${book.count} copies available`);

    book.count -= quantity;
    book.buyers.push(userId);
    await book.save();

    itemsToOrder.push({ book: book._id, quantity });

  } else if (items.length > 0) {
    // ✅ Selected items from cart
    for (const item of items) {
      const book = await Book.findById(item.bookId);
      if (!book || book.count < item.quantity) {
        throw new ApiError(400, `Book "${book?.bookname || 'Unknown'}" is out of stock or insufficient quantity`);
      }

      book.count -= item.quantity;
      book.buyers.push(userId);
      await book.save();

      itemsToOrder.push({ book: book._id, quantity: item.quantity });
    }

    // ✅ Remove ordered items from cart
    const itemsBookIds = items.map(i => i.bookId.toString());

    user.cart = user.cart.filter(cartItem =>
      !itemsBookIds.includes(
        cartItem.book._id?.toString?.() || cartItem.book.toString()
      )
    );

    user.markModified("cart"); // ⚠️ Required if modifying embedded arrays
  } else {
    // ❌ Nothing to order
    throw new ApiError(400, "No items to order.");
  }

  // ✅ Save order
  user.order.push(...itemsToOrder);
  await user.save();

  res.status(200).json(
    new ApiResponse(200, { order: itemsToOrder }, "Order placed successfully")
  );
});


const getMyOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const orders = await User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(userId) } },
    { $unwind: "$order" },
    {
      $lookup: {
        from: "books",
        localField: "order.book",
        foreignField: "_id",
        as: "bookDetails"
      }
    },
    { $unwind: "$bookDetails" },
    {
      $group: {
        _id: "$_id",
        books: {
          $push: {
            book: "$bookDetails",
            quantity: "$order.quantity"
          }
        }
      }
    },
    {
      $addFields: {
        status: "delivered",
        returnTill: {
          $dateToString: {
            date: {
              $add: [new Date(), 7 * 24 * 60 * 60 * 1000]
            },
            format: "%Y-%m-%d"
          }
        }
      }
    }
  ]);

  res.status(200).json(
    new ApiResponse(200, { orders }, "Orders fetched successfully")
  );
});

export {
  placeOrder,
  getMyOrders
}