import { asyncHandler } from "../utils/asynchandler.js";
import instance from "../utils/razorpay.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import crypto from "crypto";

const checkout = asyncHandler(async (req, res) => {
  const { money } = req.body;
  if (!money || isNaN(money)) {
    throw new ApiError(400, "Amount is required and must be a number");
  }

  const options = {
    amount: Number(money), // Razorpay works in paise
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
    payment_capture: 1,
  };

  try {
    const order = await instance.orders.create(options);
    console.log(order);
    res.status(200).json(
      new ApiResponse(200, {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID,
      }, "successful")
    );
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Something went wrong");
  }
});

const verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
    razorpay_signature: signature,
  } = req.body;

  const secret = process.env.RAZORPAY_KEY_SECRET;

  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(`${orderId}|${paymentId}`);
  const generatedSignature = hmac.digest("hex");

  if (generatedSignature === signature) {
    return res.status(200).json(new ApiResponse(200, null, "Payment verified"));
  } else {
    throw new ApiError(400, "Payment not verified");
  }
});

export { checkout, verifyPayment };
