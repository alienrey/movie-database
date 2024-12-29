/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import IconButton from "@mui/material/IconButton";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { colors } from "@/providers/ThemeProvider";

export default function EditMovieForm() {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = () => {
    // Handle form submission here (e.g., API call)
    console.log("Title:", title);
    console.log("Year:", year);
    console.log("Image:", image);
    // Reset form after submission (optional)
    setTitle("");
    setYear("");
    setImage(null);
  };

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    setImage(file);
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
        sx={{
          width: "100%",
          display: "flex",
          padding: 8,
          flexDirection: { xs: "column", md: "row" },
          gap: 12,
        }}
      >
        <Box
          sx={{
            backgroundColor: colors.input,
            border: `2px dashed ${colors.white}`,
            height: { xs: "16rem", md: "24rem" },
            width: { xs: "100%", md: "22rem" },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
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
              <IconButton component="label">
                <CloudUploadIcon sx={{ fontSize: 40, color: "#bdbdbd" }} />
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleImageChange}
                />
              </IconButton>
              <Typography variant="body2" color="#bdbdbd">
                Drop an image here
              </Typography>
            </>
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{
              width: "50%",
            }}
          />
          <TextField
            variant="outlined"
            type="number"
            placeholder="Publishing year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
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
              onClick={() => console.log("Cancel clicked")}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleSubmit}
              sx={{ color: colors.white, fontWeight: "bold", paddingX: 6 }}
            >
              Update
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
