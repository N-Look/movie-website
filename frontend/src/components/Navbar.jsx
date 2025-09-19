import { HelpCircle, LogOut, Search, Settings, X } from "lucide-react";
import Logo from "../assets/logo.png";
import { Link, useLocation } from "react-router";
import { useAuthStore } from "../store/authStore";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const avatarUrl = user
    ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        user.username
      )}`
    : "";

  const handleLogout = async () => {
    const { message } = await logout();
    toast.success(message);
    setShowMenu(false);
  };

  const searchMovies = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_TOKEN}`,
      },
    };

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=1`,
        options
      );
      const data = await response.json();
      setSearchResults(data.results || []);
      setShowSearchResults(true);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search movies");
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchMovies(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSearchResults && !event.target.closest('.search-container')) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSearchResults]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-black text-gray-200 flex justify-between items-center p-4 h-20 text-sm md:text-[15px] font-medium text-nowrap">
      <Link to={"/"}>
        <img
          src={Logo}
          alt="Logo"
          className="w-50 cursor-pointer brightness-125"
        />
      </Link>

      <ul className="hidden xl:flex space-x-6">
        <li>
          <Link 
            to="/" 
            className={`cursor-pointer hover:text-[#f59f00] transition-colors duration-200 ${
              isActive('/') ? 'text-[#f59f00]' : ''
            }`}
          >
            Home
          </Link>
        </li>
        <li>
          <Link 
            to="/movies" 
            className={`cursor-pointer hover:text-[#f59f00] transition-colors duration-200 ${
              isActive('/movies') ? 'text-[#f59f00]' : ''
            }`}
          >
            Movies
          </Link>
        </li>
        <li>
          <Link 
            to="/tv-shows" 
            className={`cursor-pointer hover:text-[#f59f00] transition-colors duration-200 ${
              isActive('/tv-shows') ? 'text-[#f59f00]' : ''
            }`}
          >
            TV Shows
          </Link>
        </li>
        <li>
          <Link 
            to="/anime" 
            className={`cursor-pointer hover:text-[#f59f00] transition-colors duration-200 ${
              isActive('/anime') ? 'text-[#f59f00]' : ''
            }`}
          >
            Anime
          </Link>
        </li>
        <li>
          <Link 
            to="/top-rated" 
            className={`cursor-pointer hover:text-[#f59f00] transition-colors duration-200 ${
              isActive('/top-rated') ? 'text-[#f59f00]' : ''
            }`}
          >
            Top Rated
          </Link>
        </li>
        <li>
          <Link 
            to="/popular" 
            className={`cursor-pointer hover:text-[#f59f00] transition-colors duration-200 ${
              isActive('/popular') ? 'text-[#f59f00]' : ''
            }`}
          >
            Popular
          </Link>
        </li>
        <li>
          <Link 
            to="/upcoming" 
            className={`cursor-pointer hover:text-[#f59f00] transition-colors duration-200 ${
              isActive('/upcoming') ? 'text-[#f59f00]' : ''
            }`}
          >
            Upcoming
          </Link>
        </li>
      </ul>

      <div className="flex items-center space-x-4 relative">
        <div className="relative hidden md:inline-flex search-container">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setShowSearchResults(true)}
              className="bg-[#232323] text-white px-4 py-2 rounded-full min-w-72 pr-12 outline-none border border-[#333333] focus:border-[#f59f00] transition-colors duration-200 placeholder-gray-400"
              placeholder="Search movies..."
            />
            <div className="absolute top-2 right-4 flex items-center space-x-2">
              {isSearching ? (
                <div className="w-5 h-5 border-2 border-[#f59f00] border-t-transparent rounded-full animate-spin"></div>
              ) : searchQuery ? (
                <X 
                  className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" 
                  onClick={clearSearch}
                />
              ) : (
                <Search className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>
          
          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#232323] border border-[#333333] rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
              {searchResults.slice(0, 8).map((movie) => (
                <Link
                  key={movie.id}
                  to={`/movie/${movie.id}`}
                  onClick={() => {
                    setShowSearchResults(false);
                    setSearchQuery("");
                  }}
                  className="flex items-center p-3 hover:bg-[#333333] transition-colors duration-200 border-b border-[#333333] last:border-b-0"
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                    alt={movie.title}
                    className="w-12 h-16 object-cover rounded mr-3"
                  
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium text-sm truncate">{movie.title}</h3>
                    <p className="text-gray-400 text-xs">
                      {movie.release_date?.slice(0, 4)} • ⭐ {movie.vote_average?.toFixed(1)}
                    </p>
                    <p className="text-gray-500 text-xs truncate mt-1">{movie.overview}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
    
        <Link to={user ? "ai-recommendations" : "signin"}>
          <button className="bg-gradient-to-r from-yellow-500 to-orange-500 px-5 py-2 text-white cursor-pointer">
            Get AI Movie Picks
          </button>
        </Link>

        {!user ? (
          <Link to={"/signin"}>
            <button className="border border-[#333333] py-2 px-4 cursor-pointer">
              Sign In
            </button>
          </Link>
        ) : (
          <div className="text-white">
            <img
              src={avatarUrl}
              alt=""
              className="w-10 h-10 rounded-full border-2 border-[#e50914] cursor-pointer"
              onClick={() => setShowMenu(!showMenu)}
            />

            {showMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[#232323] bg-opacity-95 rounded-lg z-50 shadow-lg py-4 px-3 flex flex-col gap-2 border border-[#333333]">
                <div className="flex flex-col items-center mb-2">
                  <span className="text-white font-semibold text-base">
                    {user.username}
                  </span>
                  <span className="text-xs text-gray-400">{user.email}</span>
                </div>

                <button className="flex items-center px-4 py-3 rounded-lg text-white bg-[#181818] hover:bg-[#1d1c1c] gap-3 cursor-pointer">
                  <HelpCircle className="w-5 h-5" />
                  Help Center
                </button>

                <button className="flex items-center px-4 py-3 rounded-lg text-white bg-[#181818] hover:bg-[#1d1c1c] gap-3 cursor-pointer">
                  <Settings className="w-5 h-5" />
                  Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-3 rounded-lg text-white bg-[#181818] hover:bg-[#1d1c1c] gap-3 cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  Log Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;