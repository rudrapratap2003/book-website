import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";
import { Book } from "../models/book.model.js";
import mongoose from "mongoose";

/* =====================================================
   📌 PLACE ORDER
===================================================== */
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
    let totalAmount = 0;

    /* 1️⃣ BUY NOW */
    if (bookId) {
      const book = await Book.findById(bookId).session(session);
      if (!book) throw new ApiError(404, "Book not found");
      if (book.count < quantity)
        throw new ApiError(400, `Only ${book.count} copies available.`);

      book.count -= quantity;
      book.buyers.push(userId);
      await book.save({ session });

      itemsToOrder.push({ book: book._id, quantity });
      totalAmount += book.price * quantity;
    }

    /* 2️⃣ CART ITEMS */
    if (items.length) {
      for (const { bookId: id, quantity: qty = 1 } of items) {
        const book = await Book.findById(id).session(session);
        if (!book) throw new ApiError(404, `Book with id ${id} not found.`);
        if (book.count < qty)
          throw new ApiError(
            400,
            `Only ${book.count} copies of “${book.bookname}” left.`
          );

        book.count -= qty;
        book.buyers.push(userId);
        await book.save({ session });

        itemsToOrder.push({ book: book._id, quantity: qty });
        totalAmount += book.price * qty;
      }

      // remove ordered items from cart
      const user = await User.findById(userId).session(session);
      const orderedIds = items.map(i => i.bookId.toString());
      user.cart = user.cart.filter(
        c => !orderedIds.includes((c.book._id || c.book).toString())
      );
      user.markModified("cart");
      await user.save({ session });
    }

    /* 3️⃣ CREATE ORDER */
    const [order] = await Order.create(
      [
        {
          user: userId,
          items: itemsToOrder,
          totalAmount,
          returnTill: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    /* DEMO STATUS SIMULATION */
    setTimeout(async () => {
      try {
        const current = await Order.findById(order._id);
        if (current && current.status === "placed") {
          await Order.findByIdAndUpdate(order._id, {
            status: "shipped",
            shippedAt: new Date(),
          });
        }
      } catch (e) {
        console.error(`Auto-update order ${order._id} → shipped failed`, e);
      }
    }, 30_000);

    setTimeout(async () => {
      try {
        const current = await Order.findById(order._id);
        if (current && current.status === "shipped") {
          await Order.findByIdAndUpdate(order._id, {
            status: "delivered",
            deliveredAt: new Date(),
          });
        }
      } catch (e) {
        console.error(`Auto-update order ${order._id} → delivered failed`, e);
      }
    }, 80_000);

    return res
      .status(201)
      .json(new ApiResponse(201, { order }, "Order placed successfully"));
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
});

/* =====================================================
   📌 GET USER ORDERS
===================================================== */
const getMyOrders = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user._id);

  const orders = await Order.aggregate([
    { $match: { user: userId } },
    { $sort: { createdAt: -1 } },
    { $unwind: "$items" },
    {
      $lookup: {
        from: "books",
        localField: "items.book",
        foreignField: "_id",
        as: "items.book",
      },
    },
    { $unwind: "$items.book" },
    {
      $group: {
        _id: "$_id",
        status: { $first: "$status" },
        totalAmount: { $first: "$totalAmount" },
        placedAt: { $first: "$placedAt" },
        shippedAt: { $first: "$shippedAt" },
        deliveredAt: { $first: "$deliveredAt" },
        returnTill: { $first: "$returnTill" },
        returnInitiatedAt: { $first: "$returnInitiatedAt" },
        productReceivedAt: { $first: "$productReceivedAt" },
        refundCompletedAt: { $first: "$refundCompletedAt" },
        createdAt: { $first: "$createdAt" },
        items: {
          $push: {
            book: "$items.book",
            quantity: "$items.quantity",
          },
        },
      },
    },
    { $sort: { placedAt: -1, _id: -1 } },
  ]);

  res
    .status(200)
    .json(new ApiResponse(200, { orders }, "Your orders fetched successfully"));
});

/* =====================================================
   📌 CANCEL ORDER
===================================================== */
const cancelOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const userId = req.user._id;

  const order = await Order.findOne({ _id: orderId, user: userId }).populate(
    "items.book"
  );
  if (!order) throw new ApiError(404, "Order not found");

  if (order.status === "shipped" || order.status === "delivered") {
    throw new ApiError(400, "Cannot cancel order after it is shipped or delivered");
  }
  if (order.status === "cancelled") {
    throw new ApiError(400, "Order is already cancelled");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    order.status = "cancelled";
    await order.save({ session });

    for (const item of order.items) {
      const book = await Book.findById(item.book._id).session(session);
      if (book) {
        book.count += item.quantity;
        book.buyers = book.buyers.filter(
          buyerId => buyerId.toString() !== userId.toString()
        );
        await book.save({ session });
      }
    }

    await session.commitTransaction();
    session.endSession();

    res
      .status(200)
      .json(new ApiResponse(200, { order }, "Order cancelled successfully"));
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
});

/* =====================================================
   📌 RETURN ORDER (multi-step)
===================================================== */
// controllers/orderController.js
const returnOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const userId = req.user._id;

  const order = await Order.findOne({ _id: orderId, user: userId }).populate("items.book");
  if (!order) throw new ApiError(404, "Order not found");

  if (order.status !== "delivered") {
    throw new ApiError(400, "Only delivered orders can be returned");
  }

  if (!order.returnTill || new Date() > new Date(order.returnTill)) {
    throw new ApiError(400, "Return period has expired");
  }

  // 1️⃣ Immediately mark return initiated
  order.status = "Return Initiated";
  order.returnInitiatedAt = new Date();
  await order.save();

  // 2️⃣ After 20 sec → Product Received + Increase book count
  setTimeout(async () => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const orderToUpdate = await Order.findById(orderId).populate("items.book").session(session);

      if (!orderToUpdate) throw new Error("Order not found during product_received update");

      orderToUpdate.status = "Product Received";
      orderToUpdate.productReceivedAt = new Date();
      await orderToUpdate.save({ session });

      // Restore book counts
      for (const item of orderToUpdate.items) {
        const book = await Book.findById(item.book._id).session(session);
        if (book) {
          book.count += item.quantity;
          await book.save({ session });
        }
      }

      await session.commitTransaction();
      session.endSession();
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error during product_received update:", err);
    }
  }, 20000);

  // 3️⃣ After 40 sec → Refund Completed
  setTimeout(async () => {
    try {
      await Order.findByIdAndUpdate(orderId, {
        status: "Refund Completed",
        refundCompletedAt: new Date(),
      });
    } catch (err) {
      console.error("Error during refund_completed update:", err);
    }
  }, 40000);

  res.status(200).json(
    new ApiResponse(200, { order }, "Return process initiated")
  );
});


export { placeOrder, getMyOrders, cancelOrder, returnOrder };