import mongoose, {Schema} from "mongoose";

const ratingSchema = new Schema({
    book: {
        type: Schema.Types.ObjectId,
        ref: "Book"
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    comment: {
        type: String
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
}, {timestamps: true})

export const Rating = mongoose.model("Rating", ratingSchema)