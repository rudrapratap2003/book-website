import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { errorHandler } from "./middlewares/eeorHandler.middleware.js"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
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
//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/cart", cartRouter)
app.use("/api/v1/books", bookRouter)
app.use("/api/v1", authRoutes)
app.use("/api/v1/admin", adminRouter)

app.use(errorHandler)

export { app }