/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { colors } from "@/providers/ThemeProvider";
import { useParams, useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as yup from "yup";
import { Movie, useMovies } from "@/providers/MoviesProvider";
import { CircularProgress, Grid2, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from "@mui/material";
import showToast from "@/utils/Toasts";
import { Delete } from "@mui/icons-material";
import { compressImage } from "@/utils/ImageCompression";
import { toast } from "react-toastify";

const validationSchema = yup.object({
  title: yup.string().required("Title is required"),
  year: yup
    .number()
    .required("Year is required")
    .min(1888, "Year must be later than 1888")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
});

export default function UpdateMovieForm() {
  const { slug } = useParams();

  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const { editMovie, getMovieById, removeMovie } = useMovies();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const selectMovie = async () => {
      const movie = await getMovieById(slug as string);
      if (movie) {
        setSelectedMovie(movie);
      }
      setIsFetching(false);
    };
    selectMovie();
  }, [slug]);

  const formik = useFormik({
    initialValues: {
      title: selectedMovie?.title || "",
      year: selectedMovie?.year || "",
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const movieData: any = {
          title: values.title,
          year: Number(values.year),
        };

        if (selectedFile) {
          setIsCompressing(true);
          const compressedFile = await compressImage(selectedFile);
          setIsCompressing(false);
          if (!compressedFile) {
            showToast.error("Failed to compress image");
            return;
          }
          movieData.file = selectedFile;
          movieData.fileMetaData = {
            name: selectedFile.name,
            type: selectedFile.type,
            size: selectedFile.size,
          };
        }
        await editMovie({
          id: slug as string,
          data: movieData,
        });
        showToast.success("Movie updated successfully");
        setSelectedFile(null);
        formik.resetForm();
        router.back();
      } catch (error) {
        console.log(error);
        showToast.error("Failed to update movie");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await removeMovie(slug as string);
      showToast.success("Movie deleted successfully");
      router.push("/movies");
    } catch (error) {
      console.log(error);
      showToast.error("Failed to delete movie");
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (isCompressing) {
      toast.loading("Compressing image...");
    } else {
      toast.dismiss();
    }
  }, [isCompressing]);

  if (isFetching) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: { xs: "center", md: "left" },
        justifyContent: "center",
        color: "white",
        padding: 4,
        width: "100vw",
      }}
    >
      <Box sx={{ alignSelf: { xs: "center", md: "flex-start" }, display: "flex", justifyContent: "space-between", width: "100%" }}>
        <Typography variant="h4" gutterBottom align="left" fontWeight="bolder">
          Edit movie
        </Typography>
        <IconButton onClick={handleClickOpen} sx={{ color: colors.error }}>
          <Delete />
        </IconButton>
      </Box>
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{
          width: "100%",
          paddingX: 2,
          paddingY: 2,
        }}
      >
        <Grid2
          container
          spacing={8}
          padding={{ xs: 2, md: 4 }}
          marginX={{ xs: 2, md: 16 }}
        >
          <Grid2>
            <Box
              sx={{
                backgroundColor: colors.input,
                border: `2px dashed ${colors.white}`,
                height: { xs: "24rem", md: "28rem" },
                width: { xs: "16rem", md: "26rem" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                position: "relative",
                cursor: "pointer",
              }}
              onClick={() => document.getElementById("image-upload")?.click()}
            >
              {selectedFile ? (
                <Image
                  src={URL.createObjectURL(selectedFile)}
                  alt="Uploaded"
                  layout="fill"
                  objectFit="contain"
                />
              ) : (
                selectedMovie?.poster && (
                  <Image
                    src={selectedMovie.poster}
                    alt="Uploaded"
                    layout="fill"
                    objectFit="contain"
                  />
                )
              )}
              <input
                hidden
                accept="image/*"
                type="file"
                id="image-upload"
                onChange={handleImageChange}
              />
            </Box>
          </Grid2>
          <Grid2 container>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                flexGrow: 1,
                maxWidth: { xs: "100%", md: "50rem" },
              }}
            >
              <TextField
                variant="outlined"
                placeholder="Title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
                fullWidth
              />
              <TextField
                variant="outlined"
                type="number"
                placeholder="Publishing year"
                name="year"
                value={formik.values.year}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.year && Boolean(formik.errors.year)}
                helperText={formik.touched.year && formik.errors.year}
                sx={{ width: { xs: "100%", md: "65%" } }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "start",
                  gap: 2,
                  mt: 2,
                }}
              >
                <Button
                  variant="outlined"
                  color="inherit"
                  sx={{ borderColor: colors.white, paddingX: 6 }}
                  onClick={() => {
                    router.back();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  type="submit"
                  sx={{ color: colors.white, fontWeight: "bold", paddingX: 6 }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Update"
                  )}
                </Button>
              </Box>
            </Box>
          </Grid2>
        </Grid2>
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle sx={{
          color: colors.error,
          fontWeight: "bold",
          fontSize: "1.5rem",
        }}>{"Delete Movie"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this movie? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
