import React, { useState, useEffect } from "react";
import Movie from './Movie';

// 메인 화면 컴포넌트
const Main = () => {
    const [now_playing_movies, set_now_playing_Movies] = useState([]);
    const [popular_movies, set_popular_Movies] = useState([]);
    const [toprated_movies, set_toprated_Movies] = useState([]);
    const [upcomming_movies, set_upcoming_Movies] = useState([]);
  
    //set_now_playing_Movies
    useEffect(() => {
      const fetchMovies = async () => {
        try {
          const response = await fetch("https://api.themoviedb.org/3/movie/now_playing?language=ko&page=1&region=KR&api_key=8cc1274fb9b4939dd84d9741f37e166e");
          const data = await response.json();
          console.log(data);
          set_now_playing_Movies(data.results); // 영화 목록 중 4개 항목만 가져오기 data.results.slice(0, 4)
        } catch (error) {
          console.error("Failed to fetch movies:", error);
        }
      };
      fetchMovies();
    }, []);
    //set_popular_Movies
    useEffect(() => {
      const fetchMovies = async () => {
        try {
          const response = await fetch("https://api.themoviedb.org/3/movie/popular?language=ko&page=1&region=KR&api_key=8cc1274fb9b4939dd84d9741f37e166e");
          const data = await response.json();
          console.log(data);
          set_popular_Movies(data.results); // 영화 목록 중 4개 항목만 가져오기 data.results.slice(0, 4)
        } catch (error) {
          console.error("Failed to fetch movies:", error);
        }
      };
      fetchMovies();
    }, []);
    //set_toprated_Movies
    useEffect(() => {
      const fetchMovies = async () => {
        try {
          const response = await fetch("https://api.themoviedb.org/3/movie/top_rated?language=ko&page=1&region=KR&api_key=8cc1274fb9b4939dd84d9741f37e166e");
          const data = await response.json();
          console.log(data);
          set_toprated_Movies(data.results); // 영화 목록 중 4개 항목만 가져오기 data.results.slice(0, 4)
        } catch (error) {
          console.error("Failed to fetch movies:", error);
        }
      };
      fetchMovies();
    }, []);
    //set_upcoming_Movies
    useEffect(() => {
      const fetchMovies = async () => {
        try {
          const response = await fetch("https://api.themoviedb.org/3/movie/upcoming?language=ko&page=1&region=KR&api_key=8cc1274fb9b4939dd84d9741f37e166e");
          const data = await response.json();
          console.log(data);
          set_upcoming_Movies(data.results); // 영화 목록 중 4개 항목만 가져오기 data.results.slice(0, 4)
        } catch (error) {
          console.error("Failed to fetch movies:", error);
        }
      };
      fetchMovies();
    }, []);
  
    return (
      <main>
      
        <h1>현재 상영중 영화</h1>
        <div className="grid-container">
          {
            now_playing_movies.map((movie)=>{
              return(
                <Movie key={movie.id} movie={movie} />
              )
            })
          }
        </div>
        <h1>인기있는 영화</h1>
        <div className="grid-container">
          {
            popular_movies.map((movie)=>{
              return(
                <Movie key={movie.id} movie={movie} />
              )
            })
          }
        </div>
        <h1>평점이 높은 영화</h1>
        <div className="grid-container">
          {
            toprated_movies.map((movie)=>{
              return(
                <Movie key={movie.id} movie={movie} />
              )
            })
          }
        </div>
        <h1>개봉 예정 영화</h1>
        <div className="grid-container">
          {
            upcomming_movies.map((movie)=>{
              return(
                <Movie key={movie.id} movie={movie} />
              )
            })
          }
        </div>
      </main>
    );
  };

  export default Main;  // default 내보내기 추가