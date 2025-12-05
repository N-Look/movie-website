import { Bookmark, Play } from "lucide-react";
import HeroBg from "../assets/herobg2.jpg";
import { useEffect, useState } from "react";
import { Link } from "react-router";
const Hero = () => {
  const [movie, setMovie] = useState(null);
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NTgzMDFlZGQ2MGEzN2Y3NDlmMzhlNGFmMTJjZDE3YSIsIm5iZiI6MTc0NTQxNjIyNS44NzY5OTk5LCJzdWIiOiI2ODA4ZjAyMTI3NmJmNjRlNDFhYjY0ZWUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.NA_LMt6-MUBLAvxMRkZtBoUif4p9YQ6aYZo-lv4-PUE",
    },
  };

  useEffect(() => {
    fetch(
      "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1",
      options
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.results && res.results.length > 0) {
          const randomIndex = Math.floor(Math.random() * res.results.length);
          setMovie(res.results[randomIndex]);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  if (!movie) {
    return <p>Loading...</p>;
  }
  return (
    <div className="relative w-screen -mx-5 -mt-5">
      <div className="relative">
        <img
          src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
          alt="bg-img"
          className="w-screen h-[480px] object-cover object-center"
        />
        <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-gradient-to-t from-[#181818] via-[#18181880] to-transparent"></div>
      </div>

      <div className="flex space-x-2 md:space-x-4 absolute bottom-3 left-4 md:bottom-8 md:left-10 font-medium">
        <button className="flex justify-center items-center bg-white/90 backdrop-blur-sm hover:bg-white text-purple-600 py-3 px-6 rounded-2xl cursor-pointer text-sm md:text-base font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
          <Bookmark className="mr-2 w-4 h-5 md:w-5 md:h-5" /> Save for Later
        </button>
        <Link to={`/movie/${movie.id}`}>
<button className="flex justify-center items-center bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-2xl cursor-pointer text-sm md:text-base font-medium shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300">
          <Play className="mr-2 w-4 h-5 md:w-5 md:h-5" /> Watch Now
        </button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
