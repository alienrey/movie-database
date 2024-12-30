"use client";
import client from "@/utils/FeathersClient";
import React, { createContext, useState, useContext, ReactNode } from "react";

interface Movie {
  id: string;
  title: string;
  year: number;
  poster: string;
}

interface AddMovieProps {
  title: string;
  year: number;
  file: File;
  fileMetaData: {
    name: string;
    type: string;
    size: number;
  };
}

interface MoviesContextProps {
  movies: Movie[];
  page: number;
  limit: number;
  total: number;
  fetchMovies: (page?: number, limit?: number) => void;
  addMovie: (movieParams: AddMovieProps) => void;
  removeMovie: (id: string) => void;
  editMovie: (id: string, updatedMovie: Partial<Movie>) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

const MoviesContext = createContext<MoviesContextProps | undefined>(undefined);

const defaultLimit = 8;

export const MoviesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);
  const [total, setTotal] = useState(0);

  const fetchMovies = async (page = 1) => {
    const response = await client.service('movies').find({
      query: {
        $limit: limit,
        $skip: (page - 1) * limit,
      },
    });
    setMovies(response.data as Movie[]);
    setTotal(response.total);
    setPage(page);
    console.log(response);
  };

  const addMovie = async (addMovieParams: AddMovieProps) => {
    const result = await client.service("movies").create(addMovieParams);
    setMovies((prevMovies) => [...prevMovies, result as Movie]);
    return result;
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
      value={{
        movies,
        page,
        limit,
        total,
        fetchMovies,
        addMovie,
        removeMovie,
        setPage,
        setLimit,
        editMovie,
      }}
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
