import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const RouteTitle = () => {
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case "/":
        document.title = "Book Cart";
        break;
      case "/login":
        document.title = "Login Page - Book Cart";
        break;
      case "/signup":
        document.title = "SignUp Page - Book Cart";
        break;
     case "/sell":
        document.title = "Sell Form Page - Book Cart";
        break;
        case "/sold-items":
        document.title = "Items Sold by user Page - Book Cart";
        break;
        case "/myprofile":
        document.title = "User profile page - Book Cart";
        break;
        case "/search":
        document.title = "Search Results - Book Cart";
        break;
        case "/settings":
        document.title = "User profile page changes settings page - Book Cart";
        break;
        case "/address":
        document.title = "Manage addresses for users page - Book Cart";
        break;
        case "/orders":
        document.title = "My Orders - Book Cart";
        break;
        case "/myprofile/wishlist":
        document.title = "Users wishlist page - Book Cart";
        break;
        case "/myprofile/cart":
        document.title = "Items in cart page- Book Cart";
        break;
      default:
        document.title = "Book Cart";
    }
  }, [location.pathname]);

  return null;
};

export default RouteTitle;
