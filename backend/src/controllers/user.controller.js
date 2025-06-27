import { asyncHandler } from "../utils/asynchandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {Book} from "../models/book.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        // add refresh token to database which is in user.module.js
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating access and refresh token")
    }
}

const registerUser = asyncHandler(async (req,res) => {
    const {fullName, email, username, password, phoneNo} = req.body
    if([fullName, email, username, password, phoneNo].some((field) => field ?.trim() ==="")) {
        throw new ApiError(400, "All fields are required")
    }
    const existedUser = await User.findOne({
        $or : [{username}, {email}]
    })
    if(existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    const user = await User.create({
        fullName,
        phoneNo,
        email,
        password,
        username: username.toLowerCase()
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
    )
})

const loginUser = asyncHandler(async (req,res) => {
    const {email,username,password} = req.body
    if(!(username || email)) {
        throw new ApiError(400,"username or email is required")
    }
    const user = await User.findOne({
        $or: [{username},{email}]
    })
    if(!user) {
        throw new ApiError(404, "user doesnot exist")
    }
    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid) {
        throw new ApiError(401,"Invalid User Credentials")
    }
    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In successfully"
        )
    )
})

const getMe = (req, res) => {
  // req.user was set by auth.middleware.js
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  res.json(req.user);          // or pick the fields you need
};

const getMyProfile = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    throw new ApiError(401, "Unauthorized");
  }

  const user = await User.findById(req.user._id).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(new ApiResponse(200, user, "User profile fetched successfully"));
});


const logoutUser = asyncHandler(async (req,res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true  // this gives a new response which will return a true value i.e the refresh token will give a undefined value. If this field is not written there can be a chance of getting the refresh token again.
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200, {},"User logged out"))
})

const refreshAccessToken = asyncHandler(async (req,res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken) {
        throw new ApiError(401,"unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
        if(!user) {
            throw new ApiError(401,"Invalid refresh token")
        }
    
        if(incomingRefreshToken != user?.refreshToken) {
            throw new ApiError(401,"refresh token is expired or used")
        }
    
        const options = {
            httpOnly: true, 
            secure: true
        }
    
        const {accessToken,newrefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newrefreshToken,options)
        .json(
            new ApiResponse(
                200,
                {accessToken,newrefreshToken},
                "Access token refreshed"
            )
        )
    } catch(error) {
        throw new ApiError(401,error?.message || "Invalid refresh token")
    }
})

const toggleWishlist = asyncHandler(async (req,res) => {
    try {
        const {bookId} = req.body
        if(!bookId) {
            throw new ApiError(400, "Invalid book id")
        }
        const user = await User.findById(req.user._id)
        if(!user) {
            throw new ApiError(404,"User not found");
        }
        const alreadyInWishlist = user.wishlist.includes(bookId)

        if(alreadyInWishlist) {
            user.wishlist.pull(bookId)
        } else {
            user.wishlist.push(bookId)
        }
        await user.save()
        await user.populate("wishlist");

        res.status(200).json(
            new ApiResponse(200,user.wishlist, alreadyInWishlist ? "Removed From wishlist" : "Added to wishlist")
        )
    } catch(error) {
        throw new ApiError(500,"Something went wrong")
    }
})

const wishlistofUser = asyncHandler(async (req,res) => {
    const user = await User.findById(req.user._id).populate("wishlist");
    if(!user) throw new ApiError(404,"User not found")
    const wishlist = user.wishlist
    if(wishlist.length == 0) {
        res.status(200).json(new ApiResponse(200,[],"wishlist is empty"))
    } else {
        res.status(200).json(new ApiResponse(200,wishlist,"wishlist fetched successfully"))
    }
})

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
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    toggleWishlist,
    wishlistofUser,
    getMe,
    getCart,
    addToCart,
    removeCartItems,
    getMyProfile
}