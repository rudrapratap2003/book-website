import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Loader from "../components/Loader";

export const Home = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const categories = [
    { id: 1, name: "Young and Teen", image: "/images/yt.png" },
    { id: 2, name: "Fiction", image: "/images/fiction.png" },
    { id: 3, name: "Romantic", image: "/images/romm.png" },
    { id: 4, name: "Cooking", image: "/images/cook.png" },
  ];
  if (loading) return <Loader />;
  return (
    <>
      {/* HERO SECTION */}
      <div className="bg-orange-50 min-h-screen flex items-center justify-center px-2 sm:px-4">
        <div className="bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row items-start justify-between w-full max-w-[90%] h-auto p-6 md:p-16">
          <div className="md:w-1/2 flex flex-col justify-center">
            <h2 className="font-gothic text-3xl md:text-4xl font-bold mb-6 text-black">
              The Store that Feeds Your Mind. Visit Us Today!!
            </h2>
            <p className="font-parastoo text-lg md:text-xl text-gray-800 mb-8">
              Your one-stop shop for books of every genre! Where you can browse, buy, and sell books in minutes!
            </p>
            {isAuthenticated ? (
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <button
                  onClick={() => navigate("/myprofile/wishlist")}
                  className="font-gothic text-pink-600 border border-pink-500 px-4 py-1 rounded-full font-semibold hover:bg-pink-100"
                >
                  ❤️ Wishlist
                </button>
                <button
                  onClick={() => navigate("/myprofile/cart")}
                  className="font-gothic text-blue-600 border border-blue-500 px-4 py-1 rounded-full font-semibold hover:bg-blue-100"
                >
                  🛒 Cart
                </button>
              </div>
            ) : (
              <div className="text-left">
                <button
                  onClick={() => navigate("/login")}
                  className="font-gothic bg-orange-500 text-white text-sm font-medium px-3 py-2 rounded hover:bg-orange-600 transition"
                >
                  Explore Now →
                </button>
              </div>
            )}
          </div>
          <div className="md:w-1/2 flex justify-center mt-6 md:mt-0">
            <img
              src="/images/bookpage.png"
              alt="Books"
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      {isAuthenticated && (
        <>
         
          {/* SHOP BY CATEGORY */}
          <div id="categories" className="p-8 bg-orange-50">
            <h2 className="font-gothic text-3xl font-bold mb-6 text-center">Shop By Category</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <div
                  key={category.id}
                  className="flex items-center p-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
                  style={{
                    background: `linear-gradient(to left, ${
                      index === 0
                        ? "#ff9a9e"
                        : index === 1
                        ? "#a1c4fd"
                        : index === 2
                        ? "#fbc2eb"
                        : "#d4fc79"
                    }, ${
                      index === 0
                        ? "#ff6a88"
                        : index === 1
                        ? "#c2e9fb"
                        : index === 2
                        ? "#a6c1ee"
                        : "#96e6a1"
                    })`,
                  }}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-16 h-16 object-cover rounded-full mr-4"
                  />
                  <h3 className="font-parastoo text-2xl font-semibold text-gray-800">{category.name}</h3>
                </div>
              ))}
            </div>
          </div>

          {/* EXCHANGE SECTION */}
          <div id="exchange" className="p-8 bg-orange-50 flex flex-col items-center">
            <div className="bg-white bg-opacity-90 p-8 rounded-3xl shadow-lg w-full">
              <div className="w-full flex flex-col md:flex-row justify-between items-center">
                <div className="md:w-1/2 pr-6">
                  <h3 className="font-gothic text-3xl sm:text-4xl font-bold mb-4">Buy or Sell any book of your choice</h3>
                  <p className="font-gothic text-xl sm:text-2xl font-semibold mb-2">Give your books countless lives by selling !!</p>
                  <p className="font-edu font-medium text-base italic">Buy all trendy books.</p>
                </div>
                <div className="md:w-1/2 flex justify-center items-center mt-6 md:mt-0">
                  <img src="/images/exch1.png" alt="Books Exchange" className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
