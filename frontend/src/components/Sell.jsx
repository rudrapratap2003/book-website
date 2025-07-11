import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import Loader from "../components/Loader"; // 🔁 Update path if needed

const Sell = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bookname: "",
    author: "",
    description: "",
    price: "",
    count: "",
    category: "",
    bookImage: null,
  });

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "bookImage") {
      setFormData({ ...formData, bookImage: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    form.append("bookname", formData.bookname);
    form.append("author", formData.author);
    form.append("description", formData.description);
    form.append("price", formData.price);
    form.append("count", formData.count);
    form.append("category", formData.category);
    form.append("bookImage", formData.bookImage);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/books/sell-book`, form, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/sold-items");
      }, 3000);

      setFormData({
        bookname: "",
        author: "",
        description: "",
        price: "",
        count: "",
        category: "",
        bookImage: null,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      console.log(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf1e5] flex items-center justify-center py-10 px-4">
      {loading && <Loader />}

      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white border-2 border-green-500 rounded-xl shadow-lg p-6 relative w-80 text-center">
            <button
              onClick={() => setShowSuccess(false)}
              className="absolute top-2 right-2 text-gray-600 text-xl"
            >
              <IoClose />
            </button>
            <FaCheckCircle className="text-green-600 text-3xl mx-auto mb-2" />
            <p className="text-black font-semibold text-lg mb-4">
              Book Submitted Successfully!
            </p>
            <img
              src="/images/book-sell.png"
              alt="Book-sell"
              className="w-20 h-20 mx-auto"
            />
          </div>
        </div>
      )}

      {/* White Box Wrapper */}
      <div className="bg-white rounded-3xl shadow-xl flex flex-col lg:flex-row w-full max-w-7xl overflow-hidden">
        
        {/* Left Form Section */}
        <div className="w-full lg:w-1/2 p-6 sm:p-8 md:p-10 flex items-start justify-center">
          <div className="w-full max-w-md mt-6 sm:mt-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-left text-blue-950 mb-6">
              Give your book details
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                name="bookname"
                placeholder="Book Name"
                value={formData.bookname}
                onChange={handleChange}
                required
                className="font-parastoo w-full border-b-2 border-blue-950 bg-transparent py-2 focus:outline-none placeholder-gray-600"
              />
              <input
                type="text"
                name="author"
                placeholder="Author"
                value={formData.author}
                onChange={handleChange}
                required
                className="font-parastoo w-full border-b-2 border-blue-950 bg-transparent py-2 focus:outline-none placeholder-gray-600"
              />
              <textarea
                name="description"
                placeholder="Book Description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                required
                className="font-parastoo w-full border-b-2 border-blue-950 bg-transparent py-2 focus:outline-none placeholder-gray-600 resize-none"
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                required
                className="font-parastoo w-full border-b-2 border-blue-950 bg-transparent py-2 focus:outline-none placeholder-gray-600"
              />
              <input
                type="number"
                name="count"
                placeholder="Number of Books"
                value={formData.count}
                onChange={handleChange}
                required
                className="font-parastoo w-full border-b-2 border-blue-950 bg-transparent py-2 focus:outline-none placeholder-gray-600"
              />
              <div>
                <label className="font-gothic block text-blue-950 mb-1 font-medium">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="font-parastoo w-full border-b-2 border-blue-950 bg-transparent py-2 focus:outline-none text-gray-700"
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  <option value="Romantic">Romantic</option>
                  <option value="Cooking">Cooking</option>
                  <option value="Mystery">Mystery</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Biography">Biography</option>
                  <option value="Children">Children</option>
                  <option value="Comics">Comics</option>
                  <option value="Tarot">Tarot</option>
                  <option value="Literature">Literature</option>
                  <option value="Encyclopedia">Encyclopedia</option>
                  <option value="History">History</option>
                  <option value="Social Science">Social Science</option>
                  <option value="Business">Business</option>
                   <option value="Law">Law</option>
                  <option value="Medicine">Medicine</option>
                  <option value="Science">Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Environment">Environment</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Family">Family</option>
                  <option value="Cooking">Cooking</option>
                  <option value="Mystery">Mystery</option>
                  <option value="Horror">Horror</option>
                  <option value="Romantic">Romantic</option>
                </select>
              </div>

              <div>
                <label className="font-gothic block text-blue-950 mb-1 font-medium">
                  Upload Book Image
                </label>
                <input
                  type="file"
                  name="bookImage"
                  accept="image/*"
                  onChange={handleChange}
                  required
                  className="font-parastoo w-full py-2 text-gray-700"
                />
              </div>

              <button
                type="submit"
                className="font-gothic bg-blue-950 text-white px-6 py-2 rounded-full hover:bg-blue-900 transition w-full"
              >
                Submit
              </button>
            </form>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
          <img
            src="/images/finalsale.png"
            alt="Illustration"
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Sell;
