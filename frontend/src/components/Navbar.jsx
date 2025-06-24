import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import Cookies from "js-cookie";
import axios from "axios";
import { Menubar } from "./Menubar";

export function Navbar({ isAuthenticated, setIsAuthenticated }) {
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

          <Link to="/exchange" className="block px-4 py-2 font-semibold">
            EXCHANGE
          </Link>
          <Link to="/sell" className="block px-4 py-2 font-semibold">
            SELL
          </Link>
        </div>

        {/* right-hand auth area */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <Menubar
              onLogout={handleLogout}
              initial="M" // substitute user initial if you have it
            />
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
