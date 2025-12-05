import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router';
import { Play, Star, Calendar } from 'lucide-react';

const MovieGrid = ({ title, category, apiEndpoint, showTitle = true, mediaType = 'movie' }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef();
  const loadMoreRef = useRef();

  // ✅ Replace with your TMDb v3 API key
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  const fetchData = async (pageNum = 1, append = false) => {
    try {
      setLoading(true);

      const url = apiEndpoint.includes('?')
        ? `${apiEndpoint}&api_key=${API_KEY}&page=${pageNum}`
        : `${apiEndpoint}?api_key=${API_KEY}&page=${pageNum}`; //This is a duplicate and will not be replaced

      const response = await fetch(url);

      if (!response.ok) {
        console.error('TMDb API error:', await response.text());
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.results && result.results.length > 0) {
        setData((prev) => (append ? [...prev, ...result.results] : result.results));
        setHasMore(pageNum < (result.total_pages || 1));
      } else {
        if (!append) setData([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      if (!append) setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1, false);
  }, [apiEndpoint]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchData(nextPage, true);
  }, [loading, hasMore, page]);

  // Infinite scroll observer
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [hasMore, loading, loadMore]);

  if (loading && data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!loading && data.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl text-gray-400 mb-4">No content found</h3>
        <p className="text-gray-500">Try refreshing the page or check back later.</p>
      </div>
    );
  }

  return (
    <div className="text-white">
      {showTitle && <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {data.map((item) => {
          // ✅ Always build an image URL or fallback
          let imageUrl = null;
          if (item.poster_path) {
            imageUrl = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
          } else if (item.backdrop_path) {
            imageUrl = `https://image.tmdb.org/t/p/w780${item.backdrop_path}`;
          }

          return (
            <div
              key={item.id}
              className="bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden hover:scale-105 hover:bg-white/10 transition-all duration-300 group border border-white/5 hover:border-white/10 shadow-lg hover:shadow-xl"
            >
              <Link to={`/${mediaType === 'tv' ? 'tv' : 'movie'}/${item.id}`}>
                <div className="relative group">
                  <img
                    src={
                      imageUrl
                    }
                    alt={item.title || item.name || mediaType === 'tv' ? 'TV Show' : 'Movie'}
                    className="w-full h-64 md:h-80 object-cover transition duration-300 group-hover:brightness-50"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://via.placeholder.com/300x450/333333/ffffff?text=No+Image';
                    }}
                  />

                  <div className="absolute inset-0 bg-transparent transition-all duration-300 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>


                <div className="p-4">
                  <h3 className="font-semibold text-sm md:text-base mb-2 line-clamp-2">
                    {item.title || item.name}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span>{item.vote_average?.toFixed(1) || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {item.release_date?.slice(0, 4) ||
                          item.first_air_date?.slice(0, 4) ||
                          'N/A'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-300 line-clamp-2">
                    {item.overview || 'No description available.'}
                  </p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
        {loading && data.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-400">Loading more...</span>
          </div>
        )}
        {!hasMore && data.length > 0 && (
          <span className="text-gray-500">You've reached the end</span>
        )}
      </div>
    </div>
  );
};

export default MovieGrid;
