import { Router } from "express";
import { 
    getPendingBooks,
    approveBook,
    rejectBook
 } from "../controllers/admin.controller.js";
import isAdmin from "../middlewares/admin.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()
router.route('/pending').get(verifyJWT,isAdmin,getPendingBooks)
router.route('/approve').put(verifyJWT,isAdmin,approveBook)
router.route('/reject').put(verifyJWT,isAdmin,rejectBook)

export default router