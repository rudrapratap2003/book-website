import { useState, useEffect } from "react";
import BookCard from "../components/BookCard";
import api from "../api/axiosInstance.js";

const WishlistPage = () => {
  const [wishlistBooks, setWishlistBooks] = useState([]);

  useEffect(() => {
    const fetchWishlistBooks = async () => {
      try {
        const res = await api.get(`/api/v1/users/wishlist`);
        setWishlistBooks(res.data.data);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    };

    fetchWishlistBooks();
  }, []);

  const handleToggleWishlist = async (bookId) => {
    try {
      const res = await api.post(
        `/api/v1/users/toggle-wishlist`,
        { bookId }
      );
      const updatedWishlist = res.data.data;
      setWishlistBooks(updatedWishlist);
    } catch (err) {
      console.error("Failed to toggle wishlist:", err);
    }
  };

  const handleAddToCart = async (bookId) => {
    try {
      await api.post(
        `/api/v1/users/cart/add`,
        { bookId, quantity: 1 }
      );
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const books = wishlistBooks.map((book, index) => ({
    ...book,
    id: book._id || index,
    title: book.bookname || "Untitled",
    author: book.author || "Unknown",
    image: book.bookImage, 
    rating: book.rating || 0,
    price: book.price || 0,
    originalPrice: book.originalPrice || null,
    description: book.description || "",
  }));

  return (
    <div className="p-6">
      <h1 className="font-gothic text-3xl font-bold mb-6">Your Wishlist</h1>
      {books.length === 0 ? (
        <p className="font-parastoo text-lg text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              isWishlisted={true}
              onWishlistToggle={handleToggleWishlist}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;