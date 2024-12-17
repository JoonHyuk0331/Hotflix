import React, { useState, useEffect } from "react";
import Movie from './Movie';
import axios from 'axios'




// 메인 화면 컴포넌트
const Main = () => {

    const [now_playing_movies, set_now_playing_Movies] = useState([]);
    const [popular_movies, set_popular_Movies] = useState([]);
    const [toprated_movies, set_toprated_Movies] = useState([]);
    const [upcomming_movies, set_upcoming_Movies] = useState([]);
    const [apiKey, setApiKey] = useState(""); // API 키 상태 추가

    // 로그인된 사용자의 비밀번호(API 키)를 가져오기
    useEffect(() => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
        const users = JSON.parse(localStorage.getItem("users") || "[]");

        // currentUser의 email과 동일한 email을 가진 객체 찾기
        const matchedUser = users.find(user => user.email === currentUser.email);
        if (matchedUser) {
          setApiKey(matchedUser.password); // API 키로 사용
          console.log("API 키를 설정했습니다:", matchedUser.password);
        } else {
          console.log("일치하는 사용자가 없습니다.");
        }
      } catch (error) {
        console.error("로그인된 사용자의 이메일로부터 API 키 가져오기 실패:", error);
      }
    }, []);

    // 영화 데이터를 가져오는 함수
    const fetchMovies = async (endpoint, setMovies) => {
      if (!apiKey) {
        console.warn("API 키가 설정되지 않았습니다.");
        return;
      }
      try {
        const response = await fetch(`${endpoint}&api_key=${apiKey}`);
        const data = await response.json();
        console.log(data);
        setMovies(data.results || []);
      } catch (error) {
        console.error("영화 데이터를 가져오는 중 오류 발생:", error);
      }
    };

    // 각각의 영화 데이터 가져오기
    useEffect(() => {
      if (apiKey) {
        fetchMovies("https://api.themoviedb.org/3/movie/now_playing?language=ko&page=1&region=KR", set_now_playing_Movies);
        fetchMovies("https://api.themoviedb.org/3/movie/popular?language=ko&page=1&region=KR", set_popular_Movies);
        fetchMovies("https://api.themoviedb.org/3/movie/top_rated?language=ko&page=1&region=KR", set_toprated_Movies);
        fetchMovies("https://api.themoviedb.org/3/movie/upcoming?language=ko&page=1&region=KR", set_upcoming_Movies);
      }
    }, [apiKey]); // API 키가 설정되면 영화 데이터를 가져옴

    return (
      <main>
        <h1 className="main-h1">현재 상영중 영화</h1>
        <div className="grid-container">
          {now_playing_movies.map(movie => <Movie key={movie.id} movie={movie} />)}
        </div>

        <h1 className="main-h1">인기있는 영화</h1>
        <div className="grid-container">
          {popular_movies.map(movie => <Movie key={movie.id} movie={movie} />)}
        </div>

        <h1 className="main-h1">평점이 높은 영화</h1>
        <div className="grid-container">
          {toprated_movies.map(movie => <Movie key={movie.id} movie={movie} />)}
        </div>

        <h1 className="main-h1">개봉 예정 영화</h1>
        <div className="grid-container">
          {upcomming_movies.map(movie => <Movie key={movie.id} movie={movie} />)}
        </div>
      </main>
    );
  };

export default Main;
