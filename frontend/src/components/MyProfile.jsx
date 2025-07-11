import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaUser, FaEnvelope, FaPhone, FaBoxOpen,
  FaCheckCircle, FaHeart, FaShoppingCart
} from "react-icons/fa";

const MyProfile = () => {
  const navigate = useNavigate();
  const [showPersonalPopup, setShowPersonalPopup] = useState(false);
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    name: "", phone: "", address: "", locality: "", pincode: "", city: "", state: ""
  });
  const [user, setUser] = useState(null);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/users/myprofile`, {
          withCredentials: true
        });
        setUser(res.data.data);
        setEditUser(res.data.data);
        setAddresses(res.data.data.addresses || []);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    fetchUser();
  }, []);

  if (!user) return <div className="p-6">Loading profile...</div>;
  const avatarName = user.avatar?.split("/").pop().replace(".jpg", "");

  return (
    <div className="flex justify-center px-4 py-10">
      <div className="w-full max-w-4xl">
        {/* Profile Header */}
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={`/images/${avatarName}.jpg`}
            alt="Avatar"
            className="w-10 h-10 rounded-full"
          />
          <h2 className="font-gothic text-2xl font-semibold">{user.fullName}</h2>
        </div>

        {/* Contact Info */}
        <div className="mb-6 space-y-1">
          <p className="font-parastoo text-lg flex items-center">
            <FaUser className="text-black mr-2" />{user.username}
          </p>
          <p className="font-parastoo text-lg flex items-center">
            <FaEnvelope className="text-black mr-2" />{user.email}
          </p>
          <p className="font-parastoo text-lg flex items-center">
            <FaPhone className="text-black mr-2" />{user.phoneNo}
          </p>
        </div>

        {/* Navigation Buttons in 2 rows */}
        <div className="font-gothic font-semibold flex flex-col gap-4">
          {/* First Row */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/myprofile/orders")}
              className="bg-white border rounded-xl p-4 flex-1 flex flex-col items-center hover:shadow"
            >
              <FaBoxOpen className="text-green-500 text-xl" />
              <span>ORDERS</span>
            </button>
            <button
              onClick={() => navigate("/sold-items")}
              className="bg-white border rounded-xl p-4 flex-1 flex flex-col items-center hover:shadow"
            >
              <FaCheckCircle className="text-green-500 text-xl" />
              <span>SOLD ITEMS</span>
            </button>
          </div>

          {/* Second Row */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/myprofile/wishlist")}
              className="bg-white border rounded-xl p-4 flex-1 flex flex-col items-center hover:shadow"
            >
              <FaHeart className="text-green-500 text-xl" />
              <span>WISHLIST</span>
            </button>
            <button
              onClick={() => navigate("/myprofile/cart")}
              className="bg-white border rounded-xl p-4 flex-1 flex flex-col items-center hover:shadow"
            >
              <FaShoppingCart className="text-green-500 text-xl" />
              <span>CART</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
