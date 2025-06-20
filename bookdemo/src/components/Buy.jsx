import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const categories = [
  { label: "Best Seller", icon: "/src/images/best-seller.png", path: "best-seller" },
  { label: "Award Winners", icon: "/src/images/award-winner.png", path: "award-winners" },
  { label: "Box Sets", icon: "/src/images/box-set.png", path: "box-sets" },
  { label: "International Best Seller", icon: "/src/images/int-best.png", path: "international" },
  { label: "New Arrivals", icon: "/src/images/new-arr.png", path: "new-arrivals" },
  { label: "Fictions Books", icon: "/src/images/fict.png", path: "fiction" },
  { label: "Children Books", icon: "/src/images/child.png", path: "children" },
  { label: "Comic Books", icon: "/src/images/comic.png", path: "comics" },
  { label: "Tarot Cards", icon: "/src/images/tarot.png", path: "tarot" },
];

const books = [
  {
    id: 1,
    title: "Satanic Verses",
    author: "Salman Rushdie",
    price: 1454,
    oldPrice: 1615,
    discount: "10%",
    rating: 4,
    image: "/src/images/holes.jpg",
  },
  {
    id: 2,
    title: "White Nights",
    author: "Ronald Meyer",
    price: 90,
    oldPrice: 150,
    discount: "40%",
    rating: 4,
    image: "/src/images/white-nights.jpg",
  },
  {
    id: 3,
    title: "New Rules of War",
    author: "Sean McFate",
    price: 936,
    oldPrice: 1672,
    discount: "44%",
    rating: 3,
    image: "/src/images/new-war.jpg",
  },
  {
    id: 4,
    title: "The Drone Age",
    author: "Michael J Boyle",
    price: 2304,
    oldPrice: 2992,
    discount: "23%",
    rating: 2,
    image: "/src/images/drone-age.jpg",
  },
  {
    id: 5,
    title: "Military Blunders",
    author: "Saul David",
    price: 926,
    oldPrice: 1544,
    discount: "40%",
    rating: 0,
    image: "/src/images/book5.jpg",
  },
];

const internationalBooks = [
  {
    id: 1,
    title: "The Satanic Verses",
    author: "Salman Rushdie",
    price: 1350,
    oldPrice: null,
    discount: "40%",
    rating: 5,
    image: "/src/images/holes.jpg",
  },
  {
    id: 2,
    title: "White Nights",
    author: "Ronald Meyer",
    price: 90,
    oldPrice: 150,
    discount: "40%",
    rating: 4,
    image: "/src/images/white-nights.jpg",
  },
  {
    id: 3,
    title: "Satanic Verses",
    author: "Salman Rushdie",
    price: 1454,
    oldPrice: 1615,
    discount: "10%",
    rating: 4,
    image: "/src/images/holes.jpg",
  },
];

const awardWinnersBooks = [
  {
    id: 1,
    title: "The Night Watchman",
    author: "Louise Erdrich",
    price: 999,
    oldPrice: 1249,
    discount: "20%",
    rating: 5,
    image: "/src/images/night.jpg",
  },
  {
    id: 2,
    title: "The Overstory",
    author: "Richard Powers",
    price: 850,
    oldPrice: 1000,
    discount: "15%",
    rating: 4,
    image: "/src/images/overstory.jpg",
  },
  {
    id: 3,
    title: "The Testaments",
    author: "Margaret Atwood",
    price: 780,
    oldPrice: 950,
    discount: "18%",
    rating: 4,
    image: "/src/images/testaments.jpg",
  },
];

