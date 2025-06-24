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
          <h1 className="ml-3 text-xl font-bold">BOOK CART</h1>
        </div>

        {/* centre links */}
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

          {/* BOOKS dropdown */}
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
          <Link to="/sell" className="block px-4 py-2 font-semibold">
            SELL
          </Link>
        </div>

        {/* right-hand auth area */}
<div className="flex items-center space-x-4 relative">
  {isAuthenticated && (
    <>
      {/* Search (Desktop) */}
      <div className="hidden md:flex items-center bg-gray-100 px-3 py-1 rounded-full">
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
          className="bg-gray-100 ml-2 outline-none"
        />
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

      {/* Wishlist Icon */}
      <button onClick={() => navigate("/myprofile/wishlist")} className="hidden md:inline-flex">
        <svg
          className="w-6 h-6 text-black"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      {/* Cart Icon */}
      <button onClick={() => navigate("/cart")} className="hidden md:inline-flex relative">
        <svg
          className="w-6 h-6 text-black"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m1-13h.01"
          />
        </svg>
      </button>
    </>
  )}

  {isAuthenticated ? (
    <Menubar onLogout={handleLogout} initial="M" />
  ) : (
    <button
      onClick={() => navigate("/login")}
      className="flex items-center space-x-2 border-2 border-black text-black px-4 py-2 rounded-full font-bold hover:bg-gray-200 transition text-sm"
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
