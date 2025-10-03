import { Link } from "react-router-dom";

const HoverTapSections = () => {
  return (
    <ul className="flex items-center gap-8 text-gray-300 font-semibold">
      {/* Clans dropdown */}
      <li className="relative group">
        <span className="cursor-pointer hover:text-yellow-400 transition-colors duration-200">
          Clans
        </span>
        <ul className="absolute top-full mt-2 w-48 bg-gray-800 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-10">
          <li>
            <Link
              to="/clans/clan"
              className="block px-4 py-2 hover:bg-gray-700"
            >
              Search By Tag
            </Link>
          </li>
        </ul>
      </li>

      {/* Players dropdown */}
      <li className="relative group">
        <span className="cursor-pointer hover:text-yellow-400 transition-colors duration-200">
          Players
        </span>
        <ul className="absolute top-full mt-2 w-56 bg-gray-800 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-10">
          <li>
            <Link
              to="/players/player"
              className="block px-4 py-2 hover:bg-gray-700"
            >
              Search By Tag
            </Link>
          </li>
          <li>
            <Link
              to="/players/plsyersclan"
              className="block px-4 py-2 hover:bg-gray-700"
            >
              Search By Clan
            </Link>
          </li>
        </ul>
      </li>

      {/* Donations link */}
      {/* <li>
        <Link
          to="/donations"
          className="hover:text-yellow-400 transition-colors duration-200"
        >
          Donations
        </Link>
      </li> */}

      {/* Home link */}
   
      <li>
        <Link
          to="/xp-calculator"
          className="hover:text-yellow-400 transition-colors duration-200"
        >
          xp-calculator
        </Link>
      </li>
      <li>
        <Link
          to="/donations"
          className="hover:text-yellow-400 transition-colors duration-200"
        >
          Donations
        </Link>
      </li>
      <li>
        <Link
          to="/rss"
          className="hover:text-yellow-400 transition-colors duration-200"
        >
          Blog
        </Link>
      </li>
      <li>
        <Link
          to="/about"
          className="hover:text-yellow-400 transition-colors duration-200"
        >
          About
        </Link>
      </li>
    </ul>
  );
};

export default HoverTapSections;
