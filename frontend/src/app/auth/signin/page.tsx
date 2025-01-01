"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  TextField,
  Typography,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { colors } from "@/providers/ThemeProvider";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import showToast from "@/utils/Toasts";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function SignInPage() {
  const router = useRouter();

  const { login, isAuthenticated } = useAuth();
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setIsButtonLoading(true);
        await login(values.email, values.password, values.rememberMe);
        showToast.success("Login successful");
      } catch (error) {
        console.log(error);
        showToast.error("Email or password is incorrect.");
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
          Sign in
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            slotProps={{}}
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
          <FormControlLabel
            control={
              <Checkbox
                {...formik.getFieldProps("rememberMe")}
                checked={formik.values.rememberMe}
                sx={{ color: colors.input, fill: colors.input }}
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
                Login
              </Typography>
            )}
          </Button>
            <Button
            fullWidth
            variant="text"
            onClick={() => router.push('/auth/signup')}
            >
            <Typography
              sx={{
              mt: 1,
              color: `${colors.white}`,
              fontSize: "10px",
              fontWeight: 200,
              }}
            >
              Don&apos;t have an account?{" "}
              <Typography
              component="span"
              sx={{
                color: `${colors.white}`,
                fontSize: "10px",
                fontWeight: 200,
                "&:hover": {
                color: `${colors.highlightedSuccess}`,
                },
              }}
              >
              Sign up
              </Typography>
            </Typography>
            </Button>
        </form>
      </Box>
    </Box>
  );
}
