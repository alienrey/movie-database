"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { colors } from "@/providers/ThemeProvider";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import showToast from "@/utils/Toasts";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
    .required('Confirm Password is required'),
  signupCode: Yup.string().required("Signup code is required"),
});

export default function SignUpPage() {
  const router = useRouter();
  const { createAccount } = useAuth();
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      signupCode: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setIsButtonLoading(true);
        await createAccount(values.email, values.password, values.name, values.signupCode);
        showToast.success("Signup successful");
        router.push("/auth/signin");
      } catch (error) {
        if (`${error}`.includes("users_email_unique")) {
          showToast.error("Email already exists.");
        } else if (`${error}`.includes("Invalid sign up code")) {
          showToast.error("Invalid signup code. Please ask the admin for the correct code.");
        } 
        else {
          console.log(error);
          showToast.error("Signup failed.");
        }
      } finally {
        setIsButtonLoading(false);
      }
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
        <Typography variant="h2" sx={{ marginBottom: "24px", fontWeight: 600 }}>
          Sign up
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            variant="outlined"
            type="text"
            placeholder="Name"
            {...formik.getFieldProps("name")}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            sx={{
              borderRadius: "20rem",
              marginBottom: "16px",
              input: { color: "white" },
            }}
          />
          <TextField
            fullWidth
            variant="outlined"
            type="email"
            placeholder="Email"
            {...formik.getFieldProps("email")}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            sx={{
              borderRadius: "20rem",
              marginBottom: "16px",
              input: { color: "white" },
            }}
          />
          <TextField
            fullWidth
            variant="outlined"
            type="password"
            placeholder="Password"
            {...formik.getFieldProps("password")}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            sx={{
              marginBottom: "16px",
              input: { color: "white" },
            }}
          />
          <TextField
            fullWidth
            variant="outlined"
            type="password"
            placeholder="Confirm Password"
            {...formik.getFieldProps("confirmPassword")}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            sx={{
              marginBottom: "16px",
              input: { color: "white" },
            }}
          />
          <TextField
            fullWidth
            variant="outlined"
            type="text"
            placeholder="Signup Code"
            {...formik.getFieldProps("signupCode")}
            error={formik.touched.signupCode && Boolean(formik.errors.signupCode)}
            helperText={formik.touched.signupCode && formik.errors.signupCode}
            sx={{
              marginBottom: "16px",
              input: { color: "white" },
            }}
          />
          <Button
            fullWidth
            type="submit"
            sx={{
              borderRadius: "12px",
              height: "56px",
              backgroundColor: colors.success,
            }}
            variant="contained"
            disabled={isButtonLoading}
          >
            {isButtonLoading ? (
              <CircularProgress size={24} sx={{ color: colors.white }} />
            ) : (
              <Typography
                sx={{
                  color: `${colors.white}`,
                  fontSize: "16px",
                  fontWeight: 800,
                }}
              >
                Sign Up
              </Typography>
            )}
          </Button>
        </form>
      </Box>
    </Box>
  );
}