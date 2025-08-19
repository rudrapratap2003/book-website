import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import BookCard from "../components/BookCard";
import api from "../api/axiosInstance.js";

export const CategoryPage = () => {
  const { categoryName } = useParams();
  const [allBooks, setAllBooks] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [averageRatings, setAverageRatings] = useState({});
  const token = localStorage.getItem("token");

  const normalizedCategory = categoryName?.toLowerCase().replace(/\s+/g, "-");

  const handleAddToCart = async (bookId) => {
    try {
      await api.post(
        `/api/v1/cart/add`,
        {
          bookId,
          quantity: 1,
        }
      );
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const handleWishlistToggle = async (bookId) => {
    try {
      const res = await api.post(
        `/api/v1/users/toggle-wishlist`,
        { bookId }
      );
      const updatedWishlist = res.data.data;
      setWishlist(updatedWishlist.map((book) => book._id));
    } catch (err) {
      console.error("Error toggling wishlist:", err);
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await api.get(`/api/v1/books/get-books`);
      setAllBooks(res.data);
    } catch (err) {
      console.error("Failed to fetch books:", err);
    }
  };

  const fetchWishlist = async () => {
    try {
      const res = await api.get(`/api/v1/users/wishlist`);
      setWishlist(res.data.data.map((book) => book._id));
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
    }
  };

  const fetchAverageRatings = async () => {
    try {
      const res = await api.get(`/api/v1/rating`);
      const ratings = {};
      res.data.data.forEach((r) => {
        ratings[r.bookId] = r.averageRating;
      });
      setAverageRatings(ratings);
    } catch (err) {
      console.error("Failed to fetch average ratings:", err);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchWishlist();
    fetchAverageRatings();
  }, [categoryName, token]);

  const filteredBooks = allBooks
    .filter((book) => {
      const bookCategory = book.category?.toLowerCase().replace(/\s+/g, "-");
      return bookCategory === normalizedCategory;
    })
    .map((b, index) => ({
      ...b,
      id: b._id || index,
      title: b.bookname || "Untitled",
      author: b.author || "Unknown",
      image: b.bookImage,
      rating: averageRatings[b._id] || 0, // ✅ Injecting average rating here
      price: b.price || 0,
      originalPrice: b.originalPrice || null,
      description: b.description || "",
    }));

  return (
    <div className="p-6">
      <h1 className="font-gothic text-3xl font-bold mb-6 capitalize">
        {normalizedCategory.replace(/-/g, " ")}
      </h1>

      {filteredBooks.length === 0 ? (
        <p className="font-parastoo text-lg text-gray-500">
          No books found in this category.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              isWishlisted={wishlist.includes(book.id)}
              onWishlistToggle={handleWishlistToggle}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};