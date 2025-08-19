import { useEffect, useState } from "react";
import api from "../api/axiosInstance.js";
import Loader from "./Loader.jsx";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get(`/api/v1/cart`);
        const itemsWithSelection = res.data.data.cartItems.map((item) => ({
          ...item,
          selected: false,
        }));
        setCartItems(itemsWithSelection);
      } catch (error) {
        console.error(error.response?.status, error.response?.data);
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleSelect = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleAddToCart = async (bookId, quantity) => {
    try {
      await api.post(
        `/api/v1/cart/add`,
        { bookId, quantity: parseInt(quantity) }
      );

      setCartItems((prev) =>
        prev.map((item) =>
          item.book._id === bookId
            ? { ...item, quantity: parseInt(quantity) }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleRemoveSelected = async () => {
    const selectedIds = cartItems
      .filter((item) => item.selected)
      .map((item) => item._id);
    try {
      await api.post(
        `/api/v1/cart/remove`,
        { ids: selectedIds }
      );
      setCartItems((prev) => prev.filter((item) => !item.selected));
    } catch (error) {
      console.error("Error removing items:", error);
    }
  };

const handlePlaceOrder = (e) => {
    e.preventDefault()
    const selectedItems = cartItems.filter((item) => item.selected);

    if (selectedItems.length === 0) {
      alert("Please select at least one item to place an order.");
      return;
    }

    // Store cart items in sessionStorage for the address page
    sessionStorage.removeItem("buyBook");
    sessionStorage.setItem("buyBooks", JSON.stringify(selectedItems));

    // Navigate to address page (cart checkout flow)
    navigate(`/buy/address?fromCart=true`, { state: { allow: true, books: selectedItems, totalAmount: totalAmount} });
  };

  const selectedItems = cartItems.filter((item) => item.selected);
  const totalAmount = selectedItems.reduce(
    (total, item) => total + item.book.price * item.quantity,
    0
  );

  return (
    <div className="p-4 md:flex gap-6 flex-col md:flex-row">
      {/* Left Section */}
      <div className="md:w-2/3 w-full">
        <h2 className="font-gothic text-4xl font-bold mb-4">My Cart</h2>

        {loading ? (
          <Loader/>
        ) : cartItems.length === 0 ? (
          <p className="font-parastoo text-lg text-gray-600">
            Your cart is empty now.
          </p>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={
                    selectedItems.length > 0 &&
                    selectedItems.length === cartItems.filter(item => item.book.count > 0).length
                  }
                  onChange={(e) =>
                    setCartItems((prev) =>
                      prev.map((item) => ({
                        ...item,
                        selected: item.book.count > 0 ? e.target.checked : false,
                      }))
                    )
                  }
                />
                <span className="font-gothic text-base font-semibold">
                  {selectedItems.length}/
                  {cartItems.filter((item) => item.book.count > 0).length} ITEMS SELECTED
                </span>
              </div>
              <button
                onClick={handleRemoveSelected}
                className="font-gothic font-medium text-red-500 "
              >
                REMOVE
              </button>
            </div>

            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex gap-4 border p-3 rounded-lg mb-4 items-start bg-white"
              >
                <input
                  type="checkbox"
                  disabled={item.book.count === 0}
                  checked={item.selected || false}
                  onChange={() => handleSelect(item._id)}
                  className="mt-2"
                />

                {item.book.image && (
                  <img
                    src={item.book.image}
                    alt={item.book.bookname}
                    className="w-24 h-32 object-cover rounded"
                  />
                )}

                <div className="flex-1">
                  <p className="font-parastoo text-xl font-semibold">
                    {item.book.bookname}
                  </p>
                  <p className="font-parastoo text-lg text-gray-500">
                    By: {item.book.author}
                  </p>

                  {item.book.count > 0 ? (
                    <div className="font-parastoo flex gap-4 items-center mt-2 text-base">
                      <label>
                        Qty:
                        <select
                          value={item.quantity}
                          onChange={(e) =>
                            handleAddToCart(item.book._id, e.target.value)
                          }
                          className="ml-2 border px-2 py-1 rounded"
                        >
                          {Array.from(
                            { length: item.book.count },
                            (_, i) => i + 1
                          ).map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  ) : (
                    <p className="font-parastoo mt-2 text-red-600 font-semibold">
                      Out of Stock
                    </p>
                  )}

                  <p className="font-parastoo text-lg mt-2 font-semibold">
                    ₹{item.book.price} × {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Right Section */}
      {!loading && cartItems.length > 0 && (
        <div className="md:w-1/3 w-full border p-4 rounded-lg mt-6 md:mt-0">
          <h3 className="font-gothic font-semibold mb-4">
            PRICE DETAILS ({selectedItems.length} items)
          </h3>

          <div className="space-y-2">
            {selectedItems.map((item) => (
              <div
                key={item._id}
                className="font-parastoo text-lg flex justify-between"
              >
                <span>
                  {item.book.bookname}{" "}
                  {item.quantity > 1 && `× ${item.quantity}`}
                </span>
                <span>₹{item.book.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <hr className="my-4" />

          <div className="font-parastoo flex justify-between font-semibold text-xl">
            <span>Total Amount</span>
            <span>₹{totalAmount}</span>
          </div>

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={selectedItems.length === 0}
            className={`font-gothic w-full py-2 rounded mt-4 ${
              selectedItems.length === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            PLACE ORDER
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;