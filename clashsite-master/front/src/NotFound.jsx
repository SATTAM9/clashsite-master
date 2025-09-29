import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4">
      <h1 className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-pulse">
        404
      </h1>
      <h2 className="mt-4 text-3xl md:text-4xl font-bold">
        Oops! Page not found
      </h2>

      <Link
        to="/"
        className="mt-6 inline-block px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-pink-500/50 hover:scale-105 transition-transform"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
