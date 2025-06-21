import { useState } from "react";

const Sell = () => {
  const [formData, setFormData] = useState({
    bookName: "",
    author: "",
    description: "",
    price: "",
    quantity: "",
    image: null,
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
    const formDataToSend = new FormData();
    for (let key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await fetch("http://localhost:5000/api/books", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Book posted successfully!");
        setFormData({
          bookName: "",
          author: "",
          description: "",
          price: "",
          quantity: "",
          image: null,
        });
      } else {
        alert("Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side: Form */}
      <div className="w-full lg:w-1/2 bg-[#fdf1e5] p-6 sm:p-8 md:p-10 relative flex items-start justify-center">
        {/* Clipart Image in top-left corner */}
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
              name="bookName"
              placeholder="Book Name"
              value={formData.bookName}
              onChange={handleChange}
              className="w-full border-b-2 border-[#1c3b2f] bg-transparent py-2 focus:outline-none placeholder-gray-600"
              required
            />
            <input
              type="text"
              name="author"
              placeholder="Author"
              value={formData.author}
              onChange={handleChange}
              className="w-full border-b-2 border-[#1c3b2f] bg-transparent py-2 focus:outline-none placeholder-gray-600"
              required
            />
            <textarea
              name="description"
              placeholder="Book Description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full border-b-2 border-[#1c3b2f] bg-transparent py-2 focus:outline-none placeholder-gray-600 resize-none"
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border-b-2 border-[#1c3b2f] bg-transparent py-2 focus:outline-none placeholder-gray-600"
              required
            />
            <input
              type="number"
              name="quantity"
              placeholder="Number of Books"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full border-b-2 border-[#1c3b2f] bg-transparent py-2 focus:outline-none placeholder-gray-600"
              required
            />
            <div>
              <label className="block text-[#1c3b2f] mb-1 font-medium">
                Give an image of your book
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full border-b-2 border-[#1c3b2f] py-2 bg-transparent text-gray-700 focus:outline-none"
                required
              />
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

      {/* Right Side: Illustration */}
      <div className="w-full lg:w-1/2 bg-[#7b66b4] flex items-center justify-center p-6 sm:p-12">
        <img
          src="/src/images/flower.png"
          alt="Paper Plane"
          className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg object-contain"
        />
      </div>
    </div>
  );
};

export default Sell;
