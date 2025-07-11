import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [step, setStep] = useState(1);

  const [errorMessage, setErrorMessage] = useState('');
  const [matchError, setMatchError] = useState('');

  const toastShown = useRef(false);


  // Delete account state
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [confirmDeleteStep, setConfirmDeleteStep] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const fetchUserDetails = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/users/myprofile`, {
        withCredentials: true,
      });
      const { fullName, email, phoneNo } = res.data.data;
      setFullName(fullName);
      setEmail(email);
      setPhone(phoneNo);
    } catch (error) {
      console.error("Error fetching user profile", error);
    }
  };
  
  const updateField = async (field) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/update`,
        { fullName, email, phoneNo: phone },
        { withCredentials: true }
      );
      setEditStates((prev) => ({ ...prev, [field]: false }));
      navigate("/myprofile", { replace: true });
    } catch (err) {
      console.error("Failed to update", err);
    }
  };

  const verifyOldPassword = async () => {
    if (!oldPassword) {
      setErrorMessage("Please enter your current password.");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/users/changepassword`, { oldPassword, newPassword: oldPassword }, { withCredentials: true });

      setStep(2);
      setErrorMessage('');
    } catch (err) {
      setErrorMessage("Old password is incorrect.");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setMatchError("New passwords do not match.");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/changepassword`,
        { oldPassword, newPassword },
        { withCredentials: true }
      );

      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setShowPasswordPrompt(false);
      setStep(1);
      setMatchError('');

      if (!toastShown.current) {
        toast.success("Password changed successfully!", {
          position: "bottom-center",
          autoClose: 2000,
        });
        toastShown.current = true;
        setTimeout(() => {
          toastShown.current = false;
        }, 2000);
      }
    } catch (err) {
      setMatchError("Password update failed. Please try again.");
    }
  };

  const handleEdit = (field) => setEditStates({ ...editStates, [field]: true });
  const handleCancel = (field) => setEditStates({ ...editStates, [field]: false });

  const handleDeleteAccount = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/delete-account`,
        { password: deletePassword },
        { withCredentials: true }
      );
      toast.success("Account deleted successfully. Redirecting...", {
        position: "bottom-center",
        autoClose: 2000,
      });
      setTimeout(() => {
        navigate('/signup');
      }, 2000);
    } catch (err) {
      setDeleteError("Incorrect password. Please try again.");
    }
  };
  useEffect(() => {
  fetchUserDetails();
}, []);


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
      </div>

      {/* Main Content */}
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
      placeholder="Enter your full name"
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
      placeholder="Enter your email"
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
      placeholder="Enter your mobile number"
    />
</div>

        {/* Change Password Section */}
<div className="mt-8">
  {!showPasswordPrompt ? (
    <button
      onClick={() => setShowPasswordPrompt(true)}
      className="border border-green-600 bg-green-50 text-green-700 px-4 py-2 rounded font-gothic text-lg hover:bg-green-100"
    >
      Change your password
    </button>
  ) : (
    <div className="space-y-4">
      <p className="text-lg font-parastoo text-gray-700">
        Are you sure you want to change your password?
      </p>

      {step === 1 && (
        <>
          <input
            type="password"
            placeholder="Enter your old password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full p-3 border rounded border-green-500 font-parastoo"
          />
          <button
            onClick={verifyOldPassword}
            className="bg-green-600 text-white px-4 py-2 rounded font-gothic"
          >
            Confirm
          </button>
          {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 border rounded border-green-500 font-parastoo"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="w-full p-3 border rounded border-green-500 font-parastoo"
          />
          <button
            onClick={handleChangePassword}
            className="bg-green-600 text-white px-4 py-2 rounded font-gothic"
          >
            Save
          </button>
          {matchError && <p className="text-red-600 text-sm">{matchError}</p>}
        </>
      )}
    </div>
  )}
</div>


       {/* Delete Account Section */}
<div className="mt-10">
  <p className="text-red-700 font-parastoo text-md mb-2">
    ⚠️ Deleting your account will result in the loss of all associated data; this action is irreversible.
  </p>
  {!showDeletePrompt ? (
    <button
      onClick={() => setShowDeletePrompt(true)}
      className="border border-red-600 bg-red-50 text-red-700 px-4 py-2 rounded font-gothic text-lg hover:bg-red-100"
    >
      Delete account
    </button>
  ) : (
    <div className="space-y-4 border border-red-300 bg-red-50 p-4 rounded-md mt-4">
      <p className="text-red-700 font-parastoo text-md">
        ⚠️ If you delete your account, all your data will be lost permanently. Are you sure you want to dleete your account?
      </p>

      {!confirmDeleteStep ? (
        <div className="space-x-4">
          <button
            onClick={() => setConfirmDeleteStep(true)}
            className="bg-red-600 text-white px-4 py-2 rounded font-gothic"
          >
            Yes, I’m sure
          </button>
          <button
            onClick={() => setShowDeletePrompt(false)}
            className="text-red-600 font-parastoo hover:underline"
          >
            No, cancel
          </button>
        </div>
      ) : (
        <div>
          <input
            type="password"
            placeholder="Confirm your password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            className="w-full p-3 border rounded border-red-500 font-parastoo"
          />
          <button
            onClick={handleDeleteAccount}
            className="bg-red-600 text-white px-4 py-2 rounded font-gothic mt-2"
          >
            Delete Account
          </button>
          {deleteError && <p className="text-red-600 text-sm">{deleteError}</p>}
        </div>
      )}
    </div>
  )}
</div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SettingsPage;
