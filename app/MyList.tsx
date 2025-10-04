import React from 'react';
import { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard';

type Movie = {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  adult: boolean;
  poster_path: string;
  genre_ids: number[];
  original_title: string;
  original_language: string;
  backdrop_path: string;
  popularity: number;
  vote_count: number;
  video: boolean;
  vote_average: number;
};

const MyList = () => {
  const [myList, setMyList] = useState<Movie[]>([]);

  useEffect(() => {
    // Fetch persisted movies from local storage
    const savedMovies = localStorage.getItem('myList');
    if (savedMovies) {
      setMyList(JSON.parse(savedMovies));
    }
  }, []);

  return (
    <div className="my-list">
      <h1 className="text-4xl font-bold text-white mb-4">My List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {myList.length > 0 ? (
          myList.map((movie) => <MovieCard key={movie.id} movie={movie} />)
        ) : (
          <p className="text-white">No movies in your list.</p>
        )}
      </div>
    </div>
  );
};

export default MyList;