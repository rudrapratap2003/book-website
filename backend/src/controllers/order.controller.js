import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";
import { Book } from "../models/book.model.js";
import mongoose from "mongoose";

const placeOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { bookId, quantity = 1, items = [] } = req.body;

  if (!bookId && (!items || !items.length)) {
    throw new ApiError(400, "No items to order.");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const itemsToOrder = [];

    /* 1️⃣  BUY‑NOW -------------------------------------------------- */
    if (bookId) {
      const book = await Book.findById(bookId).session(session);
      if (!book) throw new ApiError(404, "Book not found");
      if (book.count < quantity)
        throw new ApiError(400, `Only ${book.count} copies available`);

      book.count -= quantity;
      book.buyers.push(userId);
      await book.save({ session });

      itemsToOrder.push({ book: book._id, quantity });
    }

    /* 2️⃣  SELECTED CART ITEMS -------------------------------------- */
    if (items.length) {
      for (const { bookId: id, quantity: qty = 1 } of items) {
        const book = await Book.findById(id).session(session);
        if (!book) throw new ApiError(404, `Book with id ${id} not found`);
        if (book.count < qty)
          throw new ApiError(
            400,
            `Only ${book.count} copies of “${book.bookname}” left`
          );

        book.count -= qty;
        book.buyers.push(userId);
        await book.save({ session });

        itemsToOrder.push({ book: book._id, quantity: qty });
      }

      // ✂️ remove purchased items from cart
      const user = await User.findById(userId).session(session);
      const orderedIds = items.map(i => i.bookId.toString());
      user.cart = user.cart.filter(
        c => !orderedIds.includes((c.book._id || c.book).toString())
      );
      user.markModified("cart");
      await user.save({ session });
    }

    /* 3️⃣  INSERT ORDER --------------------------------------------- */
    const [order] = await Order.create(
      [
        {
          user: userId,
          items: itemsToOrder,
          // status defaults to "placed"
          returnTill: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    /* 🔄  DEMO‑ONLY STATUS SIMULATION ────────────────────────────── */
    // after 10 s   ➜ shipped
    setTimeout(async () => {
      try {
        await Order.findByIdAndUpdate(order._id, { status: "shipped" });
      } catch (e) {
        console.error(`Failed to auto‑update order ${order._id} → shipped`, e);
      }
    }, 10_000);
    // after 20 s   ➜ delivered
    setTimeout(async () => {
      try {
        await Order.findByIdAndUpdate(order._id, { status: "delivered" });
      } catch (e) {
        console.error(`Failed to auto‑update order ${order._id} → delivered`, e);
      }
    }, 20_000);
    /* ────────────────────────────────────────────────────────────── */

    return res
      .status(201)
      .json(new ApiResponse(201, { order }, "Order placed successfully"));
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err; // handled by asyncHandler
  }
});

const getMyOrders = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user._id);

  const orders = await Order.aggregate([
    { $match: 
      { 
        user: userId 
      } 
    },
    { 
      $sort: 
      { 
        createdAt: -1 
      } 
    },

    { 
      $unwind: "$items" 
    },
    {
      $lookup: {
        from: "books",
        localField: "items.book",
        foreignField: "_id",
        as: "items.book",
      },
    },
    { 
      $unwind: "$items.book" 
    },

    {
      $group: {
        _id: "$_id",
        status: { $first: "$status" },
        placedAt: { $first: "$placedAt" },
        returnTill: { $first: "$returnTill" },
        createdAt: { $first: "$createdAt" },
        items: {
          $push: {
            book: "$items.book",
            quantity: "$items.quantity",
          },
        },
      },
    },
    { $sort: { placedAt: -1, _id: -1 } }
  ]);

  res
    .status(200)
    .json(new ApiResponse(200, { orders }, "Your orders fetched successfully"));
});


export {
  placeOrder,
  getMyOrders
}