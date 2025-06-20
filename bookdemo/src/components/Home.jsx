import { useNavigate } from "react-router-dom";

export const Home = () => {
  const categories = [
    {
      id: 1,
      name: "Young and Teen",
      image: "/src/images/yt.png",
    },
    {
      id: 2,
      name: "Fiction",
      image: "/src/images/fiction.png",
    },
    {
      id: 3,
      name: "Romantic",
      image: "/src/images/romm.png",
    },
    {
      id: 4,
      name: "Cooking",
      image: "/src/images/cook.png",
    },
  ];

  const handleExploreClick = () => {
    // logic to open login modal or navigate to login
    alert("Please login to continue.");
  };

  const navigate = useNavigate();

  return (
    <>
      <div
        id="home"
        className="bg-orange-50 min-h-screen flex items-center justify-center px-2 sm:px-4"
      >
        <div className="bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row items-start justify-between w-full max-w-[90%] h-auto p-6 md:p-16">
          <div className="md:w-1/2 flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">
              The Store that Feeds Your Mind. Visit Us Today!!
            </h2>
            <p className="text-base md:text-lg text-gray-700 mb-8">
              Your one-stop shop for books of every genre! Where you can browse, buy, and sell books in minutes!
            </p>
            <div className="text-left">
      <button
        onClick={() => navigate("/signup")}
        className="bg-orange-500 text-white text-sm font-medium px-3 py-2 rounded hover:bg-orange-600 transition"
      >
        Explore Now →
      </button>
    </div>


          </div>

          <div className="md:w-1/2 flex justify-center">
            <img
              src="/src/images/bookpage.png"
              alt="Books"
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      <div
        id="best-sales"
        className="p-6 sm:p-8 bg-orange-50"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Books Trending Now
        </h2>

        <div className="bg-white p-4 rounded-3xl shadow-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              {
                image: "/src/images/book1.jpg",
                title: "IT STARTS WITH US",
                author: "Colleen Hoover",
                price: "849",
                stock: "4 stocks left",
              },
              {
                image: "/src/images/book2.jpg",
                title: "FOURTH WING",
                author: "Rebecca Yarros",
                price: "989",
                stock: "3 stocks left",
              },
              {
                image: "/src/images/boook3.jpg",
                title: "Ruthless Vows",
                author: "Rebecca Ross",
                price: "999",
                stock: "5 stocks left",
              },
              {
                image: "/src/images/boook4.jpg",
                title: "IRON FLAME",
                author: "Rebecca Yarros",
                price: "764",
                stock: "2 stocks left",
              },
              {
                image: "/src/images/book5.jpg",
                title: "THE ONLY ONE LEFT",
                author: "Riley Sager",
                price: "543",
                stock: "1 stock left",
              },
            ].map((book, index) => (
              <div
                key={index}
                className="group relative transform transition-transform duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-orange-300 opacity-0 group-hover:opacity-100 transition-all duration-300 z-0"></div>

                <div className="relative z-10 p-4">
                  <div className="w-full h-64 border-[10px] border-gray-300 rounded-md overflow-hidden">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <p className="font-bold text-center mt-2 group-hover:text-white">
                    {book.title}
                  </p>
                  <p className="text-center text-gray-700 mb-2 group-hover:text-white">
                    {book.author}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <button className="py-2 px-4 rounded-sm text-sm bg-orange-400 text-white transition-colors duration-300 group-hover:bg-white group-hover:text-orange-500">
                      Buy Now
                    </button>
                    <p className="text-gray-700 font-semibold group-hover:text-white">
                      \u20B9 {book.price}
                    </p>
                  </div>
                  <p className="text-gray-700 text-sm mt-2 text-center group-hover:text-white">
                    {book.stock}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="categories" className="p-8 bg-orange-50">
        <h2 className="text-3xl font-bold mb-6 text-center">Shop By Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className={`flex items-center p-4 rounded-lg shadow-md transition-transform transform hover:scale-105`}
              style={{
                background: `linear-gradient(to left, ${index === 0 ? '#ff9a9e' : index === 1 ? '#a1c4fd' : index === 2 ? '#fbc2eb' : '#d4fc79'}, ${index === 0 ? '#ff6a88' : index === 1 ? '#c2e9fb' : index === 2 ? '#a6c1ee' : '#96e6a1'})`
              }}
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-16 h-16 object-cover rounded-full mr-4"
              />
              <h3 className="text-xl font-semibold text-gray-800">{category.name}</h3>
            </div>
          ))}
        </div>
      </div>

      <div id="exchange" className="p-8 bg-orange-50 flex flex-col items-center">
        <div className="bg-white bg-opacity-90 p-8 rounded-3xl shadow-lg w-full">
          <div className="w-full flex flex-col md:flex-row justify-between items-center">
            <div className="md:w-1/2 pr-6">
              <h3 className="text-3xl sm:text-4xl font-bold mb-4">Buy or Sell any book of your choice</h3>
              <p className="text-xl sm:text-2xl font-semibold mb-2">Give your books countless lives by selling !!</p>
              <p className="text-lg italic">Buy all trendy books. </p>
            </div>
            <div className="md:w-1/2 flex justify-center items-center mt-6 md:mt-0">
              <img
                src="/src/images/exch1.png"
                alt="Books Exchange"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
