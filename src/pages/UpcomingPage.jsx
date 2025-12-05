import React from 'react';
import CategoryPageLayout from '../components/CategoryPageLayout';

const UpcomingPage = () => {
  return (
    <CategoryPageLayout
      title="Upcoming"
      description="Coming soon to theaters and streaming"
      category="upcoming"
      apiEndpoint="https://api.themoviedb.org/3/movie/upcoming?language=en-US"
      showHero={true}
    />
  );
};

export default UpcomingPage;