const Buy = () => {
  const { pathname } = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("");
  const scrollRef = useRef(null);
  const bookScrollRef = useRef(null);
  const intBookScrollRef = useRef(null);
  const awardBookScrollRef = useRef(null);

  useEffect(() => {
    const path = pathname.split("/category/")[1];
    setSelectedCategory(path || "");
  }, [pathname]);

  const scroll = (offset, ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col items-center w-full px-4 md:px-8 py-6">
      {/* Category Scroll Section */}
      <div className="relative w-full max-w-6xl mb-10">
        <button
          onClick={() => scroll(-200, scrollRef)}
          className="absolute left-0 z-10 bg-white text-gray-400 hover:text-black rounded-full p-1 shadow-md"
        >
          <span className="text-3xl">&lsaquo;</span>
        </button>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth px-12 py-2 scrollbar-hide"
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
          onClick={() => scroll(200, scrollRef)}
          className="absolute right-0 z-10 bg-white text-gray-400 hover:text-black rounded-full p-1 shadow-md"
        >
          <span className="text-3xl">&rsaquo;</span>
        </button>
      </div>

      {/* Now Trending Section */}
      <div className="w-full max-w-6xl">
        <h2 className="text-2xl font-bold mb-4">Now Trending</h2>
        <div className="relative">
          <button
            onClick={() => scroll(-300, bookScrollRef)}
            className="absolute top-1/3 left-0 z-10 bg-white text-gray-400 hover:text-black rounded-full p-2 shadow-md"
          >
            <span className="text-3xl">&lsaquo;</span>
          </button>

          <div
            ref={bookScrollRef}
            className="flex justify-center overflow-x-auto gap-6 px-12 py-4 scrollbar-hide scroll-smooth"
          >
            {books.map((book) => (
              <div key={book.id} className="w-40 flex-shrink-0 text-center relative">
                <img src={book.image} alt={book.title} className="h-48 object-cover mx-auto rounded-md" />
                <div className="absolute top-0 right-0 bg-red-600 text-white text-xs px-2 py-1 rounded-bl-md">
                  {book.discount}
                </div>
                <h4 className="font-semibold mt-2 text-sm">{book.title}</h4>
                <p className="text-xs text-gray-500">{book.author}</p>
                <div className="text-yellow-400 text-sm">
                  {"★".repeat(book.rating) + "☆".repeat(5 - book.rating)}
                </div>
                <div className="text-red-600 font-bold text-sm">₹{book.price}</div>
                <div className="text-xs line-through text-gray-500">₹{book.oldPrice}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll(300, bookScrollRef)}
            className="absolute top-1/3 right-0 z-10 bg-white text-gray-400 hover:text-black rounded-full p-2 shadow-md"
          >
            <span className="text-3xl">&rsaquo;</span>
          </button>
        </div>
      </div>

      {/* International Bestseller Section */}
      <div className="w-full max-w-6xl mt-12">
        <h2 className="text-2xl font-bold mb-4">International Bestseller</h2>
        <div className="relative">
          <button
            onClick={() => scroll(-300, intBookScrollRef)}
            className="absolute top-1/3 left-0 z-10 bg-white text-gray-400 hover:text-black rounded-full p-2 shadow-md"
          >
            <span className="text-3xl">&lsaquo;</span>
          </button>

          <div
            ref={intBookScrollRef}
            className="flex justify-center overflow-x-auto gap-6 px-12 py-4 scrollbar-hide scroll-smooth"
          >
            {internationalBooks.map((book) => (
              <div key={book.id} className="w-40 flex-shrink-0 text-center relative">
                <img src={book.image} alt={book.title} className="h-48 object-cover mx-auto rounded-md" />
                <div className="absolute top-0 right-0 bg-red-600 text-white text-xs px-2 py-1 rounded-bl-md">
                  {book.discount}
                </div>
                <h4 className="font-semibold mt-2 text-sm">{book.title}</h4>
                <p className="text-xs text-gray-500">{book.author}</p>
                <div className="text-yellow-400 text-sm">
                  {"★".repeat(book.rating) + "☆".repeat(5 - book.rating)}
                </div>
                <div className="text-red-600 font-bold text-sm">₹{book.price}</div>
                {book.oldPrice && (
                  <div className="text-xs line-through text-gray-500">₹{book.oldPrice}</div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll(300, intBookScrollRef)}
            className="absolute top-1/3 right-0 z-10 bg-white text-gray-400 hover:text-black rounded-full p-2 shadow-md"
          >
            <span className="text-3xl">&rsaquo;</span>
          </button>
        </div>
      </div>

      {/* Award Winners Section */}
      <div className="w-full max-w-6xl mt-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Award Winners</h2>
          <Link to="/category/award-winners" className="text-sm text-blue-500 hover:underline">
            See All
          </Link>
        </div>
        <div className="relative">
          <button
            onClick={() => scroll(-300, awardBookScrollRef)}
            className="absolute top-1/3 left-0 z-10 bg-white text-gray-400 hover:text-black rounded-full p-2 shadow-md"
          >
            <span className="text-3xl">&lsaquo;</span>
          </button>

          <div
            ref={awardBookScrollRef}
            className="flex justify-center overflow-x-auto gap-6 px-12 py-4 scrollbar-hide scroll-smooth"
          >
            {awardWinnersBooks.map((book) => (
              <div key={book.id} className="w-40 flex-shrink-0 text-center relative">
                <img src={book.image} alt={book.title} className="h-48 object-cover mx-auto rounded-md" />
                <div className="absolute top-0 right-0 bg-red-600 text-white text-xs px-2 py-1 rounded-bl-md">
                  {book.discount}
                </div>
                <h4 className="font-semibold mt-2 text-sm">{book.title}</h4>
                <p className="text-xs text-gray-500">{book.author}</p>
                <div className="text-yellow-400 text-sm">
                  {"★".repeat(book.rating) + "☆".repeat(5 - book.rating)}
                </div>
                <div className="text-red-600 font-bold text-sm">₹{book.price}</div>
                <div className="text-xs line-through text-gray-500">₹{book.oldPrice}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll(300, awardBookScrollRef)}
            className="absolute top-1/3 right-0 z-10 bg-white text-gray-400 hover:text-black rounded-full p-2 shadow-md"
          >
            <span className="text-3xl">&rsaquo;</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Buy;
