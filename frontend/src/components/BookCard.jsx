import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaStar,
  FaRegStar,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const BookCard = ({ book, isWishlisted, onWishlistToggle, onAddToCart }) => {
  const [showModal, setShowModal] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const navigate = useNavigate();

  const discount = book.originalPrice
    ? Math.round(
        ((book.originalPrice - book.price) / book.originalPrice) * 100
      )
    : 0;

  const handleWishlistClick = () => {
    const newStatus = !isWishlisted;
    onWishlistToggle(book.id);

    // Show appropriate toast message
    if (newStatus) {
      setToastMsg("Your item has been added to wishlist");
    } else {
      setToastMsg("Item removed from wishlist");
    }

    // Auto hide after 2s
    setTimeout(() => {
      setToastMsg(null);
    }, 2000);
  };

  return (
    <>
      {/* Book Card */}
      <div className="relative p-4 rounded-lg border border-gray-200 shadow-md bg-white w-60">
        <div className="relative">
          {/* Wishlist icon on image */}
          <button
            className="absolute top-2 right-2 text-xl z-10"
            onClick={handleWishlistClick}
          >
            {isWishlisted ? (
              <FaHeart className="text-red-700" />
            ) : (
              <FaRegHeart className="text-gray-400 hover:text-red-500" />
            )}
          </button>

          <img
            src={book.image}
            alt={book.title}
            className="w-full h-60 object-cover rounded-lg"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/book2.jpg";
            }}
          />

          <button
            className="font-gothic absolute bottom-0 left-0 w-full bg-white text-orange-500 border border-orange-500 font-medium py-1 opacity-90 hover:opacity-100 transition-all"
            onClick={() => setShowModal(true)}
          >
            QUICK VIEW
          </button>
        </div>

        <div className="font-parastoo text-xl font-semibold mt-2 text-gray-800">
          {book.title}
        </div>
        <div className="font-parastoo text-base text-gray-600">{book.author}</div>

        <div className="flex justify-center my-1">
          {Array.from({ length: 5 }, (_, index) =>
            index < book.rating ? (
              <FaStar key={index} className="text-yellow-500" />
            ) : (
              <FaRegStar key={index} className="text-gray-400" />
            )
          )}
        </div>

        {/* Price + Buy Now */}
        <div className="flex justify-between items-center mt-2">
          <span className="font-parastoo text-red-600 font-bold text-xl">
            ₹{book.price}
          </span>
          <button
            className="font-gothic text-sm bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition"
            onClick={() => navigate(`/checkout/${book.id}`)}
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* Quick View Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] max-w-full relative flex gap-4">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl"
              onClick={() => setShowModal(false)}
            >
              <IoClose />
            </button>
            <div className="w-1/3">
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
            <div className="w-2/3 space-y-2">
              <div className="flex justify-between items-start">
                <h2 className="font-parastoo text-2xl font-bold">
                  {book.title}
                </h2>
                <button onClick={handleWishlistClick}>
                  {isWishlisted ? (
                    <FaHeart className="text-red-700 text-xl" />
                  ) : (
                    <FaRegHeart className="text-gray-400 text-xl hover:text-red-500" />
                  )}
                </button>
              </div>
              <p className="font-parastoo text-lg text-gray-600">
                By: {book.author}
              </p>
              <div className="flex">
                {Array.from({ length: 5 }, (_, index) =>
                  index < book.rating ? (
                    <FaStar key={index} className="text-yellow-500" />
                  ) : (
                    <FaRegStar key={index} className="text-gray-400" />
                  )
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="font-parastoo text-red-600 font-bold text-xl">
                  ₹{book.price}
                </span>
              </div>

              <p className="font-parastoo text-gray-700 text-base">
                {book.description}
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  className="font-gothic bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  onClick={() => {
                    onAddToCart(book.id);
                    setShowModal(false);
                  }}
                >
                  Add To Cart
                </button>
                <button
                  className={`font-gothic border px-4 py-2 rounded transition ${
                    isWishlisted
                      ? "bg-red-500 text-white border-red-500"
                      : "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  }`}
                  onClick={handleWishlistClick}
                >
                  {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Toast Popup */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white border border-green-500 px-4 py-2 rounded shadow-md flex items-center gap-4 z-[999]">
          <span className="font-parastoo text-sm text-gray-800">{toastMsg}</span>
          <button
            onClick={() => navigate("/myprofile/wishlist")}
            className="text-yellow-700 text-sm font-gothic hover:underline"
          >
            Do Changes
          </button>
        </div>
      )}
    </>
  );
};

export default BookCard;
