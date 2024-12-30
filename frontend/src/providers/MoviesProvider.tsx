'use client';
import client from "@/utils/FeathersClient";
import React, { createContext, useState, useContext, ReactNode } from "react";

interface Movie {
  id: string;
  title: string;
  year: number;
  poster: string;
}

interface MoviesContextProps {
  movies: Movie[];
  fetchMovies: () => void;
  addMovie: (movie: Movie) => void;
  removeMovie: (id: string) => void;
  editMovie: (id: string, updatedMovie: Partial<Movie>) => void;
}

const MoviesContext = createContext<MoviesContextProps | undefined>(undefined);

export const MoviesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const fetchMovies = async () => {
    const response = await client.service("movies").find();
    console.log(response);
  }

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
      value={{ movies, addMovie, removeMovie, editMovie, fetchMovies }}
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
