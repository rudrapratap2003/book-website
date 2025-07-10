import { useEffect, useState } from "react";
import axios from "axios";
import { FaCheckCircle, FaShippingFast, FaHourglassHalf, FaTimesCircle } from "react-icons/fa";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returningOrderId, setReturningOrderId] = useState(null);
  const [selectedReturns, setSelectedReturns] = useState({});

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/my-orders`,
        { withCredentials: true }
      );
      setOrders(res.data.data.orders);
    } catch (err) {
      console.error("Error fetching orders:", err);
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
              <div className="flex items-center gap-2 mb-2">
                {statusIcon(order.status)}
                <p className="font-semibold capitalize">{order.status}</p>
              </div>

              {order.books.map((bookItem) => (
                <div key={bookItem._id} className="flex gap-4 items-start mb-3 bg-gray-100">
                  {returningOrderId === order._id && order.books.length > 1 && (
                    <input
                      type="checkbox"
                      className="mt-2"
                      checked={selectedReturns[bookItem._id] || false}
                      onChange={() => handleCheckboxChange(bookItem._id)}
                    />
                  )}
                  <img
                    src={bookItem.book.image}
                    alt={bookItem.book.title}
                    className="w-20 h-28 object-cover rounded"
                  />
                  <div>
                    <p className="font-semibold">{bookItem.book.title}</p>
                    <p className="text-sm text-gray-500">By: {bookItem.book.author}</p>
                    <p className="text-sm mt-1">Quantity: {bookItem.quantity}</p>
                  </div>
                </div>
              ))}

              {order.status === "delivered" && (
                <div className="mt-2">
                  <button
                    onClick={() => handleReturnClick(order._id)}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                  >
                    Return
                  </button>

                  <p className="text-sm text-gray-500 mt-1">
                    Return available till: {new Date(order.returnTill).toLocaleDateString()}
                  </p>

                  <div className="flex gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-gray-400 text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-sm mt-1">Rate & Review</p>
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
