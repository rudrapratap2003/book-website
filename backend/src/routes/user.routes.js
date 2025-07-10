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
    deleteAccount
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()

router.route("/register").post(registerUser) // http://localhost:8000/api/v1/users/register    
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/toggle-wishlist").post(verifyJWT, toggleWishlist)
router.route("/wishlist").get(verifyJWT, wishlistofUser)


router.route("/myprofile").get(verifyJWT, getMyProfile)

router.route("/update").put(verifyJWT, updateAccountDetails)
router.route("/add-address").post(verifyJWT, addAddress)
router.route("/get-addresses").get(verifyJWT, getAddresses)
router.route("/changepassword").post(verifyJWT, changeCurrentPassword)
router.route("/delete-account").post(verifyJWT,deleteAccount)

export default router;


