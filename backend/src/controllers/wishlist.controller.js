import {Wishlist} from "../models/wishlist.model.js"

const addToWishlist = async(req, res) => {
    const userId = req.user.id
     const {bookId} = req.params

    try{
        const exists = await Wishlist.findOne({userId, bookId})
        if(exists){
            return res.status(409).json({message: "Book already exists in wishlist"})
        }

        const entry = new Wishlist({userId, bookId})
        await entry.save();

        res.status(201).json({message:"Book added to wishlist."})
    }catch(err){
        res.status(500).json({message: "Error adding to wishlist", error:err})
    }
}

const removeFromWishlist = async(req,res) => {
    const userId = req.user.id
    const {bookId} = req.params

    try{
        await Wishlist.findOneAndDelete({userId, bookId})
        res.status(200).json({message:"Book removed from wishlist."})
    }catch(err){
        res.status(500).json({message:"Error removing from wishlist", error:err})
    }
}

const getWishlist = async(req,res) => {
    const userId = req.user.id
    try{
        const items = await Wishlist.find({userId}).populate("bookId")
        const books = items.map((item) => item.bookId);
        res.status(200).json(books)
    }catch(err){
        res.status(500).json({message:"Error fetching wishlist", error:err})
    }
}

export {
    addToWishlist,
    removeFromWishlist,
    getWishlist
}