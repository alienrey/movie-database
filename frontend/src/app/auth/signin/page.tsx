'use client';
import React from "react";
import { Box, Button, Checkbox, TextField, Typography, FormControlLabel } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { colors } from "@/providers/ThemeProvider";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function SignInPage() {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 360,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h2"
          sx={{ marginBottom: "24px", fontWeight: 600 }}
        >
          Sign in
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            variant="outlined"
            type="email"
            placeholder="Email"
            {...formik.getFieldProps('email')}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            sx={{
              marginBottom: "16px",
              input: { color: "white" },
            }}
          />
          <TextField
            fullWidth
            variant="outlined"
            type="password"
            placeholder="Password"
            {...formik.getFieldProps('password')}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            sx={{
              marginBottom: "16px",
              input: { color: "white" },
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                {...formik.getFieldProps('rememberMe')}
                checked={formik.values.rememberMe}
              />
            }
            label={
              <Typography sx={{ color: "white", fontSize: "14px" }}>
                Remember me
              </Typography>
            }
            sx={{ marginBottom: "16px" }}
          />
          <Button
            fullWidth
            type="submit"
            sx={{ borderRadius: "12px", height: "56px", backgroundColor: "#2BD17E" }}
            variant="contained"
          >
            <Typography sx={{ color: `${colors.white}`, fontSize: "16px", fontWeight: 800 }}>
              Login
            </Typography>
          </Button>
        </form>
      </Box>
    </Box>
  );
}