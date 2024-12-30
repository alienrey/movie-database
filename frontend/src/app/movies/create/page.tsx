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
import client from "@/utils/FeathersClient";

const validationSchema = yup.object({
  title: yup.string().required("Title is required"),
  year: yup
    .number()
    .required("Year is required")
    .min(1888, "Year must be later than 1888")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  image: yup
    .mixed()
    .required("Image is required")
    .test("fileSize", "File size is too large", (value) => {
      return value && (value as File).size <= 2 * 1024 * 1024; // 2MB
    })
    .test("fileType", "Unsupported file format", (value) => {
      return value && ["image/jpeg", "image/png", "image/gif"].includes((value as File).type);
    }),
});

export default function CreateMovieForm() {
  const router = useRouter();
  const [image, setImage] = useState<File | null>(null);

  const formik = useFormik({
    initialValues: {
      title: "",
      year: "",
      image: null as File | null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        console.log("Form values:", values);
        console.log("Image:", values.image);
        const fileMetaData = values.image ? {
          name: values.image.name,
          type: values.image.type,
          size: values.image.size,
        } : null;
        // Handle form submission here (e.g., API call)
        // Reset form after submission (optional)
        const result = await client.service("movies").create({...values, fileMetaData});
        console.log("Result:", result);
        formik.resetForm();
        setImage(null);
      } catch (error) {
        console.log(error)
      }
    },
  });

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    setImage(file);
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
        padding: 6,
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
          display: "flex",
          paddingX: 16,
          paddingY: 8,
          flexDirection: { xs: "column", md: "row" },
          gap: 12,
        }}
      >
        <Box
          sx={{
            backgroundColor: colors.input,
            border: `2px dashed ${colors.white}`,
            height: { xs: "16rem", md: "24rem" },
            width: { xs: "100%", md: "20rem" },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            position: "relative",
            cursor: "pointer",
          }}
          onClick={() => document.getElementById("image-upload")?.click()}
        >
          {image ? (
            <Image
              src={URL.createObjectURL(image)}
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
                    {formik.touched.image && formik.errors.image && (
            <Typography color="error">{formik.errors.image}</Typography>
          )}
        </Box>
        
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            flexGrow: 1,
            maxWidth: "50rem",
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
            sx={{
              width: "50%",
            }}
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
            sx={{
              width: "25%",
            }}
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
      </Box>
    </Box>
  );
}
