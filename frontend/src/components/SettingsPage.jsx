import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaCreditCard, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [editStates, setEditStates] = useState({
    fullName: false,
    email: false,
    phone: false,
  });

  const fetchUserDetails = async () => {
    try {
      const res = await axios.get('/api/v1/users/myprofile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const { fullName, email, phoneNo } = res.data.data;
      setFullName(fullName);
      setEmail(email);
      setPhone(phoneNo);
    } catch (error) {
      console.error("Error fetching user profile", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const updateField = async (field) => {
  try {
    await axios.put(
      '/api/v1/users/update',
      { fullName, email, phoneNo: phone },
      { withCredentials: true }
    );
    setEditStates((prev) => ({ ...prev, [field]: false }));

    // Redirect to MyProfile and trigger refetch
    navigate("/myprofile", { replace: true }); // force remount
  } catch (err) {
    console.error("Failed to update", err);
  }
};


  const handleEdit = (field) => setEditStates({ ...editStates, [field]: true });
  const handleCancel = (field) => setEditStates({ ...editStates, [field]: false });

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 p-6 bg-gray-50 border-r space-y-6">
        <h2 className="font-gothic text-lg font-semibold text-center">Hello!</h2>
        <div>
          <h3 className="font-gothic font-bold text-gray-600 flex items-center">
            <FaUser className="text-green-500 mr-2" /> Account Settings
          </h3>
          <button onClick={() => navigate("/settings")} className="font-parastoo font-bold ml-6 text-lg">Personal Info</button><br />
          <button onClick={() => navigate("/address")} className="ml-6 text-lg font-parastoo">Manage Address</button>
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

      {/* Right Content */}
      <div className="flex-1 p-6">
        <h1 className="font-gothic text-2xl font-bold mb-4">Account Settings</h1>
        <h2 className="font-gothic text-xl font-semibold mb-6 text-green-600">Profile Information</h2>

        {/* Full Name */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h3 className="font-parastoo text-xl font-semibold">Full Name</h3>
            {!editStates.fullName ? (
              <button onClick={() => handleEdit('fullName')} className="font-parastoo text-green-600 font-medium hover:underline">Edit</button>
            ) : (
              <div className="space-x-2">
                <button onClick={() => handleCancel('fullName')} className="font-parastoo text-green-600 hover:underline">Cancel</button>
                <button onClick={() => updateField('fullName')} className="font-gothic bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">Save</button>
              </div>
            )}
          </div>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={!editStates.fullName}
            className={`font-parastoo w-full mt-2 p-3 border rounded ${editStates.fullName ? 'border-green-500 bg-white' : 'bg-gray-100 text-gray-500'}`}
          />
        </div>

        {/* Email */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h3 className="font-parastoo text-xl font-semibold">Email Address</h3>
            {!editStates.email ? (
              <button onClick={() => handleEdit('email')} className="font-parastoo text-green-600 font-medium hover:underline">Edit</button>
            ) : (
              <div className="space-x-2">
                <button onClick={() => handleCancel('email')} className="font-parastoo text-green-600 hover:underline">Cancel</button>
                <button onClick={() => updateField('email')} className="bg-green-600 font-gothic text-white px-4 py-1 rounded hover:bg-green-700">Save</button>
              </div>
            )}
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!editStates.email}
            className={`font-parastoo w-full mt-2 p-3 border rounded ${editStates.email ? 'border-green-500 bg-white' : 'bg-gray-100 text-gray-500'}`}
          />
        </div>

        {/* Phone */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h3 className="font-parastoo text-xl font-semibold">Mobile Number</h3>
            {!editStates.phone ? (
              <button onClick={() => handleEdit('phone')} className="font-parastoo text-green-600 font-medium hover:underline">Edit</button>
            ) : (
              <div className="space-x-2">
                <button onClick={() => handleCancel('phone')} className="font-parastoo text-green-600 hover:underline">Cancel</button>
                <button onClick={() => updateField('phone')} className="font-gothic bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">Save</button>
              </div>
            )}
          </div>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={!editStates.phone}
            className={`font-parastoo w-full mt-2 p-3 border rounded ${editStates.phone ? 'border-green-500 bg-white' : 'bg-gray-100 text-gray-500'}`}
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
