import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCheckCircle,
  FaShippingFast,
  FaHourglassHalf,
  FaTimesCircle,
} from "react-icons/fa";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [returningOrderId, setReturningOrderId] = useState(null);
  const [selectedReturns, setSelectedReturns] = useState({});
  const [ratings, setRatings] = useState({});

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

      const userRatingMap = {};
      ratingRes.data.data.forEach((r) => {
        userRatingMap[r.book] = r.rating; // r.book is the bookId
      });
      setUserRatings(userRatingMap);
    } catch (err) {
      console.error("Error fetching orders or ratings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const statusIcon = (status) => {
    switch (status) {
      case "processing":
        return <FaHourglassHalf className="text-yellow-500" />;
      case "shipped":
        return <FaShippingFast className="text-blue-500" />;
      case "delivered":
        return <FaCheckCircle className="text-green-600" />;
      case "failed":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return null;
    }
  };

  const handleReturnClick = (orderId) => {
    setReturningOrderId(returningOrderId === orderId ? null : orderId);
    setSelectedReturns({});
  };

  const handleCheckboxChange = (bookId) => {
    setSelectedReturns((prev) => ({
      ...prev,
      [bookId]: !prev[bookId],
    }));
  };
  const handleStarClick = async (bookId, ratingValue) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/rating/add`,
        { bookId, rating: ratingValue },
        { withCredentials: true }
      );

      setUserRatings((prev) => ({
        ...prev,
        [bookId]: ratingValue,
      }));
    } catch (err) {
      console.error("Error submitting rating:", err);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold mb-4">All Orders</h2>

      {loading ? (
        <p className="text-gray-600">Loading your orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-600">No orders till now.</p>
      ) : (
        <div className="space-y-6 bg-gray-100 p-6">
          {orders.map((order) => (
            <div key={order._id} className="border rounded-lg p-9 bg-white shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                {statusIcon(order.status)}
                <p className="font-semibold capitalize">{order.status}</p>
              </div>
              {order.books.map((bookItem, idx) => {
                const ratingValue = userRatings[bookItem.book._id] || 0;

                return (
                  <div
                    key={`${order._id}-${bookItem.book._id}-${idx}`}
                    className="flex justify-between items-start mb-4 p-3 bg-gray-100 rounded"
                  >
                    <div className="flex gap-4 items-start">
                      {returningOrderId === order._id &&
                        order.books.length > 1 && (
                          <input
                            type="checkbox"
                            className="mt-2"
                            checked={selectedReturns[bookItem._id] || false}
                            onChange={() => handleCheckboxChange(bookItem._id)}
                          />
                        )}
                      <img

                        src={bookItem.book.bookImage}
                        alt={bookItem.book.title}
                        className="w-20 h-28 object-cover rounded"
                      />
                      <div>
                        <p className="font-semibold">{bookItem.book.title}</p>
                        <p className="text-sm text-gray-500">By: {bookItem.book.author}</p>
                        <p className="text-sm mt-1">Quantity: {bookItem.quantity}</p>
                      </div>
                    </div>

                    {order.status === "delivered" && (
                      <div className="text-right">
                        <p className="text-sm font-medium mb-1">Rate this book:</p>
                        <div className="flex gap-1 justify-end">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              onClick={() => handleStarClick(bookItem.book._id, i + 1)}
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
