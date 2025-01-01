/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import client from "@/utils/FeathersClient";
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";

export interface Movie {
  id: string;
  title: string;
  year: number;
  poster: string;
}

export interface AddMovieProps {
  title: string;
  year: number;
  file: File;
  fileMetaData: {
    name: string;
    type: string;
    size: number;
  };
}

export interface UpdatedMovieParams {
  id: string;
  data: {
    title: string;
    year: number;
    file?: File;
    fileMetaData?: {
      name: string;
      type: string;
      size: number;
    };
  }
}


interface MoviesContextProps {
  movies: Movie[];
  page: number;
  limit: number;
  total: number;
  isLoading: boolean;
  fetchMovies: (page?: number, limit?: number) => void;
  addMovie: (movieParams: AddMovieProps) => void;
  removeMovie: (id: string) => void;
  editMovie: (params: UpdatedMovieParams) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  getMovieById: (id: string) => Promise<Movie>;
}

const MoviesContext = createContext<MoviesContextProps | undefined>(undefined);

const defaultLimit = 8;

const trimTextInputs = (obj: any) => {
  const trimmedObj = { ...obj };
  for (const key in trimmedObj) {
    if (typeof trimmedObj[key] === "string") {
      trimmedObj[key] = trimmedObj[key].trim();
    }
  }
  return trimmedObj;
};

export const MoviesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovies = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await client.service('movies').find({
        query: {
          $limit: limit,
          $skip: (page - 1) * limit,
          $sort: {
            title: 1,
          },
        },
      });
      setMovies(response.data as Movie[]);
      setTotal(response.total);
      setPage(page);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const addMovie = async (addMovieParams: AddMovieProps) => {
    const trimmedParams = trimTextInputs(addMovieParams);
    const result = await client.service("movies").create(trimmedParams);
    setMovies((prevMovies) => [...prevMovies, result as Movie]);
    return result;
  };

  const removeMovie = (id: string) => {
    setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== id));
  };

  const editMovie = async (params: UpdatedMovieParams) => {
    if (!params.id) return;
    const updatedMovie = await client.service("movies").patch(params.id, {
      ...params.data,
    });

    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === params.id
          ? { ...movie, ...updatedMovie }
          : movie
      )
    );
  };

  const getMovieById = async (id: string) => {
    return await client.service("movies").get(id) as Movie;
  }

  useEffect(() => {
    if(movies.length === 0) fetchMovies();
  }, []);

  return (
    <MoviesContext.Provider
      value={{
        movies,
        page,
        limit,
        total,
        isLoading,
        fetchMovies,
        addMovie,
        removeMovie,
        setPage,
        setLimit,
        editMovie,
        getMovieById,
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
