import React from 'react';
import CategoryPageLayout from '../components/CategoryPageLayout';
import AnimeGrid from '../components/AnimeGrid';

const AnimePage = () => {
  return (
    <CategoryPageLayout
      title="Anime"
      description="Immerse yourself in the world of anime"
      category="anime"
      showHero={true}
      mediaType="anime"
      GridComponent={AnimeGrid}
    />
  );
};

export default AnimePage;
