import React from 'react';
import CategoryPageLayout from '../components/CategoryPageLayout';

const AnimePage = () => {
  return (
    <CategoryPageLayout
      title="Anime"
      description="Immerse yourself in the world of anime"
      category="anime"
      apiEndpoint="https://api.themoviedb.org/3/discover/movie?language=en-US&with_genres=16"
      showHero={true}
    />
  );
};

export default AnimePage;
