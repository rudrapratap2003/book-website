import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const SignUp = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNo: '',
    username: '',
    password: '',
    avatar: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const avatars = [
    "/src/images/avatar1.jpg",
    "/src/images/avatar2.jpg",
    "/src/images/avatar3.jpg",
    "/src/images/avatar4.jpg",
    "/src/images/avatar5.jpg",
    "/src/images/avatar6.jpg",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/v1/users/register', formData, { withCredentials: true });
      setMessage(response.data.message);
      setError('');
      setIsAuthenticated(true);
      navigate('/profile');
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong";
      setError(errorMessage);
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f5f5f5]">
      {/* Left Image Section */}
      <div className="md:w-1/2 w-full bg-[#e0e0e0] flex items-center justify-center p-4">
        <img
          src="/src/images/lady.png"
          alt="Signup Visual"
          className="max-w-full h-auto"
        />
      </div>

      {/* Right Form Section */}
      <div className="md:w-1/2 w-full bg-white flex items-center justify-center p-6 relative">
        <div className="w-full max-w-md">
          <h2 className="font-gothic text-2xl font-bold text-gray-800 mb-2">Please create an account</h2>
          <p className="font-parastoo text-lg text-gray-600 mb-6">Give your credentials to register</p>

          <form className="space-y-4" onSubmit={handleRegister}>
            {['fullName', 'phoneNo', 'email', 'username', 'password'].map((field, i) => (
              <div key={i}>
                <label className="font-parastoo block text-gray-700 mb-1 text-lg" htmlFor={field}>
                  {field === 'phoneNo' ? 'Phone Number' : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  id={field}
                  name={field}
                  type={field === 'email' ? 'email' : field === 'password' ? 'password' : 'text'}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  className="font-parastoo w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
                  placeholder={`Enter your ${field === 'phoneNo' ? 'phone number' : field}`}
                />
              </div>
            ))}

            {/* Avatar Selection Button */}
            <div>
              <label className="font-parastoo block text-gray-700 mb-1 text-lg">Avatar (Optional)</label>
              {formData.avatar && (
                <img
                  src={formData.avatar}
                  alt="Selected Avatar"
                  className="w-10 h-10 rounded-full mb-2"
                />
              )}
              <button
                type="button"
                onClick={() => setShowAvatarModal(true)}
                className="font-parastoo px-4 py-2 text-base bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
              >
                Choose Your Avatar
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="font-gothic w-full bg-[#4CAF50] text-white py-2 px-4 rounded-md hover:bg-[#388E3C] transition duration-200 text-sm font-medium"
            >
              Register
            </button>

            {message && <p className="text-green-600 mt-2">{message}</p>}
            {error && <p className="text-red-600 mt-2">{error}</p>}
          </form>

          <div className="mt-6 text-center">
            <p className="font-parastoo text-gray-600 text-lg">
              Already have an account?{' '}
              <button onClick={() => navigate("/login")} className="font-gothic text-[#4CAF50] hover:text-[#388E3C] text-sm">
                Login here
              </button>
            </p>
          </div>
        </div>

        {/* Avatar Modal Popup */}
        {showAvatarModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
              <button
                onClick={() => setShowAvatarModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-lg"
              >
                &times;
              </button>
              <h3 className="font-parastoo text-xl text-gray-800 mb-4">Choose Your Avatar</h3>
              <div className="grid grid-cols-3 gap-4">
                {avatars.map((avatar, index) => (
                  <img
                    key={index}
                    src={avatar}
                    alt={`Avatar ${index + 1}`}
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, avatar }));
                      setShowAvatarModal(false);
                    }}
                    className={`w-16 h-16 rounded-full cursor-pointer hover:ring-2 hover:ring-blue-400 ${
                      formData.avatar === avatar ? 'ring-2 ring-blue-500' : ''
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
