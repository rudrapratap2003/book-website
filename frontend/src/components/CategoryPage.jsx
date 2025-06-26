import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaStar, FaRegStar, FaHeart, FaRegHeart } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import book2 from "../images/book2.jpg"

export const CategoryPage = () => {
  const { categoryName } = useParams();
  const [selectedBook, setSelectedBook] = useState(null);
  const [fetchedBooks, setFetchedBooks] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const formattedCategory = categoryName.toLowerCase().replace(/\s+/g, "-");
  const token = localStorage.getItem("token");

      const handleAddToCart = async (bookId) => {
  try {
    
    await axios.post(
      "/api/v1/users/cart/add",
      {
        bookId,
        quantity: 1,
      },
      {
        withCredentials: true,
      }
    );
    setSelectedBook(null);
  } catch (err) {
    console.error("Error:", err);
  }
};

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
      <h1 className="font-gothic text-3xl font-bold mb-6 capitalize">
        {formattedCategory.replace(/-/g, " ")}
      </h1>

      {books.length === 0 ? (
        <p className="font-parastoo text-lg text-gray-500">No books found in this category.</p>
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
                    src={book.image || book2}
                    alt={book.title}
                    className="w-full h-60 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.onerror = null; // prevents infinite loop in case book2 also fails
                      e.target.src = book2;
                    }}
                  />

                  <button
                    className="font-gothic absolute bottom-0 left-0 w-full bg-white text-orange-500 border border-orange-500 font-medium py-1 opacity-90 hover:opacity-100 transition-all"
                    onClick={() => setSelectedBook(book)}
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

                <div className="text-red-600 font-bold text-xl font-parastoo">
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
                <h2 className="font-parastoo text-2xl font-bold">{selectedBook.title}</h2>
                <button onClick={() => handleWishlistToggle(selectedBook.id)}>
                  {wishlist.includes(selectedBook.id) ? (
                    <FaHeart className="text-red-700 text-xl" />
                  ) : (
                    <FaRegHeart className="text-gray-400 text-xl hover:text-red-500" />
                  )}
                </button>
              </div>
              <p className="font-parastoo text-lg text-gray-600">By: {selectedBook.author}</p>
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
                <span className="font-parastoo text-red-600 font-bold text-xl">
                  ₹{selectedBook.price}
                </span>
              </div>

              <p className="font-parastoo text-gray-700 text-base">
                {selectedBook.description}
              </p>

              <div className="flex gap-2 mt-4">
                <button className="font-gothic bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition" onClick={() => handleAddToCart(selectedBook.id)}>
                  Add To Cart
                </button>
                <button
                  className={`font-gothic border px-4 py-2 rounded transition ${
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
