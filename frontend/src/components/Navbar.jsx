import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { HiOutlineSearch, HiOutlineX } from "react-icons/hi";
import Cookies from "js-cookie";
import axios from "axios";
import { Menubar } from "./Menubar";

export function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [booksOpen, setBooksOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [user, setUser] = useState(null);


  useEffect(() => {
    if (!isAuthenticated) return setUser(null);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/users/myprofile`, { withCredentials: true })
      .then((res) => setUser(res.data.data))
      .catch((err) => console.error("Fetch user failed:", err));
  }, [isAuthenticated]);

  /* ──────────────────────  PREVENT SCROLL WHEN SIDEBAR OPEN  ────────────── */
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  /* ─────────────────────────────  HANDLERS  ─────────────────────────────── */
  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/users/logout`, {}, { withCredentials: true });
      Cookies.remove("token");
      setIsAuthenticated(false);
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleSearchChange = async (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim() === "") return setSuggestions([]);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/books/search?query=${val}`);
      setSuggestions(res.data);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  const handleSearchEnter = (e) => {
    if (e.key === "Enter") {
      navigate(`/search/${query}`);
      setSuggestions([]);
    }
  };

  /* ─────────────────────────────  RENDER  ──────────────────────────────── */
  return (
    <nav className="bg-white/30 backdrop-blur-md text-black p-4 font-sans relative z-50">
      {/* ────────── TOP BAR ────────── */}
      <div className="flex justify-between items-center">
        {/* Logo + Hamburger */}
        <div className="flex items-center">
          <button
            className="md:hidden text-2xl mr-4 z-50 relative"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
          <img src="/images/bookcart.png" alt="Logo" className="h-6 sm:h-10" />
          <h1 className="font-adobe ml-3 text-md sm:text-3xl font-bold">BOOK CART</h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center font-gothic">
          <Link to="/">HOME</Link>
          <Link to="/books">BOOKS</Link>  
          <Link to="/sell">SELL</Link>
        </div>

        {/* Search + Auth */}
        <div className="flex items-center gap-4 relative">
          {/* Desktop Search */}
          {isAuthenticated && (
            <div className="hidden md:flex flex-col relative">
              <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                <HiOutlineSearch className="w-6 h-6 text-black" />
                <input
                  type="text"
                  value={query}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchEnter}
                  placeholder="Search for books..."
                  className="bg-gray-100 ml-2 outline-none text-lg"
                />
              </div>
              {suggestions.length > 0 && (
                <ul className="absolute top-12 bg-white w-full border shadow z-50 rounded">
                  {suggestions.map((book) => (
                    <li key={book._id} className="px-4 py-2 text-gray-600">
                      {book.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Mobile Search */}
          {isAuthenticated && (
  <div className="md:hidden">
    <button onClick={() => setMobileSearchOpen(true)}>
      <HiOutlineSearch className="w-6 h-6 text-black" />
    </button>
    {mobileSearchOpen && (
      <div className="fixed top-0 left-0 w-full h-full bg-white z-50 p-4">
        <div className="flex items-center mb-4">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={handleSearchChange}
            onKeyDown={handleSearchEnter}
            className="flex-1 p-2 border border-gray-300 rounded"
            placeholder="Search books..."
          />
          <button
            className="ml-2 text-black text-2xl"
            onClick={() => setMobileSearchOpen(false)}
          >
            <HiOutlineX />
          </button>
        </div>
        {suggestions.length > 0 && (
          <ul className="border rounded shadow bg-white">
            {suggestions.map((book) => (
              <li key={book._id} className="px-4 py-2 text-gray-600">
                {book.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    )}
  </div>
)}


          {/* Auth Buttons */}
          {isAuthenticated ? (
            <Menubar onLogout={handleLogout} user={user} />
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 border-2 border-black px-2 sm:px-4 py-1 sm:py-2 rounded-full font-bold text-xs sm:text-sm hover:bg-gray-200"
            >
              <span>Log In</span> <FaUser />
            </button>
          )}
        </div>
      </div>

      {/* ────────── MOBILE SIDEBAR ────────── */}
      <div
        className={`fixed top-0 left-0 h-screen w-2/5 max-w-[240px] bg-yellow-50 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="pt-16 px-6 font-gothic">
          <Link
            to="/"
            className="block py-3 border-b"
            onClick={() => setMobileMenuOpen(false)}
          >
            HOME
          </Link>

          <Link
            to="/books"
            className="block py-3 border-b"
            onClick={() => setMobileMenuOpen(false)}
          >
            BOOKS
          </Link>

          <Link
            to="/sell"
            className="block py-3 border-b"
            onClick={() => setMobileMenuOpen(false)}
          >
            SELL
          </Link>
        </div>
      </div>
    </nav>
  );
}
