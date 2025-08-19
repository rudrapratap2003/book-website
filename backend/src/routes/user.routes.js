import { Router } from "express";
import {
    loginUser,
    logoutUser, 
    registerUser,
    toggleWishlist,
    wishlistofUser,
    getMyProfile,
    updateAccountDetails,
    addAddress,
    getAddresses,
    changeCurrentPassword,
    deleteAccount,
    refreshAccessToken
} from "../controllers/user.controller.js";
import {cancelOrder, getMyOrders, placeOrder, returnOrder} from "../controllers/order.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()

router.route("/register").post(registerUser) // http://localhost:8000/api/v1/users/register    
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh").post(refreshAccessToken)
router.route("/toggle-wishlist").post(verifyJWT, toggleWishlist)
router.route("/wishlist").get(verifyJWT, wishlistofUser)
router.route("/myprofile").get(verifyJWT, getMyProfile)

router.route("/update").put(verifyJWT, updateAccountDetails)
router.route("/add-address").post(verifyJWT, addAddress)
router.route("/get-addresses").get(verifyJWT, getAddresses)
router.route("/changepassword").post(verifyJWT, changeCurrentPassword)
router.route("/delete-account").post(verifyJWT,deleteAccount)

router.route("/order-place").post(verifyJWT, placeOrder)
router.route("/my-orders").get(verifyJWT, getMyOrders)
router.route("/cancel-order/:id").post(verifyJWT, cancelOrder)
router.route("/return-order/:id").post(verifyJWT, returnOrder)
export default router;