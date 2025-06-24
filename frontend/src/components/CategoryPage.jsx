import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaStar, FaRegStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import axios from "axios";

export const CategoryPage = () => {
  const { categoryName } = useParams();
  const [selectedBook, setSelectedBook] = useState(null);
  const [fetchedBooks, setFetchedBooks] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const formattedCategory = categoryName.toLowerCase().replace(/\s+/g, "-");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get(`/api/v1/books/category/${categoryName}`);
        setFetchedBooks(res.data);
      } catch (err) {
        console.error("Failed to fetch books:", err);
      }
    };

    const fetchWishlist = async () => {
      try {
        const res = await axios.get("/api/v1/users/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist(res.data.data.map((book) => book._id));
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
      }
    };

    fetchBooks();
    fetchWishlist();
  }, [categoryName, token]);

  const handleWishlistToggle = async (bookId) => {
  try {
    const res = await axios.post(
      "/api/v1/users/toggle-wishlist",
      { bookId },
      { withCredentials: true }
    );

    const updatedWishlist = res.data.data;

    // Update local state
    setWishlist(updatedWishlist.map((book) => book._id));
  } catch (err) {
    console.error("Error toggling wishlist:", err);
  }
};

  const books = fetchedBooks.map((b, index) => ({
    ...b,
    id: b._id || index,
    title: b.bookname || "Untitled",
    author: b.author || "Unknown",
    image: b.image || "/images/placeholder.jpg",
    rating: b.rating || 0,
    price: b.price || 0,
    originalPrice: b.originalPrice || null,
    description: b.description || "",
  }));

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 capitalize">
        {formattedCategory.replace(/-/g, " ")}
      </h1>

      {books.length === 0 ? (
        <p className="text-gray-500">No books found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {books.map((book) => {
            const discount = book.originalPrice
              ? Math.round(
                  ((book.originalPrice - book.price) / book.originalPrice) * 100
                )
              : 0;

            const isWishlisted = wishlist.includes(book.id);

            return (
              <div
                key={book.id}
                className="relative p-4 rounded-lg border border-gray-200 shadow-md bg-white w-60"
              >
                {discount > 0 && (
                  <div className="absolute top-0 left-0 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
                    {discount}% OFF
                  </div>
                )}

                <button
                  className="absolute top-2 right-2 text-xl"
                  onClick={() => handleWishlistToggle(book.id)}
                >
                  {isWishlisted ? (
                    <FaHeart className="text-red-700" />
                  ) : (
                    <FaRegHeart className="text-gray-400 hover:text-red-500" />
                  )}
                </button>

                <div className="relative">
                  <img
                    src={book.image}
                    alt={book.title}
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
                  {book.title}
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

                <div className="text-red-600 font-bold text-lg">
                  ₹{book.price}
                </div>
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
                src={selectedBook.image}
                alt={selectedBook.title}
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
            <div className="w-2/3 space-y-2">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold">{selectedBook.title}</h2>
                <button onClick={() => handleWishlistToggle(selectedBook.id)}>
                  {wishlist.includes(selectedBook.id) ? (
                    <FaHeart className="text-red-700 text-xl" />
                  ) : (
                    <FaRegHeart className="text-gray-400 text-xl hover:text-red-500" />
                  )}
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

              <p className="text-gray-700 text-sm">
                {selectedBook.description}
              </p>

              <div className="flex gap-2 mt-4">
                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
                  Add To Cart
                </button>
                <button
                  className={`border px-4 py-2 rounded transition ${
                    wishlist.includes(selectedBook.id)
                      ? "bg-red-500 text-white border-red-500"
                      : "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  }`}
                  onClick={() => handleWishlistToggle(selectedBook.id)}
                >
                  {wishlist.includes(selectedBook.id)
                    ? "Remove from Wishlist"
                    : "Add to Wishlist"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
