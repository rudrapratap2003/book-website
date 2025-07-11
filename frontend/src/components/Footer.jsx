import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-white p-6 text-gray-800">
      <div className="max-w-7xl mx-auto grid gap-10 sm:grid-cols-2 md:grid-cols-4">

        {/* Logo Section */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
          <img src="/images/bookcart.png" alt="Logo" className="w-16 h-16" />
          <span className="font-adobe font-bold text-4xl">Book Cart</span>
        </div>

        {/* Quick Links */}
        <div className="space-y-2">
          <h3 className="font-gothic font-semibold text-lg">Quick Links</h3>
          <ul className="space-y-1">
            <li><Link to="/" className="hover:text-orange-500">Home</Link></li>
            <li><Link to="/myprofile/wishlist" className="hover:text-orange-500">Wishlist</Link></li>
            <li><Link to="/cart" className="hover:text-orange-500">Cart</Link></li>
            <li><Link to="/sold-items" className="hover:text-orange-500">Sold Items</Link></li>
          </ul>
        </div>

        {/* Customer Area */}
        <div className="space-y-2">
          <h3 className="font-gothic font-semibold text-lg">Customer Area</h3>
          <ul className="space-y-1">
            <li><Link to="/myprofile" className="hover:text-orange-500">My Account</Link></li>
            <li><Link to="/orders" className="hover:text-orange-500">Orders</Link></li>
            <li><Link to="/terms" className="hover:text-orange-500">Terms</Link></li>
            <li><Link to="/privacy" className="hover:text-orange-500">Privacy Policy</Link></li>
            <li><Link to="/faq" className="hover:text-orange-500">FAQ</Link></li>
          </ul>
        </div>

        {/* Register Section */}
        <div className="space-y-2">
          <h3 className="font-gothic font-semibold text-lg">Don't Miss the Newest Books</h3>
          <p className="text-sm">Register now for the newest book updates!</p>
        </div>
      </div>
    </footer>
  );
};
