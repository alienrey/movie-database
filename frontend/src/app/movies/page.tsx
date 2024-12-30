"use client";
import { useAuth } from "@/providers/AuthProvider";
import { Box, Button, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { colors } from "@/providers/ThemeProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMovies } from "@/providers/MoviesProvider";

export default function MoviesPage() {
  const { logout } = useAuth();
  const { fetchMovies } = useMovies();
  const router = useRouter();

  useEffect(() => {
    const fetchMoviesData = async () => {
      await fetchMovies();
    };

    fetchMoviesData();
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
        backgroundColor: "#023047",
        color: "#fff",
        position: "relative",
        padding: 3,
      }}
    >
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

      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: "100px",
          background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.5))",
        }}
      ></Box>
    </Box>
  );
}
