import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { IoClose } from "react-icons/io5";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export default function AddressPage() {
  const navigate = useNavigate();
  const location = useLocation();
const storedBook = sessionStorage.getItem("buyBook");
const bookData = location.state?.book || (storedBook ? JSON.parse(storedBook) : null);

  const bookId = new URLSearchParams(location.search).get("book");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddrId, setSelectedAddrId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSheet, setShowSheet] = useState(false);
  const [bookPrice, setBookPrice] = useState(bookData?.price || null);
  
  function loadRazorpay() {
    return new Promise((res) => {
      if (window.Razorpay) return res(true);
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => res(true);
      s.onerror = () => res(false);
      document.body.appendChild(s);
    });
  }

  useEffect(() => {
    const last = sessionStorage.getItem("lastOrderedBook");
    if (!bookId || (bookId === last && !location.state?.allow)) {
      navigate("/books", { replace: true });   // or wherever you want to send them
    }
  }, [bookId, location.state, navigate]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/users/get-addresses`);
        const arr = res.data.data;
        setAddresses(arr);
        if (arr.length) setSelectedAddrId(arr[0]._id);   // default
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const current = addresses.find((a) => a._id === selectedAddrId);

  const payNow = async () => {
    console.log(bookPrice);
    
  if (!bookPrice) return alert("Book price not loaded");

  const ok = await loadRazorpay();
  if (!ok) return alert("Unable to load Razorpay SDK");

  const res = await api.post("/api/v1/payment/checkout", {
    money: bookPrice * 100  // convert ₹ to paise
  });

  const { orderId, amount, currency, key } = res.data.data;
  
  const rzp = new window.Razorpay({
    key,
    order_id: orderId,
    amount,
    currency,
    name: "Book Store",
    description: "Book purchase",
    handler: async (resp) => {
      try {
        await api.post("/api/v1/payment/verifyPayment", resp);
        await api.post("/api/v1/users/order-place", {
          bookId,
          quantity: 1,
          addressId: selectedAddrId,
          razorpayOrderId: resp.razorpay_order_id,
          razorpayPaymentId: resp.razorpay_payment_id,
        });

        sessionStorage.setItem("lastOrderedBook", bookId);
        navigate("/myprofile/orders", { replace: true });
      } catch {
        alert("Payment verification failed on server");
      }
    },
    prefill: {
      name: current?.name || "Customer",
      contact: current?.phone || "",
    },
    theme: { color: "#fc6b03" },
  });

  rzp.open();
};



  if (loading) return <p className="p-8">Loading…</p>;

  return (
    <div className="max-w-lg mx-auto p-4 space-y-6">
      {current ? (
        <div className="border rounded-lg p-4 space-y-1">
          <p className="font-medium">{current.name}</p>
          <p>{current.address}, {current.locality}</p>
          <p>{current.city}, {current.state} {current.pincode}</p>
          <p className="text-gray-600 text-sm">Phone: {current.phone}</p>
          <p className="text-sm text-yellow-700 bg-yellow-100 p-2 rounded">
            ⚠️ <strong>Test Mode:</strong> To simulate a successful payment, choose <strong>UPI</strong> and enter <code>success@razorpay</code> as your UPI ID.
          </p>

          <button
            className="mt-4 w-full bg-orange-600 text-white py-2 rounded"
            onClick={payNow}
          >
            Deliver to this address
          </button>

          <button
            className="mt-2 w-full border border-indigo-600 text-indigo-600 py-2 rounded"
            onClick={() => setShowSheet(true)}
          >
            Change Address
          </button>
        </div>
      ) : (
        <button
          className="w-full bg-indigo-600 text-white py-3 rounded"
          onClick={() => navigate("/account/addresses/new")}
        >
          + Add Address
        </button>
      )}

      {showSheet && (
        <AddressSheet
          addresses={addresses}
          selectedId={selectedAddrId}
          onSelect={(id) => {
            setSelectedAddrId(id);
            setShowSheet(false);
          }}
          onAdd={() => {
            setShowSheet(false);
            navigate("/address");
          }}
          onClose={() => setShowSheet(false)}
        />
      )}
    </div>
  );
}

/* ───────── slide‑in sheet with radio bullets ───────────────────────── */
function AddressSheet({ addresses, selectedId, onSelect, onAdd, onClose }) {
  const [open, setOpen] = useState(false);
  useEffect(() => { const t = setTimeout(() => setOpen(true), 10); return () => clearTimeout(t); }, []);

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/30 z-[75]" onClick={onClose} />

      <div className={`fixed top-0 right-0 z-[80] h-screen w-4/5 max-w-[320px] bg-white shadow-xl
                       transform transition-transform duration-300 ease-in-out
                       ${open ? "translate-x-0" : "translate-x-full"}`}>
        <button className="absolute top-3 right-3" onClick={onClose}>
          <IoClose size={24} />
        </button>

        <h3 className="text-lg font-semibold p-4 border-b">Select Address</h3>

        <form className="p-4 space-y-4 overflow-y-auto h-[calc(100%-150px)]">
          {addresses.map((addr) => (
            <label
              key={addr._id}
              className={`flex items-start gap-3 border p-3 rounded cursor-pointer hover:shadow
                          ${addr._id === selectedId ? "ring-2 ring-orange-600" : ""}`}
            >
              {/* radio bullet */}
              <input
                type="radio"
                name="address"
                value={addr._id}
                checked={addr._id === selectedId}
                onChange={() => {
                  onSelect(addr._id);   // update selection & close sheet
                }}
                className="mt-1 accent-orange-600 w-4 h-4"
              />

              {/* address text */}
              <div>
                <p className="font-medium">{addr.name}</p>
                <p className="text-sm">{addr.address}, {addr.locality}</p>
                <p className="text-sm">{addr.city}, {addr.state} {addr.pincode}</p>
                <p className="text-xs text-gray-500">Phone: {addr.phone}</p>
              </div>
            </label>
          ))}
        </form>

        <button
          className="w-full bg-indigo-600 text-white py-3 rounded-b"
          onClick={() => { onClose(); onAdd(); }}
        >
          + Add Address
        </button>
      </div>
    </div>
  );
}


