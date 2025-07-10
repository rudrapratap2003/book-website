import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../components/BookCard"; // Adjust path if needed

const categories = [
  { label: "Best Seller", icon: "/images/best-seller.png", path: "best-seller" },
  { label: "Award Winners", icon: "/images/award-winner.png", path: "award-winners" },
  { label: "Box Sets", icon: "/images/box-set.png", path: "box-sets" },
  { label: "International Best Seller", icon: "/images/int-best.png", path: "international" },
  { label: "New Arrivals", icon: "/images/new-arr.png", path: "new-arrivals" },
  { label: "Fictions Books", icon: "/images/fict.png", path: "fiction" },
  { label: "Children Books", icon: "/images/child.png", path: "children" },
  { label: "Comic Books", icon: "/images/comic.png", path: "comics" },
  { label: "Tarot Cards", icon: "/images/tarot.png", path: "tarot" },
  { label: "Literature", icon: "/images/literature.jpg", path: "literature" },
  { label: "Encyclopedia", icon: "/images/encyclopedia.jpg", path: "encyclopedia" },
  { label: "History", icon: "/images/history.jpg", path: "history" },
  { label: "Social Science", icon: "/images/social-science.jpg", path: "socialscience" },
  { label: "Business", icon: "/images/business.jpg", path: "business" },
  { label: "Law", icon: "/images/law.jpg", path: "law" },
  { label: "Medicine", icon: "/images/medicine.jpg", path: "medicine" },
  { label: "Science", icon: "/images/science.jpg", path: "science" },
  { label: "Mathematics", icon: "/images/math.jpg", path: "mathematics" },
  { label: "Environment", icon: "/images/environment.jpg", path: "environment" },
  { label: "Engineering", icon: "/images/engineering.jpg", path: "engineering" },
  { label: "Computer Science", icon: "/images/computer.jpg", path: "computerscience" },
  { label: "Family", icon: "/images/family.jpg", path: "family" },
  { label: "Cooking", icon: "/images/cooking.jpg", path: "cooking" },
  { label: "Mystery", icon: "/images/mystery.jpg", path: "mystery" },
  { label: "Horror", icon: "/images/horror.jpg", path: "horrorscience" },
  { label: "Romantic", icon: "/images/romance.jpg", path: "romantic" },
];

const Buy = () => {
  const { pathname } = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [startIndex, setStartIndex] = useState(0);
  const [book, setBook] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const categoriesPerPage = 5;

  useEffect(() => {
    const path = pathname.split("/category/")[1];
    setSelectedCategory(path || "");
  }, [pathname]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/books/get-books`, { withCredentials: true });
        setBook(res.data);
      } catch (err) {
        console.error("Error fetching books:", err);
      }
    };
    fetchBooks();
  }, []);

  const handleCategoryScroll = (direction) => {
    if (direction === "left") {
      setStartIndex((prev) => Math.max(prev - categoriesPerPage, 0));
    } else if (direction === "right") {
      setStartIndex((prev) =>
        Math.min(prev + categoriesPerPage, categories.length - categoriesPerPage)
      );
    }
  };

  const visibleCategories = categories.slice(startIndex, startIndex + categoriesPerPage);

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

  const books = book.map((b, index) => ({
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
    <div className="flex flex-col items-center w-full px-4 md:px-8 py-6">
      <div className="font-gothic text-3xl font-bold mb-6 text-center">Shop By Category</div>

      {/* Category Scroller */}
      <div className="relative w-full max-w-6xl mb-10 flex items-center justify-center">
        <button
          onClick={() => handleCategoryScroll("left")}
          className="absolute left-0 z-10 bg-white text-gray-400 hover:text-black rounded-full p-1 shadow-md"
        >
          <span className="text-3xl">&lsaquo;</span>
        </button>

        <div className="flex gap-6 px-12 py-2 overflow-x-auto scrollbar-hide">
          {visibleCategories.map((cat) => (
            <Link
              key={cat.label}
              to={`/category/${cat.path}`}
              className={`flex flex-col items-center w-24 flex-shrink-0 cursor-pointer 
                ${selectedCategory === cat.path ? "text-[#7b66b4] font-semibold" : "text-black"}`}
            >
              <img src={cat.icon} alt={cat.label} className="w-10 h-10 mb-1" />
              <span className="text-sm text-center">{cat.label}</span>
            </Link>
          ))}
        </div>

        <button
          onClick={() => handleCategoryScroll("right")}
          className="absolute right-0 z-10 bg-white text-gray-400 hover:text-black rounded-full p-1 shadow-md"
        >
          <span className="text-3xl">&rsaquo;</span>
        </button>
      </div>

      {/* Book Cards */}
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <h2 className="font-gothic text-2xl font-bold mb-4 capitalize">Books</h2>

        {books.length === 0 ? (
          <p className="text-gray-500 text-sm text-center">No books available.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-10 px-1 sm:px-2">
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
    </div>
  );
};

export default Buy;
