import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BookCard from "../components/BookCard"; // adjust path if needed

const SearchResults = () => {
  const { query } = useParams();
  const [books, setBooks] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookRes, wishlistRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/books/search?query=${query}`
          ),
          axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/wishlist`,
            { withCredentials: true }
          ),
        ]);

        const formattedBooks = bookRes.data.map((b, index) => ({
          ...b,
          id: b._id || index,
          title: b.bookname || "Untitled",
          author: b.author || "Unknown",
          image: b.bookImage, // use bookImage for Cloudinary
          rating: b.rating || 0,
          price: b.price || 0,
          originalPrice: b.originalPrice || null,
          description: b.description || "",
        }));

        setBooks(formattedBooks);
        setWishlist(wishlistRes.data.data.map((book) => book._id));
      } catch (err) {
        console.error("Error fetching search results or wishlist:", err);
      }
    };

    fetchData();
  }, [query]);

  const handleAddToCart = async (bookId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/cart/add`,
        {
          bookId,
          quantity: 1,
        },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

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

  return (
    <div className="flex flex-col items-center w-full px-4 md:px-8 py-6">
      <h1 className="font-gothic text-3xl font-bold mb-6 text-center">
        Search Results for "{query}"
      </h1>

      {books.length === 0 ? (
        <p className="text-gray-500 font-parastoo text-lg">No books found.</p>
      ) : (
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-10 px-1 sm:px-2">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                isWishlisted={wishlist.includes(book.id)}
                onWishlistToggle={() => handleWishlistToggle(book.id)}
                onAddToCart={() => handleAddToCart(book.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
