import React from "react";

const VideoPlayer = ({ videoUrl }) => {
  // Convert a normal YouTube URL into an embeddable one
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes("watch?v=")) {
      return url.replace("watch?v=", "embed/");
    } else if (url.includes("youtu.be/")) {
      return url.replace("youtu.be/", "www.youtube.com/embed/");
    }
    return url;
  };

  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "600",
          marginBottom: "1rem",
          borderBottom: "2px solid #e5e7eb",
          paddingBottom: "0.5rem",
        }}
      >
        🎥 Course Video
      </h2>

      {embedUrl ? (
        <div
          style={{
            position: "relative",
            paddingBottom: "56.25%",
            height: 0,
            overflow: "hidden",
            borderRadius: "10px",
          }}
        >
          <iframe
            src={embedUrl}
            title="Course Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              borderRadius: "10px",
            }}
          ></iframe>
        </div>
      ) : (
        <p style={{ color: "#ef4444" }}>No video available for this course.</p>
      )}
    </div>
  );
};

export default VideoPlayer;
