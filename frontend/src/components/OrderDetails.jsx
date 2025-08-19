import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import Loader from "./Loader";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  const [modalData, setModalData] = useState({
    show: false,
    title: "",
    action: null,
    actionLabel: "",
    cancelLabel: "Cancel",
    actionColor: "bg-blue-500",
  });

  // 🔄 Fetch order helper
  const fetchOrder = async () => {
    try {
      const { data } = await api.get(`/api/v1/users/my-orders`);
      const orders = data.data.orders;
      const foundOrder = orders.find((o) => o._id === id);
      setOrder(foundOrder);
    } catch (error) {
      console.error("Error fetching order", error);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // 🔄 Polling if return in progress
  useEffect(() => {
    if (!order) return;
    let intervalId;
    if (order.returnInitiatedAt && !order.refundCompletedAt) {
      intervalId = setInterval(fetchOrder, 10000); // 10s
    }
    return () => clearInterval(intervalId);
  }, [order]);

  const handleCancelOrder = async () => {
    try {
      await api.post(`/api/v1/users/cancel-order/${id}`);
      closeModal();
      navigate("/myprofile/orders", { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  const handleReturnOrder = async () => {
    try {
      await api.post(`/api/v1/users/return-order/${id}`);
      closeModal();
      fetchOrder();
    } catch (error) {
      console.error(error);
    }
  };

  const closeModal = () =>
    setModalData((prev) => ({
      ...prev,
      show: false,
    }));

  if (!order) return <Loader />;

  // 🚚 Shipping steps
  const steps = [
    { key: "placed", label: "Order Placed", time: order.placedAt },
    { key: "shipped", label: "Shipped", time: order.shippedAt },
    { key: "delivered", label: "Delivered", time: order.deliveredAt },
  ];

  // 🔄 Return steps
  const returnSteps = [
    { key: "return_initiated", label: "Return Initiated", time: order.returnInitiatedAt },
    { key: "product_received", label: "Product Received", time: order.productReceivedAt },
    { key: "refund_completed", label: "Refund Completed", time: order.refundCompletedAt },
  ];

  // ⏳ Return deadline
  const returnDeadline = order.deliveredAt
    ? new Date(new Date(order.deliveredAt).getTime() + 7 * 24 * 60 * 60 * 1000)
    : null;
  const isReturnAvailable = returnDeadline ? new Date() <= returnDeadline : false;

  const showReturnFlow = order.returnInitiatedAt;

  return (
    <div className="flex justify-center px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
        
        {/* 🛒 Books */}
        {order.items.map((item, idx) => (
          <div key={idx} className="mb-6 border-b pb-4">
            <div className="flex items-start justify-between">
              <div className="w-2/3">
                <p className="font-semibold text-lg">{item.book.bookname}</p>
                <p className="text-gray-600">Author: {item.book.author}</p>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
                <p className="text-gray-800 font-medium">Price: ₹{item.book.price}</p>
              </div>
              <div className="w-1/3 flex justify-end">
                <img
                  src={item.book.bookImage || "/placeholder.jpg"}
                  alt={item.book.bookname}
                  className="w-32 h-40 object-cover rounded-md border"
                />
              </div>
            </div>
          </div>
        ))}

        {/* 📦 Progress Bar (once per order) */}
        <div className="relative ml-4 mt-8">
          <h3 className="font-semibold mb-4">
            {showReturnFlow ? "Return Progress" : "Order Progress"}
          </h3>
          <div className="absolute top-0 left-2 w-0.5 h-full bg-gray-300"></div>
          {(showReturnFlow ? returnSteps : steps).map((step, index) => (
            <div key={index} className="relative flex items-start mb-8">
              <div
                className={`w-6 h-6 flex items-center justify-center rounded-full border-2 z-10 ${
                  step.time
                    ? showReturnFlow
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "bg-green-500 border-green-500 text-white"
                    : "bg-gray-200 border-gray-400 text-gray-400"
                }`}
              >
                {step.time ? "✓" : ""}
              </div>
              <div className="ml-4">
                <p
                  className={`font-medium ${
                    step.time
                      ? showReturnFlow
                        ? "text-blue-600"
                        : "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {step.label}
                </p>
                {step.time && (
                  <p className="text-sm text-gray-400">
                    {new Date(step.time).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 💰 Total */}
        <div className="mt-6 border-t pt-4 text-right">
          <p className="text-lg font-semibold">
            Total Amount: <span className="text-orange-400">₹{order.totalAmount}</span>
          </p>
        </div>

        {/* 🚨 Buttons (per order, not per item) */}
        <div className="mt-6 flex gap-4">
          {(order.status === "placed" || order.status === "shipped") && (
            <button
              onClick={() =>
                setModalData({
                  show: true,
                  title: "Are you sure you want to cancel this order?",
                  action: handleCancelOrder,
                  actionLabel: "Yes, Cancel",
                  cancelLabel: "No",
                  actionColor: "bg-red-500",
                })
              }
              className="bg-red-400 text-white px-3 py-1 rounded-md"
            >
              Cancel
            </button>
          )}

          {order.status === "delivered" && isReturnAvailable && !order.returnInitiatedAt && (
            <div>
              <button
                onClick={() =>
                  setModalData({
                    show: true,
                    title: "Are you sure you want to initiate return?",
                    action: handleReturnOrder,
                    actionLabel: "Confirm",
                    cancelLabel: "Cancel",
                    actionColor: "bg-blue-500",
                  })
                }
                className="text-lg text-white bg-blue-400 px-3 py-1 rounded-md"
              >
                Return
              </button>
              <p className="mt-2 ml-1 text-sm text-gray-500 mb-1">
                Return available till: {returnDeadline.toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* 🪟 Modal */}
        {modalData.show && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <p className="text-lg font-medium mb-4">{modalData.title}</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded-md"
                >
                  {modalData.cancelLabel}
                </button>
                <button
                  onClick={modalData.action}
                  className={`px-4 py-2 text-white rounded-md ${modalData.actionColor}`}
                >
                  {modalData.actionLabel}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;