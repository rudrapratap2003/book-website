import { useEffect, useState } from "react";
import axios from "axios";


const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get("/api/v1/users/cart", {
          withCredentials: true,
        });
        const itemsWithSelection = res.data.data.cartItems.map((item) => ({
          ...item,
          selected: false,
        }));
        setCartItems(itemsWithSelection);
        console.log("Fetched cart items →", res.data.data.cartItems);
      } catch (error) {
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
      await axios.post(
        "/api/v1/users/cart/add",
        { bookId, quantity: parseInt(quantity) },
        { withCredentials: true }
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
      await axios.post(
        "/api/v1/users/cart/remove",
        { ids: selectedIds },
        { withCredentials: true }
      );
      setCartItems((prev) => prev.filter((item) => !item.selected));
    } catch (error) {
      console.error("Error removing items:", error);
    }
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
        <h2 className="text-4xl font-bold mb-4">My Cart</h2>

        {loading ? (
          <p className="text-gray-600">Loading your cart...</p>
        ) : cartItems.length === 0 ? (
          <p className="text-gray-600">Your cart is empty now.</p>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={
                    selectedItems.length > 0 &&
                    selectedItems.length === cartItems.length
                  }
                  onChange={(e) =>
                    setCartItems((prev) =>
                      prev.map((item) => ({
                        ...item,
                        selected: e.target.checked,
                      }))
                    )
                  }
                />
                <span className="font-medium">
                  {selectedItems.length}/{cartItems.length} ITEMS SELECTED
                </span>
              </div>
              <button
                onClick={handleRemoveSelected}
                className="text-red-500 hover:underline"
              >
                REMOVE
              </button>
            </div>

            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex gap-4 border p-3 rounded-lg mb-4 items-start"
              >
                <input
                  type="checkbox"
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
                  <p className="font-semibold">{item.book.bookname}</p>
                  <p className="text-sm text-gray-500">
                    By: {item.book.author}
                  </p>

                  <div className="flex gap-4 items-center mt-2">
                    <label>
                      Qty:
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          handleAddToCart(item.book._id, e.target.value)
                        }
                        className="ml-2 border px-2 py-1 rounded"
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <p className="mt-2 font-semibold">
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
          <h3 className="font-semibold mb-4">
            PRICE DETAILS ({selectedItems.length} items)
          </h3>

          <div className="space-y-2">
            {selectedItems.map((item) => (
              <div key={item._id} className="flex justify-between">
                <span>
                  {item.book.bookname}{" "}
                  {item.quantity > 1 && `× ${item.quantity}`}
                </span>
                <span>₹{item.book.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <hr className="my-4" />

          <div className="flex justify-between font-semibold text-lg">
            <span>Total Amount</span>
            <span>₹{totalAmount}</span>
          </div>

          <button className="w-full bg-red-500 text-white py-2 rounded mt-4 hover:bg-red-600">
            PLACE ORDER
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
