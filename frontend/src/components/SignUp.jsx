import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from "axios";


const SignUp = () => {
  const navigate = useNavigate();
  if (localStorage.getItem("isLoggedIn") === "true") {

}
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNo: '',
    username: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const payload = formData;

    try {
      const response = await axios.post('/api/v1/users/register',payload, {withCredentials: true});
      setMessage(response.data.message);
      setError('');
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Something went wrong";
        setError(errorMessage);
        setMessage('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f5f5f5]">
      <div className="md:w-1/2 w-full bg-[#e0e0e0] flex items-center justify-center p-4">
        <img
          src="/src/images/lady.png"
          alt="Signup Visual"
          className="max-w-full h-auto"
        />
      </div>

      <div className="md:w-1/2 w-full bg-white flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Please create an account</h2>
          <p className="text-gray-600 mb-6">Give your credentials to register</p>
          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label className="block text-gray-700 mb-1 text-sm" htmlFor="fullName">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 text-sm" htmlFor="phone">
                Phone Number
              </label>
              <input
                id="phoneNo"
                name="phoneNo"
                type="tel"
                value={formData.phoneNo}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 text-sm" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
                placeholder="Enter your email ID"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 text-sm" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 text-sm" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
                placeholder="Enter your password"
              />
            </div>

            <button type="submit" className="w-full bg-[#4CAF50] text-white py-2 px-4 rounded-md hover:bg-[#388E3C] transition duration-200 text-sm font-medium">Register</button>
            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <button onClick={() => navigate("/login")} className="text-[#4CAF50] hover:text-[#388E3C] font-medium">
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
