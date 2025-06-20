import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    username: '',
    password: ''
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Toggle between Login and Register forms
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    const payload = {
      identifier: formData.email || formData.username,
      password: formData.password
    };

    try {
      const res = await fetch('/api/v1/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        console.log('Login Successful:', data);
        navigate('/choose'); // Navigate after login
      } else {
        console.error('Error:', data.message || 'Login failed');
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Network Error:', error);
      alert('Network error, please try again later.');
    }
  };

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    const payload = formData;

    try {
      const res = await fetch('/api/v1/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        console.log('Registration Successful:', data);
        alert('Registered successfully!');
        setIsLogin(true); // Switch to login after successful registration
      } else {
        console.error('Error:', data.message || 'Registration failed');
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Network Error:', error);
      alert('Network error, please try again later.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f5f5f5]">
      {/* Left side */}
      <div className="md:w-1/2 w-full bg-[#e0e0e0] flex items-center justify-center p-4">
        <img
          src="/src/images/lady.png"
          alt="Signup Visual"
          className="max-w-full h-auto"
        />
      </div>

      {/* Right side */}
      <div className="md:w-1/2 w-full bg-white flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {isLogin ? 'Sign up here' : 'Please create an account'}
          </h2>
          <p className="text-gray-600 mb-6">
            {isLogin
              ? 'Enter your email ID or username and password'
              : 'Give your credentials to register'}
          </p>

          <form className="space-y-4" onSubmit={isLogin ? handleLogin : handleRegister}>
            {!isLogin && (
              <>
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
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
                    placeholder="Enter your phone number"
                  />
                </div>
              </>
            )}

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
                required={isLogin}
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

            <button
              type="submit"
              className="w-full bg-[#4CAF50] text-white py-2 px-4 rounded-md hover:bg-[#388E3C] transition duration-200 text-sm font-medium"
            >
              {isLogin ? 'Login' : 'Register'}
            </button>
          </form>

          <div className="mt-6 text-center">
            {isLogin ? (
              <p className="text-gray-600 text-sm">
                Don't have an account?{' '}
                <button onClick={toggleForm} className="text-[#4CAF50] hover:text-[#388E3C] font-medium">
                  Register here
                </button>
              </p>
            ) : (
              <p className="text-gray-600 text-sm">
                Already have an account?{' '}
                <button onClick={toggleForm} className="text-[#4CAF50] hover:text-[#388E3C] font-medium">
                  Login here
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
