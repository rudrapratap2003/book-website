import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Signin = ({setIsAuthenticated}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
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

  const handleLogin = async (e) => {
    e.preventDefault();
    const payload = formData;

    try {
      const response = await axios.post('/api/v1/users/login',payload, {withCredentials: true});
      setMessage(response.data.message);
      setError('');
      setIsAuthenticated(true)
      navigate("/")
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
          src="/images/lady.png"
          alt="Signup Visual"
          className="max-w-full h-auto"
        />
      </div>

      <div className="md:w-1/2 w-full bg-white flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <h2 className="font-gothic text-2xl font-bold text-gray-800 mb-4">LogIn Here</h2>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="font-parastoo block text-gray-700 mb-1 text-lg" htmlFor="identifier">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="font-parastoo w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="font-parastoo block text-gray-700 mb-1 text-lg" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="font-parastoo w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
                placeholder="Enter your password"
              />
            </div>

            <button type="submit" className="font-gothic w-full bg-[#4CAF50] text-white py-2 px-4 rounded-md hover:bg-[#388E3C] transition duration-200 text-sm font-medium">Login</button>
            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
          </form>

          <div className="mt-6 text-center">
            <p className="font-parastoo text-gray-600 text-lg">
              Don't have an account?{' '}
              <button onClick={() => navigate("/signup")} className="font-gothic text-[#4CAF50] hover:text-[#388E3C] text-sm">
                Register here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
