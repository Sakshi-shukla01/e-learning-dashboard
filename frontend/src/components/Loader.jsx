import React from "react";

const Loader = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "60vh",
      }}
    >
      <div
        className="spinner"
        style={{
          width: "50px",
          height: "50px",
          border: "5px solid #e3e3e3",
          borderTop: "5px solid #6366f1",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <p style={{ marginTop: "1rem", fontSize: "1rem", color: "#4b5563" }}>
        Loading...
      </p>

      {/* Inline animation style */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Loader;
