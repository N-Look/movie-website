import React from 'react';
import CategoryPageLayout from '../components/CategoryPageLayout';

const NewPopularPage = () => {
  return (
    <CategoryPageLayout
      title="New & Popular"
      description="Trending movies and shows everyone's talking about"
      category="trending"
      apiEndpoint="https://api.themoviedb.org/3/trending/movie/week?language=en-US"
      showHero={true}
    />
  );
};

export default NewPopularPage;
