import { asyncHandler } from "../utils/asynchandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {Book} from "../models/book.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const getCart = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.book");

    res.status(200).json(
        new ApiResponse(200, {
      cartItems: user.cart.map((item) => ({
        _id: item._id,
        book: item.book,
        quantity: item.quantity
      }))
    },"user cart fetched successfully")
    );
  } catch (err) {
    throw new ApiError(500,"Failed to fetch cart items")
  }
})

const addToCart = async (req, res) => {
  const { bookId, quantity } = req.body;

  if (!bookId || !quantity) {
    throw new ApiError(400, "book id and quantity are required")
  }

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      throw new ApiError(404, "Book not found")
    }

    if (quantity > book.quantity) {
      throw new ApiError(400,`Only ${book.quantity} copies of this book are available`)
    }

    const user = await User.findById(req.user._id);

    const existingItem = user.cart.find(
      (item) => item.book.toString() === bookId
    );

    if (existingItem) {

      if (quantity > book.quantity) {
        throw new ApiError(400, `You already have ${existingItem.quantity} in your cart. Only ${book.quantity} total available.`)
      }

      existingItem.quantity = quantity;

    } else {
      user.cart.push({ book: bookId, quantity });
    }

    await user.save();

    return res.status(200).json(
        new ApiResponse(200,{ cart: user.cart },"Item added to cart successfully")
    )
  } catch (err) {
    console.error("AddToCart Error:", err);
    throw new ApiError(500,"Failed to add to cart")
  }
};


const removeCartItems = (async (req, res) => {
  const { ids } = req.body; // Array of book IDs to remove

  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: {
        cart: { _id: { $in: ids } }
      }
    });

    return res.status(200).json(
        new ApiResponse(200,"Selected items removed from cart")
    )
  } catch (err) {
    throw new ApiError(500,"Failed to remove item from the cart")
  }
})

export {
    getCart,
    addToCart,
    removeCartItems
}