import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUser, FaCreditCard, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AddressSettings = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    pincode: '',
    locality: '',
    address: '',
    city: '',
    state: '',
    landmark: '',
    altPhone: '',
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/users/get-addresses`, {
        withCredentials: true
      });
      setAddresses(res.data.data);
    } catch (err) {
      console.error("Error fetching addresses:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/users/add-address`, formData, {
        withCredentials: true
      });
      await fetchAddresses(); // refresh the list
      setFormData({
        name: '',
        phone: '',
        pincode: '',
        locality: '',
        address: '',
        city: '',
        state: '',
        landmark: '',
        altPhone: '',
      });
      setShowForm(false);
    } catch (err) {
      console.error("Failed to save address:", err);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      phone: '',
      pincode: '',
      locality: '',
      address: '',
      city: '',
      state: '',
      landmark: '',
      altPhone: '',
    });
    setShowForm(false);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 p-6 bg-gray-50 border-r space-y-6">
        <h2 className="font-gothic text-lg font-semibold text-center">Hello!</h2>
        <div>
          <h3 className="font-gothic font-bold text-gray-600 flex items-center">
            <FaUser className="text-green-500 mr-2" /> Account Settings
          </h3>
          <button onClick={() => navigate("/settings")} className="font-parastoo ml-6 text-lg">Personal Info</button><br />
          <button onClick={() => navigate("/address")} className="ml-6 text-lg font-parastoo font-bold">Manage Address</button>
        </div>
        <div>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 p-6">
        <h1 className="font-gothic text-2xl font-semibold mb-4">Account Settings</h1>
        <h2 className="font-gothic text-xl font-medium mb-2 text-green-600">Manage Addresses</h2>

        {addresses.map((addr, index) => (
          <div key={index} className="font-parastoo border p-4 mb-4 rounded-md bg-gray-50">
            <p className="font-medium">{addr.name}</p>
            <p>{addr.phone}</p>
            <p>{addr.address}, {addr.locality}, {addr.city} - {addr.pincode}</p>
            <p>{addr.state}</p>
            {addr.landmark && <p>Landmark: {addr.landmark}</p>}
            {addr.altPhone && <p>Alternate Phone: {addr.altPhone}</p>}
          </div>
        ))}

        {!showForm && (
          <div
            onClick={() => setShowForm(true)}
            className="border cursor-pointer hover:bg-gray-100 rounded-md p-4 mb-4 flex items-center gap-2 text-green-600 font-semibold"
          >
            <span className="font-gothic text-green-600 text-xl">+</span>
            <span className='font-gothic text-green-600'>ADD A NEW ADDRESS</span>
          </div>
        )}

        {showForm && (
          <div className="bg-green-50 p-6 rounded-md">
            <div className="font-parastoo grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="border p-2 rounded" />
              <input type="text" name="phone" placeholder="10-digit mobile number" value={formData.phone} onChange={handleChange} className="border p-2 rounded" />
              <input type="text" name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} className="border p-2 rounded" />
              <input type="text" name="locality" placeholder="Locality" value={formData.locality} onChange={handleChange} className="border p-2 rounded" />
              <textarea name="address" placeholder="Address (Area and Street)" value={formData.address} onChange={handleChange} className="border p-2 rounded md:col-span-2" />
              <input type="text" name="city" placeholder="City/District/Town" value={formData.city} onChange={handleChange} className="border p-2 rounded" />
              <select name="state" value={formData.state} onChange={handleChange} className="border p-2 rounded">
                <option value="">--Select State--</option>
                <option value="Delhi">Delhi</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="West Bengal">West Bengal</option>
              </select>
              <input type="text" name="landmark" placeholder="Landmark (Optional)" value={formData.landmark} onChange={handleChange} className="border p-2 rounded" />
              <input type="text" name="altPhone" placeholder="Alternate Phone (Optional)" value={formData.altPhone} onChange={handleChange} className="border p-2 rounded" />
            </div>
            <div className="flex gap-4 mt-6">
              <button onClick={handleSave} className="font-gothic bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">SAVE</button>
              <button onClick={handleCancel} className="font-gothic text-green-600 px-6 py-2 rounded hover:underline">CANCEL</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressSettings;
