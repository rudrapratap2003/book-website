import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import api from "../api/axiosInstance";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const [orderRes, ratingRes] = await Promise.all([
        api.get(`/api/v1/users/my-orders`),
        api.get(`/api/v1/rating/my-rating`),
      ]);
      setOrders(orderRes.data.data.orders);

      const ratingMap = {};
      ratingRes.data.data.forEach((r) => (ratingMap[r.book] = r.rating));
      setUserRatings(ratingMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-4xl font-bold mb-6">My Orders</h2>

      {loading ? (
        <p className="text-gray-600">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-600">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className={`p-4 rounded shadow ${
                order.status === "cancelled"
                  ? "bg-red-50 border border-red-300 cursor-default"
                  : "bg-white hover:shadow-lg cursor-pointer"
              }`}
              onClick={() => {
                if (order.status !== "cancelled") {
                  navigate(`/myprofile/orders/${order._id}`);
                }
              }}
            >
              {/* Books List (vertical) */}
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    {/* Book image */}
                    <img
                      src={item.book.bookImage}
                      alt={item.book.title}
                      className="w-24 h-32 object-cover rounded"
                    />

                    {/* Book info */}
                    <div className="flex-1">
                      {/* Book name */}
                      <p className="text-lg">{item.book.bookname}</p>

                      {/* Order status */}
                      {idx === 0 && (
                        <p className="mt-1 text-sm font-medium">
                          Status:{" "}
                          <span
                            className={`${
                              order.status === "delivered"
                                ? "text-green-600"
                                : order.status === "shipped"
                                ? "text-blue-600"
                                : order.status === "processing"
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {order.status}
                          </span>
                        </p>
                      )}

                      {/* Cancelled Order Message */}
                      {idx === 0 && order.status === "cancelled" && (
                        <p className="text-red-600 font-semibold mt-2">
                          Cancelled on:{" "}
                          {new Date(order.updatedAt).toLocaleString()}
                        </p>
                      )}
                    </div>

                    {/* Rating Section (only for delivered orders) */}
                    {order.status === "delivered" && (
                      <div
                        className="flex flex-col items-end"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Rate this product:
                        </p>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => {
                            const currentRating =
                              userRatings[item.book._id] || 0;
                            return (
                              <span
                                key={i}
                                className={`text-xl cursor-pointer ${
                                  i < currentRating
                                    ? "text-yellow-500"
                                    : "text-gray-300"
                                }`}
                                onClick={() => {
                                  const newRating = i + 1;
                                  api
                                    .post(`/api/v1/rating/add`, {
                                      bookId: item.book._id,
                                      rating: newRating,
                                    })
                                    .then(() => {
                                      setUserRatings((prev) => ({
                                        ...prev,
                                        [item.book._id]: newRating,
                                      }));
                                    })
                                    .catch(console.error);
                                }}
                              >
                                ★
                              </span>
                            );
                          })}
                        </div>
                        <FaArrowRight className="mt-2 text-gray-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;