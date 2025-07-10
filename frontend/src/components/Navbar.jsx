import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
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
    axios.get("/api/v1/users/myprofile", { withCredentials: true })
      .then(res => setUser(res.data.data))
      .catch(err => console.error("Fetch user failed:", err));
  }, [isAuthenticated]);

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

  const handleSearchChange = async (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim() === "") return setSuggestions([]);
    try {
      const res = await axios.get(`/api/v1/books/search?query=${val}`);
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

  return (
    <nav className="bg-white/30 backdrop-blur-md text-black p-4 font-sans relative">
      {/* Top Bar */}
      <div className="flex justify-between items-center">
        {/* Left: Logo + Menu */}
        <div className="flex items-center">
          <button className="md:hidden text-2xl mr-4" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>&#9776;</button>
          <img src="/images/bookcart.png" alt="Logo" className="h-10" />
          <h1 className="font-adobe ml-3 text-3xl font-bold">BOOK CART</h1>
        </div>

        {/* Center: Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center font-gothic">
          <Link to="/">HOME</Link>
          <Link to="/books">BOOKS</Link>  
          <Link to="/sell">SELL</Link>
        </div>

        {/* Right: Auth + Search */}
        <div className="flex items-center gap-4 relative">
          {/* Desktop Search */}
          {isAuthenticated && (
            <div className="hidden md:flex flex-col relative">
              <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 101.5 9a7.5 7.5 0 0015 0z" />
                </svg>
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
                  {suggestions.map(book => (
                    <li key={book._id} className="px-4 py-2 text-gray-600">{book.title}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Mobile Search */}
          {isAuthenticated && (
            <div className="md:hidden">
              <button onClick={() => setMobileSearchOpen(true)}>
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 101.5 9a7.5 7.5 0 0015 0z" />
                </svg>
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
                    <button className="ml-2 text-xl" onClick={() => setMobileSearchOpen(false)}>✕</button>
                  </div>
                  {suggestions.length > 0 && (
                    <ul className="border rounded shadow bg-white">
                      {suggestions.map(book => (
                        <li key={book._id} className="px-4 py-2 text-gray-600">{book.title}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Auth buttons */}
          {isAuthenticated ? (
            <Menubar
              onLogout={handleLogout}
              avatar={user?.avatar}
              initial={user?.fullName?.[0]?.toUpperCase()}
              role={user?.role}
            />
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 border-2 border-black px-4 py-2 rounded-full font-bold text-sm hover:bg-gray-200"
            >
              <span>Log In</span> <FaUser />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 space-y-2 font-gothic">
          <Link to="/" className="block px-4 py-2">HOME</Link>
          <button className="block px-4 py-2" onClick={() => setBooksOpen(!booksOpen)}>BOOKS ▼</button>
          {booksOpen && (
            <div className="pl-4">
              {categories.map(cat => (
                <Link
                  key={cat}
                  to={`/category/${cat.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
                  className="block py-1"
                  onClick={() => {
                    setBooksOpen(false);
                    setMobileMenuOpen(false);
                  }}
                >
                  {cat}
                </Link>
              ))}
            </div>
          )}
          <Link to="/sell" className="block px-4 py-2">SELL</Link>
        </div>
      )}
    </nav>
  );
}
