import { useState } from 'react';

const SettingsPage = () => {
  const [firstName, setFirstName] = useState('Mona');
  const [lastName, setLastName] = useState('Sas');
  const [email, setEmail] = useState('mona@example.com');
  const [phone, setPhone] = useState('+918328819363');

  const [editStates, setEditStates] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
  });

  const handleEdit = (field) => {
    setEditStates({ ...editStates, [field]: true });
  };

  const handleCancel = (field) => {
    setEditStates({ ...editStates, [field]: false });
  };

  const handleSave = (field) => {
    setEditStates({ ...editStates, [field]: false });
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="font-gothic text-2xl font-bold mb-4 ">Account Settings</h1>
      <h2 className="font-gothic text-xl font-semibold mb-6 text-green-600">Profile Information</h2>

      {/* First Name */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h3 className="font-parastoo text-xl font-semibold">First Name</h3>
          {!editStates.firstName ? (
            <button onClick={() => handleEdit('firstName')} className="font-parastoo text-green-600 font-medium hover:underline">
              Edit
            </button>
          ) : (
            <div className="space-x-2">
              <button onClick={() => handleCancel('firstName')} className="font-parastoo text-green-600 hover:underline">Cancel</button>
              <button onClick={() => handleSave('firstName')} className="font-gothic bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">Save</button>
            </div>
          )}
        </div>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          disabled={!editStates.firstName}
          className={`font-parastoo w-full mt-2 p-3 border rounded ${editStates.firstName ? 'border-green-500 bg-white' : 'bg-gray-100 text-gray-500'}`}
        />
      </div>

      {/* Last Name */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h3 className="font-parastoo text-xl font-semibold">Last Name</h3>
          {!editStates.lastName ? (
            <button onClick={() => handleEdit('lastName')} className="font-parastoo text-green-600 font-medium hover:underline">
              Edit
            </button>
          ) : (
            <div className="space-x-2">
              <button onClick={() => handleCancel('lastName')} className="font-parastoo text-green-600 hover:underline">Cancel</button>
              <button onClick={() => handleSave('lastName')} className="font-gothic bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">Save</button>
            </div>
          )}
        </div>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          disabled={!editStates.lastName}
          className={`font-parastoo w-full mt-2 p-3 border rounded ${editStates.lastName ? 'border-green-500 bg-white' : 'bg-gray-100 text-gray-500'}`}
        />
      </div>

      {/* Email */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h3 className="font-parastoo text-xl font-semibold">Email Address</h3>
          {!editStates.email ? (
            <button onClick={() => handleEdit('email')} className="font-parastoo text-green-600 font-medium hover:underline">
              Edit
            </button>
          ) : (
            <div className="space-x-2">
              <button onClick={() => handleCancel('email')} className="font-parastoo text-green-600 hover:underline">Cancel</button>
              <button onClick={() => handleSave('email')} className="bg-green-600 font-gothic text-white px-4 py-1 rounded hover:bg-green-700">Save</button>
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
            <button onClick={() => handleEdit('phone')} className="font-parastoo text-green-600 font-medium hover:underline">
              Edit
            </button>
          ) : (
            <div className="space-x-2">
              <button onClick={() => handleCancel('phone')} className="font-parastoo text-green-600 hover:underline">Cancel</button>
              <button onClick={() => handleSave('phone')} className="font-gothic bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">Save</button>
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
  );
};

export default SettingsPage;
