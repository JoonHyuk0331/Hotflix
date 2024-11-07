import React, { useState, useEffect } from "react";

// Movie 컴포넌트
export default function Movie({ movie }) {
  return (
    <div className="movie-container">
      <img 
        src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`} 
        alt={movie.title} 
      />
      <div className="movie-info">
        <h4>{movie.title}</h4>
        <span>{movie.overview}</span>
        <span>평점: {movie.vote_average}</span>
      </div>
    </div>
  );
}
