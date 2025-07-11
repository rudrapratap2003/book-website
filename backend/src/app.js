import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { errorHandler } from "./middlewares/eeorHandler.middleware.js"

const app = express()

app.use(cors({
    origin: "https://book-cart-rho.vercel.app",
    // origin: "http://localhost:5173",
    credentials: true,
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// routes import
import userRouter from './routes/user.routes.js'
import bookRouter from './routes/book.routes.js'
import authRoutes from './routes/auth.routes.js'
import cartRouter from './routes/cart.routes.js'
import adminRouter from "./routes/admin.routes.js"
import ratingRouter from "./routes/rating.routes.js"
//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/cart", cartRouter)
app.use("/api/v1/books", bookRouter)
app.use("/api/v1", authRoutes)
app.use("/api/v1/admin", adminRouter)
app.use("/api/v1/rating", ratingRouter)

app.use(errorHandler)

export { app }