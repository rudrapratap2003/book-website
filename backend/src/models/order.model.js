import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        _id: false,
        book: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    status: {
      type: String,
      default: "placed",
    },

    placedAt: {
      type: Date,
      default: Date.now,
    },

    returnTill: {
      type: Date,
    },
  }, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);
