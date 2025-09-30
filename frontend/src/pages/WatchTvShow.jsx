import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

const WatchTvShow = () => {
  const { id, season: seasonParam, episode: episodeParam } = useParams();
  const [playerLoading, setPlayerLoading] = useState(true);
  const [resumeTimestamp, setResumeTimestamp] = useState(null);

  const season = useMemo(() => Number(seasonParam) || 1, [seasonParam]);
  const episode = useMemo(() => Number(episodeParam) || 1, [episodeParam]);

  // Load saved watch progress to resume playback
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`watch_progress_${id}`);
      if (saved) {
        const { timestamp } = JSON.parse(saved);
        if (typeof timestamp === "number") {
          setResumeTimestamp(Math.floor(timestamp));
        } else {
          setResumeTimestamp(null);
        }
      } else {
        setResumeTimestamp(null);
      }
    } catch (e) {
      setResumeTimestamp(null);
    }
  }, [id, season, episode]);

  // Save watch progress from Videasy player via postMessage
  useEffect(() => {
    const onMessage = (event) => {
      if (typeof event.data === "string") {
        try {
          const progressData = JSON.parse(event.data);
          if (progressData && progressData.id) {
            localStorage.setItem(
              `watch_progress_${progressData.id}`,
              JSON.stringify(progressData)
            );
          }
        } catch (error) {
          // Ignore non-JSON messages
        }
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Build Videasy TV player URL with optional resume progress
  const tvParams = new URLSearchParams({
    episodeSelector: "true",
    nextEpisode: "true",
    autoplayNextEpisode: "true",
    overlay: "true",
    color: "3B82F6",
  });
  if (resumeTimestamp != null) tvParams.set("progress", String(resumeTimestamp));
  const playerSrc = `https://player.videasy.net/tv/${id}/${season}/${episode}?${tvParams.toString()}`;

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      <div className="max-w-[1400px] mx-auto px-4 py-4 flex items-center gap-3">
        <Link to={`/tv/${id}`} className="text-sm text-gray-300 hover:text-white underline">
          Back to Details
        </Link>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 pb-10">
        <div className="relative pb-[56.25%] h-0 bg-black rounded-lg overflow-hidden">
          {playerLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-[#3B82F6]"></div>
            </div>
          )}
          <iframe
            src={playerSrc}
            className="absolute top-0 left-0 w-full h-full"
            frameBorder="0"
            allowFullScreen
            allow="encrypted-media"
            onLoad={() => setPlayerLoading(false)}
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default WatchTvShow;
