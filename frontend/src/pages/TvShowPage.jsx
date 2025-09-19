import { Play } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import MovieGrid from "../components/MovieGrid";

const TvShowPage = () => {
  const { id } = useParams();
  const [tvShow, setTvShow] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [activeSeason, setActiveSeason] = useState(1);
  const [episodes, setEpisodes] = useState([]);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_TOKEN}`,
    },
  };

  useEffect(() => {
    // Fetch TV show details
    fetch(`https://api.themoviedb.org/3/tv/${id}?language=en-US`, options)
      .then((res) => res.json())
      .then((res) => {
        setTvShow(res);
        // Set seasons
        if (res.seasons) {
          setSeasons(res.seasons.filter(season => season.season_number > 0));
        }
      })
      .catch((err) => console.error(err));

    // Fetch recommendations
    fetch(
      `https://api.themoviedb.org/3/tv/${id}/recommendations?language=en-US&page=1`,
      options
    )
      .then((res) => res.json())
      .then((res) => setRecommendations(res.results || []))
      .catch((err) => console.error(err));

    // Fetch trailers
    fetch(
      `https://api.themoviedb.org/3/tv/${id}/videos?language=en-US`,
      options
    )
      .then((res) => res.json())
      .then((res) => {
        const trailer = res.results?.find(
          (vid) => vid.site === "YouTube" && vid.type === "Trailer"
        );
        setTrailerKey(trailer?.key || null);
      })
      .catch((err) => console.error(err));
  }, [id]);

  // Fetch episodes when active season changes
  useEffect(() => {
    if (activeSeason > 0) {
      fetch(
        `https://api.themoviedb.org/3/tv/${id}/season/${activeSeason}?language=en-US`,
        options
      )
        .then((res) => res.json())
        .then((res) => setEpisodes(res.episodes || []))
        .catch((err) => console.error(err));
    }
  }, [id, activeSeason]);

  if (!tvShow) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#e50914]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#181818] text-white">
      {/* Hero Section */}
      <div className="relative h-[70vh] flex items-end pb-16">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${tvShow.backdrop_path})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.5)'
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent"></div>
        
        <div className="relative z-10 container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{tvShow.name}</h1>
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-green-500 font-semibold">
              {Math.round(tvShow.vote_average * 10)}% Match
            </span>
            <span>{tvShow.first_air_date?.split('-')[0]}</span>
            <span className="border border-gray-400 px-1 text-xs">
              {tvShow.episode_run_time?.[0] || 'N/A'}m
            </span>
            <span className="border border-gray-400 px-1 text-xs">
              {tvShow.status}
            </span>
          </div>
          <p className="max-w-3xl text-gray-300 mb-6">{tvShow.overview}</p>
          <div className="flex space-x-4">
            <button className="bg-white text-black px-6 py-2 rounded font-semibold flex items-center hover:bg-opacity-80 transition">
              <Play className="w-5 h-5 mr-2" /> Play
            </button>
            {trailerKey && (
              <a
                href={`https://www.youtube.com/watch?v=${trailerKey}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-600 bg-opacity-70 text-white px-6 py-2 rounded font-semibold flex items-center hover:bg-opacity-50 transition"
              >
                <Play className="w-5 h-5 mr-2" /> Trailer
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Seasons and Episodes */}
      {seasons.length > 0 && (
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-4">Seasons</h2>
          <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
            {seasons.map((season) => (
              <button
                key={season.id}
                onClick={() => setActiveSeason(season.season_number)}
                className={`px-4 py-2 rounded ${
                  activeSeason === season.season_number
                    ? 'bg-[#e50914] text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {season.name}
              </button>
            ))}
          </div>

          {episodes.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Episodes</h3>
              <div className="space-y-4">
                {episodes.map((episode) => (
                  <div key={episode.id} className="bg-[#2a2a2a] p-4 rounded-lg">
                    <div className="flex space-x-4">
                      <div className="w-1/4">
                        <img
                          src={episode.still_path 
                            ? `https://image.tmdb.org/t/p/w500${episode.still_path}`
                            : 'https://via.placeholder.com/300x169?text=No+Image'}
                          alt={episode.name}
                          className="w-full h-auto rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold">
                          {episode.episode_number}. {episode.name}
                        </h4>
                        <div className="flex items-center text-sm text-gray-400 mb-2">
                          <span className="mr-4">
                            {episode.runtime || 'N/A'}m
                          </span>
                          <span>
                            {episode.air_date && new Date(episode.air_date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-300">
                          {episode.overview || 'No description available.'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6">More Like This</h2>
          <MovieGrid
            data={recommendations}
            mediaType="tv"
            showTitle={false}
          />
        </div>
      )}
    </div>
  );
};

export default TvShowPage;
