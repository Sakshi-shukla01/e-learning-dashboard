import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";

const YouTubePlayer = ({ courseId, videoUrl, onProgressUpdate }) => {
  const [player, setPlayer] = useState(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // Extract YouTube video ID
  const getYouTubeID = (url) => {
    if (!url) return null;
    const regExp =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeID(videoUrl);

  // When player is ready
  const onReady = (event) => {
    setPlayer(event.target);
    setDuration(event.target.getDuration());
  };

  // Track video progress every second
  useEffect(() => {
    if (!player) return;

    const interval = setInterval(() => {
      const currentTime = player.getCurrentTime();
      const newProgress = Math.min((currentTime / duration) * 100, 100);
      setProgress(newProgress);

      // Update backend every 20% (to avoid too many requests)
      if (newProgress % 20 < 1 && newProgress > 0) {
        onProgressUpdate(courseId, Math.round(newProgress));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [player, duration]);

  if (!videoId)
    return <p style={{ color: "#60a5fa" }}>No valid YouTube video found.</p>;

  return (
    <div>
      <YouTube
        videoId={videoId}
        opts={{
          height: "400",
          width: "100%",
          playerVars: { controls: 1, modestbranding: 1 },
        }}
        onReady={onReady}
      />
      <p style={{ marginTop: "1rem", color: "#60a5fa" }}>
        Watched: {progress.toFixed(1)}%
      </p>
    </div>
  );
};

export default YouTubePlayer;
