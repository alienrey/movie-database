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
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";

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
        height: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          paddingX: 8,
          paddingY: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
            {movies.length > 0 && (
            <>
              <Typography
              variant="h4"
              sx={{
                color: colors.white,
                fontWeight: "bold",
                marginRight: 2,
              }}
              >
              My Movies
              </Typography>
              <IconButton
              onClick={handleAddMovie}
              sx={{
                backgroundColor: 'transparent',
                borderColor: colors.white,
                color: colors.white,
                borderRadius: "50%",
                border: `2px solid ${colors.white}`,
                width: "1.5rem",
                height: "1.5rem",
                "&:hover": {
                backgroundColor: colors.input,
                },
              }}
              >
              <AddIcon />
              </IconButton>
            </>
            )}
        </Box>
        <Button
          onClick={logout}
          endIcon={<LogoutIcon />}
          sx={{
            color: colors.white,
            fontWeight: "bold",
            fontSize: "1rem",
            "&:hover": {
              color: colors.fontColor,
            },
          }}
        >
          Logout
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
          position: "relative",
        }}
      >
        <Grid container spacing={2} width="50%">
          {movies.map((movie) => (
            <Grid
              key={movie.id}
              size={{
                xs: 6,
                md: 3,
              }}
              sx={{ justifyContent: "center" }}
            >
                <Card
                onClick={() => router.push(`/movies/update/${movie.id}`)}
                sx={{
                  backgroundColor: colors.card,
                  maxWidth: 150,
                  maxHeight: 260,
                  padding: 1,
                  borderRadius: 2,
                  "&:hover": {
                  backgroundColor: colors.input,
                  cursor: "pointer",
                  },
                }}
                >
                <CardMedia
                  component="img"
                  height="180"
                  image={movie.poster}
                  alt={movie.title}
                  sx={{ objectFit: "cover", borderRadius: 1 }}
                />
                <CardContent sx={{ padding: 1 }}>
                  <Typography gutterBottom variant="body2" noWrap>
                  {movie.title}
                  </Typography>
                  <Typography variant="caption">{movie.year}</Typography>
                </CardContent>
                </Card>
            </Grid>
          ))}
        </Grid>
        {isLoading ? (
          <></>
        ) : (
          movies.length === 0 && (
            <Box
              sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "80vh",
              }}
            >
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
            </Box>
          )
        )}
        {movies.length > 0 && (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              mt: 2,
              position: "fixed",
              bottom: 30,
            }}
          >
            <Button
              variant="text"
              onClick={handlePreviousPage}
              sx={{ color: colors.white, borderColor: colors.white }}
            >
              Prev
            </Button>
            {pageNumbers.map((pageNumber) => (
              <Button
                key={pageNumber}
                onClick={() => handlePageClick(pageNumber)}
                variant={page === pageNumber ? "contained" : "outlined"}
                sx={{
                  color: colors.white,
                  minWidth: "30px",
                  padding: "4px 16px",
                  backgroundColor:
                    page === pageNumber ? colors.success : colors.card,
                  borderColor: colors.card,
                  fontWeight: "bold",
                }}
              >
                {pageNumber}
              </Button>
            ))}
            <Button
              variant="text"
              onClick={handleNextPage}
              sx={{ color: colors.white, borderColor: colors.white }}
            >
              Next
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
