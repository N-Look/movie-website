import React from 'react';
import CategoryPageLayout from '../components/CategoryPageLayout';

const TvShowsPage = () => {
  return (
    <CategoryPageLayout
      title="TV Shows"
      description="Discover the best TV series and shows"
      category="tv"
      mediaType="tv"
      apiEndpoint="https://api.themoviedb.org/3/tv/popular?language=en-US"
      showHero={true}
    />
  );
};

export default TvShowsPage;
