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

//routes declaration
app.use("/api/v1/users", userRouter) // http://localhost:8000/api/v1/users
app.use("/api/v1/books", bookRouter) // http://localhost:8000/api/v1/books

app.use(errorHandler)

export { app }