import { useState, useEffect } from "react";
import { FaStar, FaRegStar, FaHeart } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import axios from "axios";

const WishlistPage = () => {
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchWishlistBooks = async () => {
      try {
        const res = await axios.get("/api/v1/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlistBooks(res.data);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    };

    fetchWishlistBooks();
  }, [token]);

  const handleRemoveFromWishlist = async (bookId) => {
    try {
      await axios.delete(`/api/v1/wishlist/remove/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlistBooks((prev) => prev.filter((book) => book._id !== bookId));
      if (selectedBook?._id === bookId) {
        setSelectedBook(null); // close popup if open
      }
    } catch (err) {
      console.error("Failed to remove from wishlist:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>

      {wishlistBooks.length === 0 ? (
        <p className="text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {wishlistBooks.map((book) => {
            const discount = book.originalPrice
              ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
              : 0;

            return (
              <div
                key={book._id}
                className="relative p-4 rounded-lg border border-gray-200 shadow-md bg-white w-60"
              >
                {discount > 0 && (
                  <div className="absolute top-0 left-0 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
                    {discount}% OFF
                  </div>
                )}

                <button
                  className="absolute top-2 right-2 text-xl"
                  onClick={() => handleRemoveFromWishlist(book._id)}
                >
                  <FaHeart className="text-red-700" />
                </button>

                <div className="relative">
                  <img
                    src={book.image || "/images/placeholder.jpg"}
                    alt={book.bookname}
                    className="w-full h-60 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = "/images/placeholder.jpg";
                    }}
                  />
                  <button
                    className="absolute bottom-0 left-0 w-full bg-white text-orange-500 border border-orange-500 font-semibold py-1 opacity-90 hover:opacity-100 transition-all"
                    onClick={() => setSelectedBook(book)}
                  >
                    QUICK VIEW
                  </button>
                </div>

                <div className="text-lg font-semibold mt-2 text-gray-800">
                  {book.bookname}
                </div>
                <div className="text-sm text-gray-600">{book.author}</div>

                <div className="flex justify-center my-1">
                  {Array.from({ length: 5 }, (_, index) =>
                    index < book.rating ? (
                      <FaStar key={index} className="text-yellow-500" />
                    ) : (
                      <FaRegStar key={index} className="text-gray-400" />
                    )
                  )}
                </div>

                <div className="text-red-600 font-bold text-lg">₹{book.price}</div>
                {book.originalPrice && (
                  <div className="text-gray-400 line-through text-sm">
                    ₹{book.originalPrice}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] max-w-full relative flex gap-4">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl"
              onClick={() => setSelectedBook(null)}
            >
              <IoClose />
            </button>
            <div className="w-1/3">
              <img
                src={selectedBook.image || "/images/placeholder.jpg"}
                alt={selectedBook.bookname}
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
            <div className="w-2/3 space-y-2">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold">{selectedBook.bookname}</h2>
                <button onClick={() => handleRemoveFromWishlist(selectedBook._id)}>
                  <FaHeart className="text-red-500 text-xl" />
                </button>
              </div>
              <p className="text-gray-600">By: {selectedBook.author}</p>
              <div className="flex">
                {Array.from({ length: 5 }, (_, index) =>
                  index < selectedBook.rating ? (
                    <FaStar key={index} className="text-yellow-500" />
                  ) : (
                    <FaRegStar key={index} className="text-gray-400" />
                  )
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-red-600 font-bold text-lg">
                  ₹{selectedBook.price}
                </span>
                {selectedBook.originalPrice && (
                  <span className="text-gray-400 line-through text-sm">
                    ₹{selectedBook.originalPrice}
                  </span>
                )}
              </div>

              <p className="text-gray-700 text-sm">{selectedBook.description}</p>

              <div className="flex gap-2 mt-4">
                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
                  Add To Cart
                </button>
                <button
                  className="border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition"
                  onClick={() => handleRemoveFromWishlist(selectedBook._id)}
                >
                  Remove from Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
