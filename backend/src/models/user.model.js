import mongoose, {Schema} from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true, 
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true, 
    },
    phoneNo: {
        type: String,
        required: true, 
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true, 
        index: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    avatar : {
        type: String,
        default: "default.jpg"
    },
    addresses: [
    {
      name: String,
      phone: String,
      pincode: String,
      locality: String,
      address: String,
      city: String,
      state: String,
      landmark: String,
      altPhone: String,
    }
  ],
    refreshToken: {
        type: String
    },
    wishlist: [
        {
            type: Schema.Types.ObjectId,
            ref: "Book"
        }
    ],
    cart: [
        {
            book: { type: Schema.Types.ObjectId, ref: "Book" },
            quantity: { type: Number, default: 1 }
        }
    ]
},{timestamps: true})

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id, 
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)