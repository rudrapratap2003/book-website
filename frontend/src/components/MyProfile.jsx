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

  const savePersonalInfo = async () => {
    try {
      const res = await axios.put("/api/v1/users/update", editUser, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUser(res.data.data);
      setEditUser(res.data.data);
      setShowPersonalPopup(false);
    } catch (err) {
      console.error("Failed to update user info", err);
    }
  };

  const handleAddAddress = async () => {
    try {
      const res = await axios.post("/api/v1/users/address", newAddress, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setAddresses([...addresses, newAddress]);
      setNewAddress({ name: "", phone: "", address: "", locality: "", pincode: "", city: "", state: "" });
    } catch (err) {
      console.error("Failed to save address", err);
    }
  };

  if (!user) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 p-6 bg-gray-50 border-r space-y-6">
        <h2 className="font-gothic text-lg font-semibold text-center">Hello, {user.fullName.split(" ")[0]}!</h2>
        <div>
          <h3 className="font-gothic font-bold text-gray-600 flex items-center">
            <FaUser className=" text-green-500 mr-2" /> Account Settings
          </h3>
          <button onClick={() => setShowPersonalPopup(true)} className="font-parastoo ml-6 text-lg">Personal Info</button><br />
          <button onClick={() => setShowAddressPopup(true)} className="ml-6 text-lg font-parastoo">Manage Address</button>
        </div>
        <div>
          <h3 className="font-gothic font-bold text-gray-600 flex items-center">
            <FaCreditCard className="text-green-500 mr-2" /> Payments
          </h3>
          <p className="ml-6 text-lg font-parastoo">UPI Payment</p>
          <p className="ml-6 text-lg font-parastoo">Cash On Delivery</p>
        </div>
        <button className="font-gothic font-bold text-gray-600 flex items-center">
          <FaSignOutAlt className="text-green-500 mr-2" /> Logout
        </button>
      </div>

      {/* Profile Display */}
      <div className="w-full md:w-3/4 p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="font-gothic w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-4xl text-green-600">
            {user.fullName?.charAt(0)}
          </div>
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

      {/* Edit Personal Info Popup */}
      {showPersonalPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl border-2 border-green-500 p-6 w-full max-w-md relative">
            <button onClick={() => setShowPersonalPopup(false)} className="absolute top-2 right-3 text-lg font-bold">&times;</button>
            <h3 className="text-lg font-semibold mb-4">Edit Personal Information</h3>
            <input type="text" placeholder="Full Name" className="input w-full mb-2" value={editUser.fullName} onChange={e => setEditUser({ ...editUser, fullName: e.target.value })} />
            <input type="text" placeholder="Username" className="input w-full mb-2" value={editUser.username} onChange={e => setEditUser({ ...editUser, username: e.target.value })} />
            <input type="email" placeholder="Email" className="input w-full mb-2" value={editUser.email} onChange={e => setEditUser({ ...editUser, email: e.target.value })} />
            <input type="text" placeholder="Phone Number" className="input w-full mb-2" value={editUser.phoneNo} onChange={e => setEditUser({ ...editUser, phoneNo: e.target.value })} />
            <button onClick={savePersonalInfo} className="bg-green-500 text-white px-4 py-2 rounded mt-2">Save</button>
          </div>
        </div>
      )}

      {/* Address Popup */}
      {showAddressPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl border-2 border-green-500 p-6 w-full max-w-md relative">
            <button onClick={() => setShowAddressPopup(false)} className="absolute top-2 right-3 text-lg font-bold">&times;</button>
            <h3 className="text-lg font-semibold mb-4">Manage Addresses</h3>
            <div className="space-y-2 mb-4">
              {["name", "phone", "address", "locality", "pincode", "city", "state"].map((field, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="input w-full"
                  value={newAddress[field]}
                  onChange={(e) => setNewAddress({ ...newAddress, [field]: e.target.value })}
                />
              ))}
              <button onClick={handleAddAddress} className="bg-green-500 text-white px-4 py-2 rounded mt-2">+ Add New Address</button>
            </div>
            <div className="mt-4 space-y-2">
              {addresses.map((addr, i) => (
                <div key={i} className="border p-2 rounded text-sm bg-gray-50">
                  <p><strong>{addr.name}</strong> ({addr.phone})</p>
                  <p>{addr.address}, {addr.locality}, {addr.city} - {addr.pincode}</p>
                  <p>{addr.state}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
