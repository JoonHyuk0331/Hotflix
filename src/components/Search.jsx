// Search.jsx
import React, { useEffect } from "react";
import useGetTopRatedMovies from "../hooks/useGetTopRatedMovies";
import '../App.css';
import {useInView} from "react-intersection-observer";
import { useIsFetching } from "@tanstack/react-query";

function Search() {
    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useGetTopRatedMovies();

    

    const {ref,inView}=useInView()
    // Scroll event listener for infinite scroll
    useEffect(()=>{
        if(inView&&hasNextPage&&!isFetchingNextPage){
            fetchNextPage();
        }
    },[inView]);
    // useEffect(() => {
    //     const handleScroll = () => {
    //         if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && hasNextPage) {
    //             fetchNextPage();
    //         }
    //     };
    //     window.addEventListener("scroll", handleScroll);
    //     return () => window.removeEventListener("scroll", handleScroll);
    // }, [fetchNextPage, hasNextPage]);


    return (
        <div>
            <div className="grid-container">
                {data?.pages.map((page) =>
                    page.results.map((movie) => (
                        <div key={movie.id} className="grid-item">
                            <img
                                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                alt={movie.title}
                                className="poster"
                            />
                            <p className="movie-title">{movie.title}</p>
                        </div>
                    ))
                )}
            </div>
            <h1 ref={ref}>Loading...</h1>
        </div>
    );
}

export default Search;