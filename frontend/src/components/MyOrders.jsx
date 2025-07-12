import { useEffect, useState } from "react";
import axios from "axios";
import { FaCheckCircle } from "react-icons/fa";

/* ─── Progress helper ─────────────────────────── */
const ProgressBar = ({ status }) => {
  const stages = ["placed", "shipped", "delivered"];
  return (
    <div className="flex items-center gap-3 mb-4">
      {stages.map((stage, idx) => {
        const reached = stages.indexOf(status) >= idx;
        return (
          <div key={stage} className="flex items-center gap-2">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                reached ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"
              }`}
            >
              {reached && <FaCheckCircle size={14} />}
            </div>
            <span className={`text-sm ${reached ? "font-semibold" : "text-gray-500"}`}>
              {stage}
            </span>
            {idx < stages.length - 1 && (
              <div
                className={`w-10 h-0.5 ${
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
  const [ratings, setRatings] = useState({});

  /* ─── Fetch orders + ratings ─────────────────── */
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

  /* initial load + 3‑second polling for live updates */
  useEffect(() => {
    fetchOrders();
    const id = setInterval(fetchOrders, 3_000);
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

  /* ─── JSX ─────────────────────────────────────── */
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold mb-4">All Orders</h2>

      {loading ? (
        <p className="text-gray-600">Loading your orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-600">No orders till now.</p>
      ) : (
        <div className="space-y-6 bg-gray-100 p-6">
          {orders.map(order => (
            <div key={order._id} className="border rounded-lg p-9 bg-white shadow-sm">

              {/* progress bar */}
              <ProgressBar status={order.status} />

              {order.items.map((item, idx) => {
                const { book, quantity } = item;
                const ratingValue = userRatings[book._id] || 0;

                return (
                  <div
                    key={`${order._id}-${book._id}-${idx}`}
                    className="flex justify-between items-start mb-4 p-3 bg-gray-100 rounded"
                  >
                    <div className="flex gap-4 items-start">
                      {returningOrderId === order._id && order.items.length > 1 && (
                        <input
                          type="checkbox"
                          className="mt-2"
                          checked={selectedReturns[book._id] || false}
                          onChange={() => handleCheckboxChange(book._id)}
                        />
                      )}

                      <img

                        src={book.bookImage}
                        alt={book.title}
                        className="w-20 h-28 object-cover rounded"
                      />

                      <div>
                        <p className="font-semibold">{book.title}</p>
                        <p className="text-sm text-gray-500">By: {book.author}</p>
                        <p className="text-sm mt-1">Quantity: {quantity}</p>
                      </div>
                    </div>

                    {order.status === "delivered" && (
                      <div className="text-right">
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
