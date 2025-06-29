import mongoose, {Schema} from "mongoose"

const bookSchema = new Schema({
    bookname: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String
    },
    category: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    count: {
        type: Number,
        default: 1
    },
    bookImage: {
        type: String, // cloudinary url
        required: true,
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: "User" 
    },
    buyers: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
        index: true,
    },
    rejectionReason: { 
        type: String, 
        default: "" 
    },
},{timestamps: true})

export const Book = mongoose.model("Book", bookSchema)