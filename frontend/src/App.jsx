import { Route, Routes } from "react-router";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import Moviepage from "./pages/Moviepage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import {Toaster} from "react-hot-toast"
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import AIRecommendations from "./pages/AIRecommendations";
import TvShowsPage from "./pages/TvShowsPage";
import MoviesPage from "./pages/MoviesPage";
import AnimePage from "./pages/AnimePage";
import TopRatedPage from "./pages/TopRatedPage";
import NewPopularPage from "./pages/NewPopularPage";
import UpcomingPage from "./pages/UpcomingPage";

const App = () => {
  const {fetchUser, fetchingUser} = useAuthStore();

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  if(fetchingUser){
    return <p className="text-[#e50914]">Loading...</p>
  }
  return (
    <div>
      <Toaster/>
      <Navbar />
      <Routes>
        <Route path={'/'} element={<Homepage />} />
        <Route path={'/movie/:id'} element={<Moviepage />} />
        <Route path={'/signin'} element={<SignIn />} />
        <Route path={'/signup'} element={<SignUp />} />
        <Route path={'/ai-recommendations'} element={<AIRecommendations />} />
        <Route path={'/tv-shows'} element={<TvShowsPage />} />
        <Route path={'/movies'} element={<MoviesPage />} />
        <Route path={'/anime'} element={<AnimePage />} />
        <Route path={'/top-rated'} element={<TopRatedPage />} />
        <Route path={'/new-popular'} element={<NewPopularPage />} />
        <Route path={'/upcoming'} element={<UpcomingPage />} />
      </Routes>
    </div>
  )
}

export default App