import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect, lazy, Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";

const Homepage = lazy(() => import("./pages/Homepage"));
const MovieDetails = lazy(() => import("./pages/MovieDetails"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const AIRecommendations = lazy(() => import("./pages/AIRecommendations"));
const TvShowsPage = lazy(() => import("./pages/TvShowsPage"));
const TvShowDetails = lazy(() => import("./pages/TvShowDetails"));
const MoviesPage = lazy(() => import("./pages/MoviesPage"));
const AnimePage = lazy(() => import("./pages/AnimePage"));
const TopRatedPage = lazy(() => import("./pages/TopRatedPage"));
const PopularPage = lazy(() => import("./pages/PopularPage"));
const WatchMovie = lazy(() => import("./pages/WatchMovie"));
const WatchTvShow = lazy(() => import("./pages/WatchTvShow"));
const AnimeDetails = lazy(() => import("./pages/AnimeDetails"));

const App = () => {
  const { fetchUser, fetchingUser, authMessage } = useAuthStore();

  useEffect(() => {
    fetchUser();
    // Run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Run only once on mount; we don't need to depend on the function reference

  if (fetchingUser) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-black">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-500"></div>
        <p className="text-white text-lg mt-4">{authMessage || 'Loading...'}</p>
      </div>
    );
  }
  return (
    <div>
      <Toaster />
      <Navbar />
      <Suspense fallback={<div className="flex justify-center items-center h-screen"><p className="text-purple-500">Loading...</p></div>}>
        <Routes>
          <Route path={'/'} element={<Homepage />} />
          <Route path={'/movie/:id'} element={<MovieDetails />} />
          <Route path={'/signin'} element={<SignIn />} />
          <Route path={'/signup'} element={<SignUp />} />
          <Route path={'/ai-recommendations'} element={<AIRecommendations />} />
          <Route path={'/tv/:id'} element={<TvShowDetails />} />
          <Route path={'/tv-shows'} element={<TvShowsPage />} />
          <Route path={'/movies'} element={<MoviesPage />} />
          <Route path={'/anime'} element={<AnimePage />} />
          <Route path={'/anime/:id'} element={<AnimeDetails />} />
          <Route path={'/top-rated'} element={<TopRatedPage />} />
          <Route path={'/popular'} element={<PopularPage />} />
          <Route path={'/watch/movie/:id'} element={<WatchMovie />} />
          <Route path={'/watch/tv/:id'} element={<WatchTvShow />} />
          <Route path={'/watch/tv/:id/:season/:episode'} element={<WatchTvShow />} />
        </Routes>
      </Suspense>
      <Analytics />
    </div>
  )
}

export default App