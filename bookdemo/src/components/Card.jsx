import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import { IoClose } from "react-icons/io5"; // Close icon

export const Card = ({ book }) => {
  const [hovered, setHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* Card Component */}
      <div
        className="relative p-4 rounded-lg w-60 text-center border border-gray-200 shadow-md"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Book Image Container */}
        <div className="relative">
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-60 object-cover rounded-lg"
          />

          {/* Quick View Button (Appears at Bottom of Image on Hover) */}
          {hovered && (
            <button
              className="absolute bottom-0 left-0 w-full bg-white text-orange-500 border border-orange-500 font-semibold py-1 transition-all"
              onClick={() => setShowModal(true)}
            >
              QUICK VIEW
            </button>
          )}
        </div>

        {/* Book Details */}
        <div className="text-lg font-semibold mt-2 text-gray-800">{book.title}</div>
        <div className="text-sm text-gray-600">{book.author}</div>

        {/* Star Ratings */}
        <div className="flex justify-center my-1">
          {Array.from({ length: 5 }, (_, index) =>
            index < book.rating ? (
              <FaStar key={index} className="text-yellow-500" />
            ) : (
              <FaRegStar key={index} className="text-gray-400" />
            )
          )}
        </div>

        {/* Price */}
        <div className="text-red-600 font-bold text-lg">₹{book.price}</div>
        {book.originalPrice && (
          <div className="text-gray-400 line-through text-sm">₹{book.originalPrice}</div>
        )}
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96 relative">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
              onClick={() => setShowModal(false)}
            >
              <IoClose size={24} />
            </button>

            {/* Book Info */}
            <div className="flex gap-4">
              <img
                src={book.image}
                alt={book.title}
                className="w-24 h-36 object-cover rounded"
              />
              <div>
                <h2 className="text-xl font-bold">{book.title}</h2>
                <p className="text-gray-600">By: {book.author}</p>
                <p className="text-gray-500">Published: {book.releaseDate}</p>
                <p className="text-red-600 font-bold">₹{book.price}</p>
                {book.originalPrice && (
                  <p className="text-gray-400 line-through">₹{book.originalPrice}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm mt-4">{book.description}</p>

            {/* Buttons */}
            <div className="mt-4 flex gap-2">
              <button className="bg-red-500 text-white px-4 py-2 rounded w-full">
                Add To Cart
              </button>
              <button
                className="border border-red-500 text-red-500 px-4 py-2 rounded w-full"
                onClick={() => navigate(`/book/${book.id}`)}
              >
                View Product Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
