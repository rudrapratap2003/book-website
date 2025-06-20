import React from "react";

const books = [
  {
    id: 1,
    title: "A Court of Thorns and Roses Paperback Box Set (5 books)",
    author: "Sarah J. Maas",
    price: "₹4,235",
    originalPrice: "₹5,500",
    image: "/images/book1.png",
    rating: 5,
  },
  {
    id: 2,
    title: "Harry Potter Box Set (7 Books)",
    author: "J.K. Rowling",
    price: "₹6,999",
    originalPrice: "₹8,499",
    image: "/images/book2.png",
    rating: 5,
  },
];

const Exchange = () => {
  return (
    <div className="p-8 bg-orange-50 flex flex-col items-center">
      {/* Exchange Header Section */}
      <div className="bg-white bg-opacity-90 p-8 rounded-3xl shadow-lg w-full">
        <div className="w-full flex justify-between items-center">
          <div className="w-1/2 pr-6">
            <h3 className="text-5xl font-bold mb-4">Exchange your books with used titles</h3>
            <p className="text-3xl font-semibold mb-2">Give your books countless lives !!</p>
            <p className="text-xl italic">Exchange any book with any book here and pay only for shipping.</p>
          </div>
          <div className="w-1/2 flex justify-center items-center">
            <img src="/src/images/exch1.png" alt="Books Exchange" className="object-cover" />
          </div>
        </div>
      </div>

      {/* Books Available for Exchange */}
      <h2 className="text-4xl font-bold mt-10 mb-6 text-gray-800">Books Available for Exchange</h2>
      <div className="grid grid-cols-2 gap-8">
        {books.map((book) => (
          <div key={book.id} className="bg-white p-4 rounded-lg shadow-lg text-center w-80">
            <img src={book.image} alt={book.title} className="w-full h-48 object-cover mb-4 rounded-lg" />
            <h3 className="text-lg font-semibold">{book.title}</h3>
            <p className="text-gray-600">{book.author}</p>
            <div className="flex justify-center mt-2">
              {Array(book.rating).fill().map((_, i) => (
                <span key={i} className="text-yellow-500 text-xl">★</span>
              ))}
            </div>
            <div className="mt-2">
              <span className="text-red-600 text-xl font-bold">{book.price}</span>
              <span className="text-gray-500 line-through ml-2">{book.originalPrice}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Exchange;
