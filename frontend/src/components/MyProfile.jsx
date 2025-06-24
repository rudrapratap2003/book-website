import { useState } from "react";
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

  const [user, setUser] = useState({
    name: "Mona Sas",
    username: "mona123",
    email: "mona@e.com",
    phone: "+91 1234567890",
  });

  const [editUser, setEditUser] = useState(user);

  const savePersonalInfo = async () => {
    try {
      // Update backend
      await axios.put("/api/user/update", editUser);
      // Update UI
      setUser(editUser);
      setShowPersonalPopup(false);
    } catch (err) {
      console.error("Failed to update user info", err);
    }
  };

  const handleAddAddress = async () => {
    try {
      await axios.post("/api/user/address", newAddress);
      setAddresses([...addresses, newAddress]);
      setNewAddress({ name: "", phone: "", address: "", locality: "", pincode: "", city: "", state: "" });
    } catch (err) {
      console.error("Failed to save address", err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Sidebar */}
      <div className="w-full md:w-1/4 p-6 bg-gray-50 border-r space-y-6">
        <h2 className="text-lg font-semibold text-center">Hello !</h2>
        <div>
          <h3 className="font-bold text-gray-600 flex items-center">
            <FaUser className="text-green-500 mr-2" /> Account Settings
          </h3>
          <button onClick={() => setShowPersonalPopup(true)} className="ml-6 text-sm">Personal Info</button><br />
          <button onClick={() => setShowAddressPopup(true)} className="ml-6 text-sm">Manage Address</button>
        </div>
        <div>
          <h3 className="font-bold text-gray-600 flex items-center">
            <FaCreditCard className="text-green-500 mr-2" /> Payments
          </h3>
          <p className="ml-6 text-sm">UPI Payment</p>
          <p className="ml-6 text-sm">Cash On Delivery</p>
        </div>
        <button className="flex items-center">
          <FaSignOutAlt className="text-green-500 mr-2" /> Logout
        </button>
      </div>

      {/* Right Profile Display */}
      <div className="w-full md:w-3/4 p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-4xl text-green-600">
            {user.name.charAt(0)}
          </div>
          <h2 className="text-xl font-semibold">{user.name}</h2>
        </div>
        <div className="mb-6 space-y-1">
          <p className="text-sm flex items-center"><FaUser className="text-black mr-2" />{user.username}</p>
          <p className="text-sm flex items-center"><FaEnvelope className="text-black mr-2" />{user.email}</p>
          <p className="text-sm flex items-center"><FaPhone className="text-black mr-2" />{user.phone}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          <button onClick={() => navigate("/orders")} className="bg-white border rounded-xl p-4 flex flex-col items-center hover:shadow">
            <FaBoxOpen className="text-green-500 text-xl" /><span>ORDERS</span>
          </button>
          <button onClick={() => navigate("/sold-items")} className="bg-white border rounded-xl p-4 flex flex-col items-center hover:shadow">
            <FaCheckCircle className="text-green-500 text-xl" /><span>SOLD ITEMS</span>
          </button>
          <button onClick={() => navigate("/myprofile/wishlist")} className="bg-white border rounded-xl p-4 flex flex-col items-center hover:shadow">
            <FaHeart className="text-green-500 text-xl" /><span>WISHLIST</span>
          </button>
          <button onClick={() => navigate("/cart")} className="bg-white border rounded-xl p-4 flex flex-col items-center hover:shadow">
            <FaShoppingCart className="text-green-500 text-xl" /><span>CART</span>
          </button>
        </div>
      </div>

      {/* Personal Info Popup */}
      {showPersonalPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl border-2 border-green-500 p-6 w-full max-w-md relative">
            <button onClick={() => setShowPersonalPopup(false)} className="absolute top-2 right-3 text-lg font-bold">&times;</button>
            <h3 className="text-lg font-semibold mb-4">Edit Personal Information</h3>
            <input type="text" placeholder="Full Name" className="input w-full mb-2" value={editUser.name} onChange={e => setEditUser({ ...editUser, name: e.target.value })} />
            <input type="text" placeholder="Username" className="input w-full mb-2" value={editUser.username} onChange={e => setEditUser({ ...editUser, username: e.target.value })} />
            <input type="email" placeholder="Email" className="input w-full mb-2" value={editUser.email} onChange={e => setEditUser({ ...editUser, email: e.target.value })} />
            <input type="text" placeholder="Phone Number" className="input w-full mb-2" value={editUser.phone} onChange={e => setEditUser({ ...editUser, phone: e.target.value })} />
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
              <input type="text" placeholder="Name" className="input w-full" value={newAddress.name} onChange={e => setNewAddress({ ...newAddress, name: e.target.value })} />
              <input type="text" placeholder="Phone Number" className="input w-full" value={newAddress.phone} onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })} />
              <input type="text" placeholder="Address" className="input w-full" value={newAddress.address} onChange={e => setNewAddress({ ...newAddress, address: e.target.value })} />
              <input type="text" placeholder="Locality" className="input w-full" value={newAddress.locality} onChange={e => setNewAddress({ ...newAddress, locality: e.target.value })} />
              <input type="text" placeholder="Pincode" className="input w-full" value={newAddress.pincode} onChange={e => setNewAddress({ ...newAddress, pincode: e.target.value })} />
              <input type="text" placeholder="City" className="input w-full" value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} />
              <input type="text" placeholder="State" className="input w-full" value={newAddress.state} onChange={e => setNewAddress({ ...newAddress, state: e.target.value })} />
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
