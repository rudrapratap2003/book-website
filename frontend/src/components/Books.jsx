import { Link, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import BookCard from "../components/BookCard";
import api from "../api/axiosInstance.js";

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

const Books = () => {
  const { pathname } = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [book, setBook] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [averageRatings, setAverageRatings] = useState({});
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const path = pathname.split("/category/")[1];
    setSelectedCategory(path || "");
  }, [pathname]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get(`/api/v1/books/get-books`);
        setBook(res.data);
      } catch (err) {
        console.error("Error fetching books:", err);
      }
    };

    const fetchWishlist = async () => {
      try {
        const res = await api.get(`/api/v1/users/wishlist`);
        setWishlist(res.data.data.map((book) => book._id));
      } catch (err) {
        console.error("Error fetching wishlist:", err);
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
        console.error("Error fetching average ratings:", err);
      }
    };

    fetchBooks();
    fetchWishlist();
    fetchAverageRatings();
  }, []);

  const handleCategoryScroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollAmount = 300;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleAddToCart = async (bookId) => {
    try {
      await api.post(
        `/api/v1/cart/add`,
        { bookId, quantity: 1 }
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

  const books = book.map((b, index) => ({
    ...b,
    id: b._id || index,
    title: b.bookname || "Untitled",
    author: b.author || "Unknown",
    image: b.bookImage,
    rating: averageRatings[b._id] || 0, // ✅ Inject average rating here
    price: b.price || 0,
    originalPrice: b.originalPrice || null,
    description: b.description || "",
  }));

  return (
    <div className="flex flex-col items-center w-full px-4 md:px-8 py-6">
      <div className="font-gothic text-3xl font-bold mb-6 text-center">Shop By Category</div>

      {/* Category Scroller */}
      <div className="relative w-full max-w-7xl mb-10 flex items-center justify-center">
        <button
          onClick={() => handleCategoryScroll("left")}
          className="absolute left-0 z-10 bg-white text-gray-400 hover:text-black rounded-full p-1 shadow-md"
        >
          <span className="text-3xl">&lsaquo;</span>
        </button>

        <div
          ref={scrollContainerRef}
          className="flex gap-6 px-12 py-2 overflow-x-auto scrollbar-hide scroll-smooth"
        >
          {categories.map((cat) => (
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
      <div className="w-full max-w-7xl px-2 sm:px-4">
        <h2 className="font-gothic text-2xl font-bold mb-4 capitalize">Books</h2>

        {books.length === 0 ? (
          <p className="text-gray-500 text-sm text-center">No books available.</p>
        ) : (
          <div className="w-full flex justify-center">
            <div
              className="
                grid 
                gap-4 
                sm:gap-6 
                md:gap-8 
                xl:gap-10 
                justify-center
                grid-cols-1
                sm:grid-cols-2
                md:grid-cols-3
                lg:grid-cols-4
                xl:grid-cols-5
              "
            >
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  rating={book.rating}
                  isWishlisted={wishlist.includes(book.id)}
                  onWishlistToggle={handleWishlistToggle}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;