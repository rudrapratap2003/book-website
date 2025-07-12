import { useEffect, useState } from "react";
import axios from "axios";
import { FaCheckCircle } from "react-icons/fa";

/* ─── Progress helper ─────────────────────────── */
const ProgressBar = ({ status }) => {
  const stages = ["placed", "shipped", "delivered"];
  return (
    <div className="flex items-center justify-between mb-4 w-full max-w-full overflow-hidden text-[10px] sm:text-xs md:text-base">
      {stages.map((stage, idx) => {
        const reached = stages.indexOf(status) >= idx;
        return (
          <div
            key={stage}
            className="flex items-center gap-1 md:gap-2 min-w-0 flex-1"
          >
            <div
              className={`w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full shrink-0 ${
                reached ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"
              }`}
            >
              {reached && <FaCheckCircle size={10} className="md:size-[14px]" />}
            </div>
            <span
              className={`truncate ${
                reached ? "font-semibold" : "text-gray-500"
              }`}
            >
              {stage}
            </span>
            {idx < stages.length - 1 && (
              <div
                className={`flex-1 h-0.5 ${
                  stages.indexOf(status) > idx ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};


const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [returningOrderId, setReturningOrderId] = useState(null);
  const [selectedReturns, setSelectedReturns] = useState({});

  const fetchOrders = async () => {
    try {
      const [orderRes, ratingRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/users/my-orders`, {
          withCredentials: true,
        }),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/rating/my-rating`, {
          withCredentials: true,
        }),
      ]);

      setOrders(orderRes.data.data.orders);
      const ratingMap = {};
      ratingRes.data.data.forEach(r => (ratingMap[r.book] = r.rating));
      setUserRatings(ratingMap);
    } catch (err) {
      console.error("Error fetching orders or ratings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const id = setInterval(fetchOrders, 3000);
    return () => clearInterval(id);
  }, []);

  const handleReturnClick = orderId => {
    setReturningOrderId(prev => (prev === orderId ? null : orderId));
    setSelectedReturns({});
  };

  const handleCheckboxChange = bookId =>
    setSelectedReturns(prev => ({ ...prev, [bookId]: !prev[bookId] }));

  const handleStarClick = async (bookId, rating) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/rating/add`,
        { bookId, rating },
        { withCredentials: true }
      );
      setUserRatings(prev => ({ ...prev, [bookId]: rating }));
    } catch (err) {
      console.error("Error submitting rating:", err);
    }
  };

  return (
    <div className="p-3 md:p-4 max-w-4xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">All Orders</h2>

      {loading ? (
        <p className="text-gray-600">Loading your orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-600">No orders till now.</p>
      ) : (
        <div className="space-y-6 bg-gray-100 p-4 md:p-6 rounded">
          {orders.map(order => (
            <div
              key={order._id}
              className="border rounded-lg p-4 md:p-9 bg-white shadow-sm"
            >
              {/* progress bar */}
              <ProgressBar status={order.status} />

              {order.items.map((item, idx) => {
                const { book, quantity } = item;
                const ratingValue = userRatings[book._id] || 0;

                return (
                  <div
                    key={`${order._id}-${book._id}-${idx}`}
                    className="flex flex-col md:flex-row justify-between gap-3 items-start mb-4 p-3 bg-gray-100 rounded"
                  >
                    <div className="flex gap-3 items-start w-full">
                      {returningOrderId === order._id && order.items.length > 1 && (
                        <input
                          type="checkbox"
                          className="mt-1 md:mt-2"
                          checked={selectedReturns[book._id] || false}
                          onChange={() => handleCheckboxChange(book._id)}
                        />
                      )}

                      <img
                        src={book.bookImage}
                        alt={book.title}
                        className="w-16 h-24 md:w-20 md:h-28 object-cover rounded"
                      />

                      <div className="flex-1">
                        <p className="font-semibold">{book.title}</p>
                        <p className="text-sm text-gray-500">By: {book.author}</p>
                        <p className="text-sm mt-1">Quantity: {quantity}</p>
                      </div>
                    </div>

                    {order.status === "delivered" && (
                      <div className="w-full md:w-auto text-right mt-2 md:mt-0">
                        <p className="text-sm font-medium mb-1">Rate this book:</p>
                        <div className="flex gap-1 justify-end">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              onClick={() => handleStarClick(book._id, i + 1)}
                              className={`text-xl cursor-pointer ${
                                i < ratingValue ? "text-yellow-500" : "text-gray-400"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {order.status === "delivered" && (
                <div className="mt-2">
                  <button
                    onClick={() => handleReturnClick(order._id)}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                  >
                    Return
                  </button>
                  <p className="text-sm text-gray-500 mt-1">
                    Return available till:{" "}
                    {new Date(order.returnTill).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
