"use client";
import { useAuth } from "@/providers/AuthProvider";
import { Box, Button, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { colors } from "@/providers/ThemeProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMovies } from "@/providers/MoviesProvider";
import Image from "next/image";

export default function MoviesPage() {
  const { logout } = useAuth();
  const { fetchMovies, movies, page, setPage, limit, total } = useMovies();
  const router = useRouter();

  useEffect(() => {
    fetchMovies(page, limit);
  }, [page, limit]);

  const handleNextPage = () => {
    if (page * limit < total) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  useEffect(() => {
    const fetchMoviesData = async () => {
      await fetchMovies();
    };

    fetchMoviesData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddMovie = () => {
    router.push("/movies/create");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        position: "relative",
        padding: 3,
      }}
    >
      {movies.map((movie) => (
        <Box
          key={movie.id}
          sx={{ display: "flex", alignItems: "center", mb: 2 }}
        >
          <Box sx={{ width: "100px", height: "150px", mr: 2 }}>
            <Image
              src={movie.poster}
              alt={movie.title}
              width="100"
              height="100"
              style={{ objectFit: "cover" }}
            />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {movie.title}
            </Typography>
            <Typography variant="body1">{movie.year}</Typography>
          </Box>
        </Box>
      ))}

      <Button
        onClick={logout}
        endIcon={<LogoutIcon />}
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          color: colors.white,
          fontWeight: "bold",
          fontSize: "0.7rem",
          "&:hover": {
            color: colors.fontColor,
          },
        }}
      >
        Logout
      </Button>

      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
        Your movie list is empty
      </Typography>
      <Button
        onClick={handleAddMovie}
        variant="contained"
        sx={{
          borderRadius: "0.5rem",
          backgroundColor: colors.success,
          color: colors.white,
          fontWeight: "bold",
          "&:hover": {
            backgroundColor: colors.highlightedSuccess,
          },
        }}
      >
        Add a new movie
      </Button>

      <button onClick={handlePreviousPage} disabled={page === 1}>
        Previous
      </button>
      <button onClick={handleNextPage} disabled={page * limit >= total}>
        Next
      </button>
    </Box>
  );
}
