import React from 'react';
import CategoryPageLayout from '../components/CategoryPageLayout';

const MoviesPage = () => {
  return (
    <CategoryPageLayout
      title="Movies"
      description="Explore the latest and greatest movies"
      category="movie"
      apiEndpoint="https://api.themoviedb.org/3/movie/popular?language=en-US"
      showHero={true}
    />
  );
};

export default MoviesPage;
