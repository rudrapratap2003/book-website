import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBooksDropdownOpen, setIsBooksDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const bookCategories = [
    "Art & Photography",
    "Biographies & Memoirs",
    "Dictionaries & Language",
    "Literature & Literary Studies",
    "English Language Teaching",
    "Fiction",
    "References & Encyclopedias",
    "History & Humanities",
    "Society & Social Sciences",
    "Business & Economics",
    "Law",
    "Medicine",
    "Science & Mathematics",
    "Environment & Geography",
    "Technology & Engineering",
  ];

  return (
    <div className="font-sans">
      <nav className="bg-white/30 backdrop-blur-md text-black p-4 flex justify-between items-center relative">
        {/* Left: Logo and Menu */}
        <div className="flex items-center">
          <button
            className="text-2xl md:hidden mr-4"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            &#9776;
          </button>
          <img src="/src/images/bookcart.png" alt="Logo" className="h-10" />
          <h1 className="ml-3 text-xl font-bold">BOOK CART</h1>
        </div>

        {/* Middle: Navigation */}
        <div
          className={`md:flex gap-6 items-center ${
            isMobileMenuOpen
              ? "flex flex-col bg-white w-full absolute top-14 left-0 z-10 p-4"
              : "hidden"
          } md:flex-row`}
        >
          <Link to="/" className="block px-4 py-2 font-semibold">
            HOME
          </Link>

          <div className="relative">
            <button
              className="block px-4 py-2 font-semibold"
              onClick={() => setIsBooksDropdownOpen(!isBooksDropdownOpen)}
            >
              BOOKS ▼
            </button>
            {isBooksDropdownOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-white shadow-lg border border-gray-200 rounded-md z-20">
                <ul className="p-2">
                  {bookCategories.map((category, index) => (
                    <li key={index} className="px-4 py-2 hover:bg-gray-100 rounded">
                      <Link
                        to={`/category/${category
                          .toLowerCase()
                          .replace(/ & /g, "-")
                          .replace(/ /g, "-")}`}
                        onClick={() => setIsBooksDropdownOpen(false)}
                      >
                        {category}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <Link to="/sell" className="block px-4 py-2 font-semibold">
            SELL
          </Link>
        </div>

        {/* Right: Login only */}
        <div className="flex items-center space-x-4">
          <button
            className="flex items-center space-x-2 border-2 border-black text-black px-4 py-2 rounded-full font-bold hover:bg-gray-200 transition"
            onClick={() => navigate("/login")}
          >
            <span>Log In</span>
            <FaUser />
          </button>
        </div>
      </nav>
    </div>
  );
};
