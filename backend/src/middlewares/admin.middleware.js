import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";

const isAdmin = asyncHandler(async (req,res,next) => {
    const user = req.user
    if(!user || user.role !== "admin") {
        throw new ApiError(403, "Access denied: Admins only")
    }
    next()
})

export default isAdmin