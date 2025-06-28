import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import Cookies from "js-cookie";
import axios from "axios";
import { Menubar } from "./Menubar";

export function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBooksDropdownOpen, setIsBooksDropdownOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

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

  const handleLogout = async () => {
    try {
      await axios.post("/api/v1/users/logout", {}, { withCredentials: true });
      Cookies.remove("token");
      setIsAuthenticated(false);
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim() !== "") {
      try {
        const res = await axios.get(`/api/v1/books/search?query=${value}`);
        setSuggestions(res.data);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      navigate(`/search/${query}`);
      setSuggestions([]);
    }
  };

 
  return (
    <div className="font-sans">
      <nav className="bg-white/30 backdrop-blur-md text-black p-4 flex justify-between items-center relative">
        {/* logo + burger */}
        <div className="flex items-center">
          <button
            className="text-2xl md:hidden mr-4"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            &#9776;
          </button>
          <img src="/src/images/bookcart.png" alt="Logo" className="h-10" />
          <h1 className="font-adobe ml-3 text-4xl font-bold">BOOK CART</h1>
        </div>

        {/* centre links */}
        <div
          className={`md:flex gap-6 items-center ${
            isMobileMenuOpen
              ? "flex flex-col bg-white w-full absolute top-14 left-0 z-10 p-4"
              : "hidden"
          } md:flex-row`}
        >
          <Link to="/" className="font-gothic block px-4 py-2 font-semibold">
            HOME
          </Link>

          {/* BOOKS dropdown */}
          <div className="relative">
            <button
              className="font-gothic block px-4 py-2 font-semibold"
              onClick={() => setIsBooksDropdownOpen(!isBooksDropdownOpen)}
            >
              BOOKS ▼
            </button>
            {isBooksDropdownOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-white shadow-lg border border-gray-200 rounded-md z-20">
                <ul className="p-2">
                  {bookCategories.map((category) => (
                    <li key={category} className="px-4 py-2">
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
          <Link to="/sell" className="font-gothic block px-4 py-2 font-semibold">
            SELL
          </Link>
        </div>

        {/* right-hand auth area */}
<div className="flex items-center space-x-4 relative">
  {isAuthenticated && (
    <>
       {/* Desktop Search */}
              <div className="hidden md:flex flex-col relative">
                <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                  {/* Search icon */}
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 101.5 9a7.5 7.5 0 0015 0z"
                    ></path>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search for books..."
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="font-parastoo text-lg bg-gray-100 ml-2 outline-none"
                  />
                </div>
                {suggestions.length > 0 && (
                  <ul className="absolute top-12 left-0 w-full bg-white border border-gray-200 shadow-md z-50 rounded">
                    {suggestions.map((book) => (
                      <li
                        key={book._id}
                        className="px-4 py-2 text-gray-600"
                      >
                        {book.title}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

      {/* Search (Mobile) */}
      <div className="md:hidden">
        <button onClick={() => setShowMobileSearch(true)}>
          <svg
            className="w-6 h-6 text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 101.5 9a7.5 7.5 0 0015 0z"
            ></path>
          </svg>
        </button>
        {showMobileSearch && (
          <div className="fixed top-0 left-0 w-full h-full bg-white z-50 flex flex-col">
            <div className="flex p-4 items-center">
              <input
                autoFocus
                type="text"
                placeholder="Search for books..."
                className="flex-1 p-2 border border-gray-300 rounded"
              />
              <button
                className="ml-2 text-gray-500 font-bold"
                onClick={() => setShowMobileSearch(false)}
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )}

  {isAuthenticated ? (
    <Menubar onLogout={handleLogout} initial="M" />
  ) : (
    <button
      onClick={() => navigate("/login")}
      className="font-gothic flex items-center space-x-2 border-2 border-black text-black px-4 py-2 rounded-full font-bold hover:bg-gray-200 transition text-sm"
    >
      <span>Log&nbsp;In</span>
      <FaUser />
    </button>
  )}
</div>
      </nav>
    </div>
  );
}
