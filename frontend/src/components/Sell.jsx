import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Sell = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bookname: "",
    author: "",
    description: "",
    price: "",
    count: "",
    category: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
    
  const payload = {
    bookname: formData.bookname,
    author: formData.author,
    description: formData.description,
    price: formData.price,
    count: formData.count,
    category: formData.category,
    // image is excluded since backend does not handle it
  };

  try {
    const response = await axios.post(
      "/api/v1/books/sell-book",
      payload,
      {
        withCredentials: true, // needed if using cookies/session
      }
    );
    alert(response.data.message || "Book submitted successfully!");

    const category = response.data.data.category;
    navigate(`/category/${category}`)

    setFormData({
      bookname: "",
      author: "",
      description: "",
      price: "",
      count: "",
      category: "",
      image: null,
    });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Something went wrong";
    alert(errorMessage);
  }
};


  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2 bg-[#fdf1e5] p-6 sm:p-8 md:p-10 relative flex items-start justify-center">
        <img
          src="/src/images/leaves-clipart.png"
          alt="Decorative Clipart"
          className="absolute top-4 left-4 w-12 h-12 sm:w-16 sm:h-16"
        />

        <div className="w-full max-w-md mt-16 sm:mt-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-left text-[#1c3b2f] mb-6">
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
              className="w-full border-b-2 border-[#1c3b2f] bg-transparent py-2 focus:outline-none placeholder-gray-600"
            />
            <input
              type="text"
              name="author"
              placeholder="Author"
              value={formData.author}
              onChange={handleChange}
              required
              className="w-full border-b-2 border-[#1c3b2f] bg-transparent py-2 focus:outline-none placeholder-gray-600"
            />
            <textarea
              name="description"
              placeholder="Book Description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              required
              className="w-full border-b-2 border-[#1c3b2f] bg-transparent py-2 focus:outline-none placeholder-gray-600 resize-none"
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full border-b-2 border-[#1c3b2f] bg-transparent py-2 focus:outline-none placeholder-gray-600"
            />
            <input
              type="number"
              name="count"
              placeholder="Number of Books"
              value={formData.count}
              onChange={handleChange}
              required
              className="w-full border-b-2 border-[#1c3b2f] bg-transparent py-2 focus:outline-none placeholder-gray-600"
            />

            <div>
              <label className="block text-[#1c3b2f] mb-1 font-medium">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full border-b-2 border-[#1c3b2f] bg-transparent py-2 focus:outline-none text-gray-700"
              >
                <option value="" disabled>
                  Select category
                </option>
                <option value="Young & Teen Fiction">Young & Teen Fiction</option>
                <option value="Romantic">Romantic</option>
                <option value="Cooking">Cooking</option>
                <option value="Mystery">Mystery</option>
                <option value="Fiction">Fiction</option>
                <option value="Biography">Biography</option>
                <option value="Children">Children</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-[#1c3b2f] text-white px-6 py-2 rounded-full hover:bg-[#163025] transition w-full"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      <div className="w-full lg:w-1/2 bg-[#7b66b4] flex items-center justify-center p-6 sm:p-12">
        <img
          src="/src/images/flower.png"
          alt="Illustration"
          className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg object-contain"
        />
      </div>
    </div>
  );
};

export default Sell;
