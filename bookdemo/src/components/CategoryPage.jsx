import { useParams } from "react-router-dom";
import { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const booksData = {
  "art-photography": [
    {
      id: 1,
      title: "The Art Book",
      author: "Phaidon Press",
      image: "/images/artbook.jpg",
      rating: 4,
      price: 1200,
      originalPrice: 1500,
      description: "A comprehensive guide to art history.",
      releaseDate: "2021",
    },
  ],
  fiction: [
    {
      id: 2,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      image: "/src/images/gatsby.jpg",
      rating: 5,
      price: 499,
      originalPrice: 699,
      description: "The Great Gatsby is a timeless novel by F. Scott Fitzgerald that explores themes of love, wealth, and the American Dream. Set in the Roaring Twenties, the story follows Jay Gatsby, a mysterious millionaire who throws extravagant parties in hopes of rekindling his past romance with Daisy Buchanan. Narrated by Nick Carraway, the novel paints a vivid picture of the Jazz Age’s glamour and excess while exposing the emptiness and corruption beneath its surface. With its beautifully crafted prose and unforgettable characters, The Great Gatsby remains a powerful critique of ambition, social class, and the pursuit of an unattainable dream.",
      releaseDate: "1925",
    },
  ],
};

export const CategoryPage = () => {
  const { categoryName } = useParams();
  const [selectedBook, setSelectedBook] = useState(null);

  const formattedCategory = categoryName.toLowerCase().replace(/\s+/g, "-");
  const books = booksData[formattedCategory] || [];

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
              ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
              : 0;

            return (
              <div key={book.id} className="relative p-4 rounded-lg border border-gray-200 shadow-md bg-white w-60">
                {/* Discount Badge */}
                {discount > 0 && (
                  <div className="absolute top-0 left-0 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
                    {discount}% OFF
                  </div>
                )}

                {/* Book Image & Quick View */}
                <div className="relative">
                  <img 
                    src={book.image} 
                    alt={book.title} 
                    className="w-full h-60 object-cover rounded-lg" 
                    onError={(e) => { e.target.src = "/images/placeholder.jpg"; }} // Fallback image
                  />
                  <button
                    className="absolute bottom-0 left-0 w-full bg-white text-orange-500 border border-orange-500 font-semibold py-1 opacity-90 hover:opacity-100 transition-all"
                    onClick={() => setSelectedBook(book)}
                  >
                    QUICK VIEW
                  </button>
                </div>

                {/* Book Details */}
                <div className="text-lg font-semibold mt-2 text-gray-800">{book.title}</div>
                <div className="text-sm text-gray-600">{book.author}</div>

                {/* Rating */}
                <div className="flex justify-center my-1">
                  {Array.from({ length: 5 }, (_, index) =>
                    index < book.rating ? <FaStar key={index} className="text-yellow-500" /> : <FaRegStar key={index} className="text-gray-400" />
                  )}
                </div>

                {/* Pricing */}
                <div className="text-red-600 font-bold text-lg">₹{book.price}</div>
                {book.originalPrice && <div className="text-gray-400 line-through text-sm">₹{book.originalPrice}</div>}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Quick View */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] max-w-full relative flex gap-4">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl"
              onClick={() => setSelectedBook(null)}
            >
              <IoClose />
            </button>

            {/* Image Section */}
            <div className="w-1/3">
              <img src={selectedBook.image} alt={selectedBook.title} className="w-full h-auto object-cover rounded-lg" />
            </div>

            {/* Book Details Section */}
            <div className="w-2/3 space-y-2">
              <h2 className="text-xl font-bold">{selectedBook.title}</h2>
              <p className="text-gray-600">By: {selectedBook.author}</p>

              {/* Rating */}
              <div className="flex">
                {Array.from({ length: 5 }, (_, index) =>
                  index < selectedBook.rating ? <FaStar key={index} className="text-yellow-500" /> : <FaRegStar key={index} className="text-gray-400" />
                )}
              </div>

              {/* Pricing */}
              <div className="flex items-center gap-2">
                <span className="text-red-600 font-bold text-lg">₹{selectedBook.price}</span>
                {selectedBook.originalPrice && (
                  <span className="text-gray-400 line-through text-sm">₹{selectedBook.originalPrice}</span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-700 text-sm">{selectedBook.description}</p>

              {/* Buttons */}
              <div className="flex gap-2 mt-4">
                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
                  Add To Cart
                </button>
                <button className="border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-white transition">
                  View Product Detail
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
