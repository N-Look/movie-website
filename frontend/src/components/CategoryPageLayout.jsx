import React from 'react';
import MovieGrid from './MovieGrid';

const CategoryPageLayout = ({ 
  title, 
  description, 
  category, 
  apiEndpoint, 
  showHero = true,
  heroImage = null 
}) => {
  return (
    <div className="min-h-screen bg-[#181818] text-white">
      {/* Hero Section */}
      {showHero && (
        <div className="relative h-[40vh] flex items-center justify-center">
          {heroImage ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${heroImage})`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent"></div>
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#232323] to-[#181818]"></div>
          )}
          
          <div className="relative z-10 text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{title}</h1>
            {description && (
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">{description}</p>
            )}
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="p-4 md:p-8">
        <MovieGrid 
          title={title}
          category={category}
          apiEndpoint={apiEndpoint}
        />
      </div>
    </div>
  );
};

export default CategoryPageLayout;
