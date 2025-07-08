import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import BookCard from "../components/BookCard"; // ✅ Ensure the path is correct

export const CategoryPage = () => {
  const { categoryName } = useParams();
  const [fetchedBooks, setFetchedBooks] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const formattedCategory = categoryName.toLowerCase().replace(/\s+/g, "-");
  const token = localStorage.getItem("token");

  const handleAddToCart = async (bookId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/cart/add`,
        {
          bookId,
          quantity: 1,
        },
        {
          withCredentials: true,
        }
      );
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/books/category/${categoryName}`);
        setFetchedBooks(res.data);
      } catch (err) {
        console.error("Failed to fetch books:", err);
      }
    };

    const fetchWishlist = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/users/wishlist`, {
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
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/toggle-wishlist`,
        { bookId },
        { withCredentials: true }
      );
      const updatedWishlist = res.data.data;
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
    image: b.bookImage,
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
          {books.map((book) => (
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
