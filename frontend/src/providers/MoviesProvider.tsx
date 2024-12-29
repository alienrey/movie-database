'use client';
import React, { createContext, useState, useContext, ReactNode } from "react";

interface Movie {
  id: string;
  title: string;
  year: number;
  poster: string;
}

interface MoviesContextProps {
  movies: Movie[];
  addMovie: (movie: Movie) => void;
  removeMovie: (id: string) => void;
  editMovie: (id: string, updatedMovie: Partial<Movie>) => void;
}

const MoviesContext = createContext<MoviesContextProps | undefined>(undefined);

export const MoviesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (movie: Movie) => {
    setMovies((prevMovies) => [...prevMovies, movie]);
  };

  const removeMovie = (id: string) => {
    setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== id));
  };

  const editMovie = (id: string, updatedMovie: Partial<Movie>) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === id ? { ...movie, ...updatedMovie } : movie
      )
    );
  };

  return (
    <MoviesContext.Provider
      value={{ movies, addMovie, removeMovie, editMovie }}
    >
      {children}
    </MoviesContext.Provider>
  );
};

export const useMovies = (): MoviesContextProps => {
  const context = useContext(MoviesContext);
  if (!context) {
    throw new Error("useMovies must be used within a MoviesProvider");
  }
  return context;
};
