"use client";
import { useAuth } from "@/providers/AuthProvider";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { colors } from "@/providers/ThemeProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMovies } from "@/providers/MoviesProvider";
import Grid from "@mui/material/Grid2";
export default function MoviesPage() {
  const { logout } = useAuth();
  const { fetchMovies, movies, page, setPage, limit, total } = useMovies();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const handleFetchMovies = async () => {
      setIsLoading(true);
      await fetchMovies(page);
      setIsLoading(false);
    };

    handleFetchMovies();
  }, [page]);

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

  const handlePageClick = (pageNumber: number) => {
    setPage(pageNumber);
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

  const totalPages = Math.ceil(total / limit);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

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
        padding: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 2,
          padding: { xs: 2, md: 2 },
          width: "70%",
        }}
      >
        <Grid
          container
          spacing={{ xs: 2, md: 8 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {movies.map((movie, index) => (
            <Grid size={3} key={index}>
              <Box>
                <Card
                  sx={{
                    backgroundColor: "#18344a",
                    color: "white",
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <CardMedia
                    sx={{
                      height: { xs: 80, md: 120 },
                      width: { xs: 60, md: 100 },
                      objectFit: "cover",
                    }}
                    component="img"
                    image={movie.poster}
                    alt={movie.title}
                  />
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {movie.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {movie.year}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

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

      {isLoading ? (
        <></>
      ) : (
        movies.length === 0 && (
          <>
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
          </>
        )
      )}
      {movies.length > 0 && (
        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          <Button onClick={handlePreviousPage} disabled={page === 1}>
            Previous
          </Button>
          {pageNumbers.map((pageNumber) => (
            <Button
              key={pageNumber}
              onClick={() => handlePageClick(pageNumber)}
              variant={page === pageNumber ? "contained" : "outlined"}
            >
              {pageNumber}
            </Button>
          ))}
          <Button onClick={handleNextPage} disabled={page * limit >= total}>
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
}
