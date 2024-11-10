import React, { useState, useEffect } from "react";


// Movie 컴포넌트
export default function Movie({ movie }) {
  return (
    <div className="movies-container">
        <div className="movie-card">
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title}/>
            <h4>{movie.title}</h4>
            <span>평점:{movie.vote_average}</span>
        </div>
    </div>
  );
}   
//alt는 로딩창으로 쓰면됨