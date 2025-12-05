import React, { useState, useEffect } from 'react';
import MovieGrid from './MovieGrid';
import CategoryHero from './CategoryHero';

const CategoryPageLayout = ({ 
  title, 
  description, 
  category, 
  apiEndpoint, 
  showHero = true,
  mediaType = 'movie',
  // Allow injecting a custom grid (e.g., AnimeGrid). Defaults to MovieGrid.
  GridComponent = MovieGrid,
}) => {
  const [trendingImages, setTrendingImages] = useState([]);

  // Fetch trending content for the background
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        // Fallback to 'tv' trending if mediaType is not supported by TMDb (e.g., 'anime')
        const trendingType = ['movie', 'tv'].includes(mediaType) ? mediaType : 'tv';
        const response = await fetch(
          `https://api.themoviedb.org/3/trending/${trendingType}/week?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
        );
        const data = await response.json();
        
        // Get backdrop paths from the first 5 trending items
        const backdrops = data.results
          .slice(0, 5)
          .map(item => item.backdrop_path)
          .filter(Boolean); // Remove any undefined or null backdrops
          
        setTrendingImages(backdrops);
      } catch (error) {
        console.error('Error fetching trending content:', error);
      }
    };

    fetchTrending();
  }, [mediaType]);

  return (
    <div className="min-h-screen bg-[#181818] text-white">
      {/* Hero Section with cycling background */}
      {showHero && (
        <CategoryHero 
          title={title}
          description={description}
          images={trendingImages}
        />
      )}

      {/* Content Section */}
      <div className="p-4 md:p-8">
        {(() => {
          const suffix = mediaType === 'tv' ? 'Shows' : mediaType === 'movie' ? 'Movies' : '';
          const computedTitle = suffix ? `${title} ${suffix}` : title;
          const Grid = GridComponent;
          return (
            <Grid 
              title={computedTitle}
              category={category}
              apiEndpoint={apiEndpoint}
              mediaType={mediaType}
            />
          );
        })()}
      </div>
    </div>
  );
};

export default CategoryPageLayout;
