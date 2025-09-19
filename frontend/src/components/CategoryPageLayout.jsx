import React, { useState, useEffect } from 'react';
import MovieGrid from './MovieGrid';
import CategoryHero from './CategoryHero';

const CategoryPageLayout = ({ 
  title, 
  description, 
  category, 
  apiEndpoint, 
  showHero = true,
  mediaType = 'movie'
}) => {
  const [trendingImages, setTrendingImages] = useState([]);

  // Fetch trending content for the background
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/trending/${mediaType}/week?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
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
        <MovieGrid 
          title={`${title} ${mediaType === 'tv' ? 'Shows' : 'Movies'}`}
          category={category}
          apiEndpoint={apiEndpoint}
          mediaType={mediaType}
        />
      </div>
    </div>
  );
};

export default CategoryPageLayout;
