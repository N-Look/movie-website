import { Play } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import MovieGrid from "../components/MovieGrid";
import { FreeMode } from "swiper/modules";


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
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-500"></div>
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
            <Link to={`/watch/tv/${id}/1/1`} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-2xl font-semibold flex items-center shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300">
              <Play className="w-5 h-5 mr-2" /> Play
            </Link>
            {trailerKey && (
              <a
                href={`https://www.youtube.com/watch?v=${trailerKey}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-2xl font-semibold flex items-center border border-white/10 hover:bg-white/20 hover:scale-105 transition-all duration-300"
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
          <div className="relative px-10">
            <Swiper
              modules={[Navigation]}
              spaceBetween={12}
              slidesPerView="auto"
              navigation={{
                nextEl: '.swiper-button-next-season',
                prevEl: '.swiper-button-prev-season',
              }}
              grabCursor={true}
              className="mb-6 pb-2"
            >
              {seasons.map((season) => (
                <SwiperSlide key={season.id} style={{ width: "auto" }}>
                  <button
                    onClick={() => setActiveSeason(season.season_number)}
                    className={`px-5 py-2.5 rounded-2xl transition-all duration-300 ${
                      activeSeason === season.season_number
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-purple-500/30"
                        : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                    }`}
                  >
                    {season.name}
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
            
            {/* Custom Navigation Buttons */}
            <button className="swiper-button-prev-season absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-black bg-opacity-70 rounded-full hover:bg-opacity-90 transition-all shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="swiper-button-next-season absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-black bg-opacity-70 rounded-full hover:bg-opacity-90 transition-all shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>




          {episodes.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Episodes</h3>
              <div className="space-y-4">
                {episodes.map((episode) => (
                  <Link to={`/watch/tv/${id}/${activeSeason}/${episode.episode_number}`} key={episode.id} className="block bg-white/5 backdrop-blur-sm p-4 rounded-2xl hover:bg-white/10 transition-all duration-300 border border-white/5 hover:border-white/10">
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
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
  
    </div>
  );
};

export default TvShowPage;
