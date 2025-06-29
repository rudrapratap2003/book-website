import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaUser, FaCreditCard, FaSignOutAlt, FaEnvelope,
  FaPhone, FaBoxOpen, FaHeart, FaShoppingCart, FaCheckCircle
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
        const res = await axios.get("/api/v1/users/myprofile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(res.data.data); // since you use ApiResponse wrapper
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
  console.log("Avatar filename:", user.avatar);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 p-6 bg-gray-50 border-r space-y-6">
        <h2 className="font-gothic text-lg font-semibold text-center">Hello, {user.fullName.split(" ")[0]}!</h2>
        <div>
          <h3 className="font-gothic font-bold text-gray-600 flex items-center">
            <FaUser className=" text-green-500 mr-2" /> Account Settings
          </h3>
          <button onClick={() => {navigate("/settings")}} className="font-parastoo ml-6 text-lg">Personal Info</button><br />
          <button onClick={() => {navigate("/address")}} className="ml-6 text-lg font-parastoo">Manage Address</button>
        </div>
      </div>

      {/* Profile Display */}
      <div className="w-full md:w-3/4 p-6">
        <div className="flex items-center space-x-4 mb-4">
          

<img
  src={`/images/${avatarName}.jpg`}
  alt="Avatar"
  className="w-10 h-10 rounded-full"
/>

          <h2 className="font-gothic text-2xl font-semibold">{user.fullName}</h2>
        </div>
        <div className="mb-6 space-y-1">
          <p className="font-parastoo text-lg flex items-center"><FaUser className="text-black mr-2" />{user.username}</p>
          <p className="font-parastoo text-lg flex items-center"><FaEnvelope className="text-black mr-2" />{user.email}</p>
          <p className="font-parastoo text-lg flex items-center"><FaPhone className="text-black mr-2" />{user.phoneNo}</p>
        </div>
        <div className="font-gothic font-semibold grid grid-cols-2 md:grid-cols-2 gap-4">
          <button onClick={() => navigate("/orders")} className="bg-white border rounded-xl p-4 flex flex-col items-center hover:shadow">
            <FaBoxOpen className=" text-green-500 text-xl" /><span>ORDERS</span>
          </button>
          <button onClick={() => navigate("/sold-items")} className="bg-white border rounded-xl p-4 flex flex-col items-center hover:shadow">
            <FaCheckCircle className=" text-green-500 text-xl" /><span>SOLD ITEMS</span>
          </button>
          <button onClick={() => navigate("/myprofile/wishlist")} className="bg-white border rounded-xl p-4 flex flex-col items-center hover:shadow">
            <FaHeart className=" text-green-500 text-xl" /><span>WISHLIST</span>
          </button>
          <button onClick={() => navigate("/myprofile/cart")} className="bg-white border rounded-xl p-4 flex flex-col items-center hover:shadow">
            <FaShoppingCart className=" text-green-500 text-xl" /><span>CART</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
