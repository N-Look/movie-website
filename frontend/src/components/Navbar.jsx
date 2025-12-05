import { HelpCircle, LogOut, Search, Settings, X } from "lucide-react";
import Logo from "../assets/logo.png";
import { Link, useLocation } from "react-router-dom";
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
      // Determine scope based on current route
      const path = location.pathname || "/";
      let scope = "multi"; // default: search both movies and TV
      if (path.startsWith("/movies")) scope = "movie";
      else if (path.startsWith("/tv-shows")) scope = "tv";

      const baseUrl =
        scope === "movie"
          ? "https://api.themoviedb.org/3/search/movie"
          : scope === "tv"
          ? "https://api.themoviedb.org/3/search/tv"
          : "https://api.themoviedb.org/3/search/multi";

      const url = `${baseUrl}?query=${encodeURIComponent(query)}&language=en-US&page=1&include_adult=true`;

      const response = await fetch(url, options);
      const data = await response.json();

      const raw = Array.isArray(data.results) ? data.results : [];
      // Filter non-content in multi and normalize fields for UI
      const normalized = raw
        .filter((r) => {
          const type = scope === "multi" ? r.media_type : scope;
          return type === "movie" || type === "tv";
        })
        .map((r) => {
          const type = scope === "multi" ? r.media_type : scope;
          return {
            __type: type, // 'movie' | 'tv'
            id: r.id,
            title: r.title || r.name || "",
            release_date: r.release_date || r.first_air_date || "",
            poster_path: r.poster_path || r.profile_path || null,
            vote_average: r.vote_average,
            overview: r.overview,
          };
        });

      setSearchResults(normalized);
      setShowSearchResults(true);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search");
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
    <nav className="bg-black/80 backdrop-blur-xl text-gray-200 flex justify-between items-center p-4 h-20 text-sm md:text-[15px] font-medium text-nowrap sticky top-0 z-50 border-b border-white/5">
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
            className={`cursor-pointer hover:text-purple-400 transition-colors duration-200 ${
              isActive('/') ? 'text-purple-400' : ''
            }`}
          >
            Home
          </Link>
        </li>
        <li>
          <Link 
            to="/movies" 
            className={`cursor-pointer hover:text-purple-400 transition-colors duration-200 ${
              isActive('/movies') ? 'text-purple-400' : ''
            }`}
          >
            Movies
          </Link>
        </li>
        <li>
          <Link 
            to="/tv-shows" 
            className={`cursor-pointer hover:text-purple-400 transition-colors duration-200 ${
              isActive('/tv-shows') ? 'text-purple-400' : ''
            }`}
          >
            TV Shows
          </Link>
        </li>
        <li>
          <Link 
            to="/anime" 
            className={`cursor-pointer hover:text-purple-400 transition-colors duration-200 ${
              isActive('/anime') ? 'text-purple-400' : ''
            }`}
          >
            Anime
          </Link>
        </li>
        <li>
          <Link 
            to="/top-rated" 
            className={`cursor-pointer hover:text-purple-400 transition-colors duration-200 ${
              isActive('/top-rated') ? 'text-purple-400' : ''
            }`}
          >
            Top Rated
          </Link>
        </li>
        <li>
          <Link 
            to="/popular" 
            className={`cursor-pointer hover:text-purple-400 transition-colors duration-200 ${
              isActive('/popular') ? 'text-purple-400' : ''
            }`}
          >
            Popular
          </Link>
        </li>
        <li>
          <Link 
            to="/upcoming" 
            className={`cursor-pointer hover:text-purple-400 transition-colors duration-200 ${
              isActive('/upcoming') ? 'text-purple-400' : ''
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
              className="bg-white/5 text-white px-5 py-2.5 rounded-2xl min-w-72 pr-12 outline-none border border-white/10 focus:border-purple-500 focus:bg-white/10 transition-all duration-300 placeholder-gray-500"
              placeholder="Search movies & TV..."
            />
            <div className="absolute top-2 right-4 flex items-center space-x-2">
              {isSearching ? (
                <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
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
            <div className="absolute top-full left-0 right-0 mt-3 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl z-50 max-h-96 overflow-y-auto">
              {searchResults.slice(0, 8).map((item) => {
                const linkTo = item.__type === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`;
                return (
                  <Link
                    key={`${item.__type}-${item.id}`}
                    to={linkTo}
                    onClick={() => {
                      setShowSearchResults(false);
                      setSearchQuery("");
                    }}
                    className="flex items-center p-3 hover:bg-white/10 transition-all duration-200 rounded-xl border-b border-white/5 last:border-b-0"
                  >
                    <img
                      src={item.poster_path ? `https://image.tmdb.org/t/p/w92${item.poster_path}` : `https://via.placeholder.com/92x138?text=No+Image`}
                      alt={item.title}
                      className="w-12 h-16 object-cover rounded mr-3"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium text-sm truncate">{item.title}</h3>
                      <p className="text-gray-400 text-xs">
                        {(item.release_date || '').slice(0, 4)} • ⭐ {item.vote_average?.toFixed(1)}
                      </p>
                      <p className="text-gray-500 text-xs truncate mt-1">{item.overview}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
    
        <Link to={user ? "ai-recommendations" : "signin"}>
          <button className="bg-gradient-to-r from-blue-500 to-purple-500 px-5 py-2.5 rounded-2xl text-white cursor-pointer shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300">
            Get AI Movie Picks
          </button>
        </Link>

        {!user ? (
          <Link to={"/signin"}>
            <button className="border border-white/20 rounded-2xl py-2.5 px-5 cursor-pointer bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-300">
              Sign In
            </button>
          </Link>
        ) : (
          <div className="text-white">
            <img
              src={avatarUrl}
              alt=""
              className="w-10 h-10 rounded-2xl border-2 border-purple-500/50 cursor-pointer hover:border-purple-400 transition-all duration-300 shadow-lg"
              onClick={() => setShowMenu(!showMenu)}
            />

            {showMenu && (
              <div className="absolute right-0 mt-3 w-64 bg-black/80 backdrop-blur-2xl rounded-3xl z-50 shadow-2xl py-5 px-4 flex flex-col gap-2 border border-white/10">
                <div className="flex flex-col items-center mb-2">
                  <span className="text-white font-semibold text-base">
                    {user.username}
                  </span>
                  <span className="text-xs text-gray-400">{user.email}</span>
                </div>

                <button className="flex items-center px-4 py-3 rounded-2xl text-white bg-white/5 hover:bg-white/10 gap-3 cursor-pointer transition-all duration-200">
                  <HelpCircle className="w-5 h-5" />
                  Help Center
                </button>

                <button className="flex items-center px-4 py-3 rounded-2xl text-white bg-white/5 hover:bg-white/10 gap-3 cursor-pointer transition-all duration-200">
                  <Settings className="w-5 h-5" />
                  Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-3 rounded-2xl text-white bg-white/5 hover:bg-white/10 gap-3 cursor-pointer transition-all duration-200"
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