import { useState, useEffect } from "react";
import axios from "axios";

const SoldItems = () => {
  const [soldBooks, setSoldBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSoldBooks = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/books/sold-by-user`, {
          withCredentials: true,
        });
        setSoldBooks(response.data.data);
      } catch (error) {
        console.error("Error fetching sold books", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSoldBooks();
  }, []);

  return (
    <div className="p-4 sm:p-8">
      <h1 className="font-gothic text-4xl font-bold mb-6">Books Sold By Me!</h1>

      {loading ? (
        <p className="font-parastoo text-lg text-gray-600">Loading...</p>
      ) : soldBooks.length === 0 ? (
        <p className="font-parastoo text-lg text-gray-600">No books sold yet.</p>
      ) : (
        <div className="space-y-4">
          {soldBooks.map((book) => (
            <div
              key={book._id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between border rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="flex items-start sm:items-center gap-4 w-full sm:w-2/3">
                <img
                  src={book.bookImage}
                  alt={book.bookname}
                  className="w-20 h-28 object-cover rounded-md border"
                />
                <div>
                  <h2 className="font-parastoo font-medium text-xl">
                    {book.bookname}
                  </h2>
                  <p className="font-parastoo text-base text-gray-600">
                    By: {book.author}
                  </p>
                  <p className="font-parastoo text-lg mt-2 font-semibold">
                    ₹{book.price}
                  </p>
                </div>
              </div>

              <div className="mt-4 sm:mt-0 text-sm text-right">
                <p className="font-gothic text-green-600 font-medium">
                  ● Sold on{" "}
                  {new Date(book.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p className="font-parastoo text-base text-gray-600 mt-1">
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      book.status === "approved"
                        ? "text-green-600"
                        : book.status === "pending"
                        ? "text-yellow-600"
                        : book.status === "rejected"
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {book.status}
                  </span>
                </p>
                {book.status === "rejected" && book.rejectionReason && (
                  <p className="font-parastoo text-sm text-red-600 mt-1">
                    Reason: {book.rejectionReason}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SoldItems;
