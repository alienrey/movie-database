/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { colors } from "@/providers/ThemeProvider";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as yup from "yup";
import { useMovies } from "@/providers/MoviesProvider";
import { Grid2 } from "@mui/material";

const validationSchema = yup.object({
  title: yup.string().required("Title is required"),
  year: yup
    .number()
    .required("Year is required")
    .min(1888, "Year must be later than 1888")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
});

export default function CreateMovieForm() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { addMovie } = useMovies();

  const formik = useFormik({
    initialValues: {
      title: "",
      year: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        if (!selectedFile) {
          return;
        }
        const fileMetaData = {
          name: selectedFile.name,
          type: selectedFile.type,
          size: selectedFile.size,
        };
        await addMovie({
          title: values.title,
          year: Number(values.year),
          file: selectedFile,
          fileMetaData,
        });
        formik.resetForm();
        setSelectedFile(null);
      } catch (error) {
        console.log(error);
      }
    },
  });

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    formik.setFieldValue("image", file);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: { xs: "center", md: "left" },
        justifyContent: "center",
        color: "white",
        padding: 8,
        width: "100vw"
      }}
    >
      <Box sx={{ alignSelf: { xs: "center", md: "flex-start" } }}>
        <Typography variant="h4" gutterBottom align="left" fontWeight="bolder">
          Create a new movie
        </Typography>
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
                <>
                  <CloudUploadIcon sx={{ fontSize: 40, color: "#bdbdbd" }} />
                  <Typography variant="body2" color="#bdbdbd">
                    Drop an image here
                  </Typography>
                </>
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
                sx={{ width: { xs: "100%", md: "60%" } }}
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
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </Grid2>
        </Grid2>
      </Box>
    </Box>
  );
}
