import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "tailwindcss/tailwind.css";
import { Home } from "./components/Home";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { CategoryPage } from "./components/CategoryPage";
import Sell from "./components/Sell";
import SignUp from "./components/SignUp";
import Signin from "./components/Signin";
import RefreshHandler from "./components/RefreshHandler";
import MyProfile from "./components/MyProfile";
import WishlistPage from "./components/WishlistPage";
import SoldItems from "./components/SoldItems";
import Cart from "./components/Cart";
import MyOrders from "./components/MyOrders";
import Search from "./components/Search";
import SettingsPage from "./components/SettingsPage";
import AddressSettings from "./components/AddressSettings";
import AdminDashboard from "./components/AdminDashboard";
import RouteTitle from "./components/RouteTitle";
import Books from "./components/Books";
const books = [
  { 
    id: 1, 
    title: "The 48 Laws Of Power", 
    author: "Robert Greene", 
    price: 659, 
    originalPrice: 999, 
    image: "src/images/48lawws.png",
    rating: 4

  },
  { 
    id: 2, 
    title: "My First Library", 
    author: "Wonder House", 
    price: 524, 
    originalPrice: 749, 
    image: "src/images/myfirst.jpg",
    rating: 5
  },
  { 
    id: 3, 
    title: "Harry Potter Box Set", 
    author: "J.K. Rowling", 
    price: 3069, 
    originalPrice: 4950, 
    image: "src/images/harrypotter.jpg",
    rating: 5
  },
  { 
    id: 4, 
    title: "The Psychology of Money", 
    author: "Morgan Housel", 
    price: 1016, 
    originalPrice: 1782, 
    image: "src/images/money3.jpg",
    rating: 4,
    description: "The Psychology of Money is the original bestselling classic from the author of the new book, Same as Ever.Doing well with money isn't necessarily about what you know. It's about how you behave. And behavior is hard to teach, even to really smart people.Money--investing, personal finance, and business decisions--is typically taught as a math-based field, where data and formulas tell us exactly what to do. But in ..."

  },
  { 
    id: 5, 
    title: "The Satanic Verses", 
    author: "Salman Rushdie", 
    price: 1350, 
    originalPrice: null, 
    image: "src/images/satanic_verses_0.jpg",
    rating: 3
  },
];


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const PrivateRoute = ({element, allowedRoles}) => {
    if(isAuthenticated == null) return null;
    if (allowedRoles && !allowedRoles.includes(isAuthenticated.role)) return <Navigate to="/" replace />;
    return element;
  }
  return (
    <Router>  
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
      <RouteTitle />
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>
      <Routes>
        <Route path="/" element={<Home isAuthenticated={isAuthenticated}/>}/>
        <Route path="/login"
          element={
            !isAuthenticated ? <Signin setIsAuthenticated={setIsAuthenticated}/> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/signup"
          element={
            !isAuthenticated ? <SignUp setIsAuthenticated={setIsAuthenticated}/> : <Navigate to="/" replace />
          }
        />
       
        <Route path="/category/:categoryName" element={<PrivateRoute element={<CategoryPage />}/>}/>
        <Route path="/sell" element={<PrivateRoute element={<Sell />}/>}/>
        <Route path="/books" element={<PrivateRoute element={<Books />}/>}/>
        <Route path="/myprofile" element={<PrivateRoute element={<MyProfile />}/>}/>
        <Route path="/sold-items" element={<PrivateRoute element={<SoldItems />}/>}/>
        <Route path="/myprofile/cart" element={<PrivateRoute element={<Cart />}/>}/>
        <Route path="/myprofile/orders" element={<PrivateRoute element={<MyOrders />}/>}/>
        <Route path="/myprofile/wishlist" element={<PrivateRoute element={<WishlistPage />}/>}/>
        <Route path="/search/:query" element={<PrivateRoute element={<Search />}/>}/>
        <Route path="/settings" element={<PrivateRoute element={<SettingsPage />}/>}/>
        <Route path="/admin/dashboard" element={<PrivateRoute element={<AdminDashboard />} allowedRoles={["admin"]}/>} />
        <Route path="/address" element={<PrivateRoute element={<AddressSettings />}/>}/>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
