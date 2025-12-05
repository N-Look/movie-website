import React from 'react';
import CategoryPageLayout from '../components/CategoryPageLayout';

const TopRatedPage = () => {
  return (
    <CategoryPageLayout
      title="Top Rated"
      description="The highest rated movies and TV shows"
      category="top-rated"
      apiEndpoint="https://api.themoviedb.org/3/movie/top_rated?language=en-US"
      showHero={true}
    />
  );
};

export default TopRatedPage;
