import React from 'react';
import CategoryPageLayout from '../components/CategoryPageLayout';

const PopularPage = () => {
  return (
    <CategoryPageLayout
      title="Popular"
      description="Trending movies and shows everyone's talking about"
      category="trending"
      apiEndpoint="https://api.themoviedb.org/3/trending/movie/week?language=en-US"
      showHero={true}
    />
  );
};

export default PopularPage;
