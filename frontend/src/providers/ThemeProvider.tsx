"use client";
import React, { ReactNode } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "@fontsource/montserrat";

const error = "#EB5757";
const success = "#2BD17E";
const highlightedSuccess = "#059669";
const background = "#093545";
const input = "#224957";
const card = "#092C39";
const fontColor = "#EBEEF5";
const white = "#FFFFFF";

const theme = createTheme({
  palette: {
    error: {
      main: error,
    },
    success: {
      main: success,
    },
    background: {
      default: background,
    },
    primary: {
      main: input,
    },
    secondary: {
      main: card,
    },
    text: {
      primary: fontColor,
    },
  },
  typography: {
    fontFamily: "Montserrat, Arial, sans-serif",
    allVariants: {
      color: fontColor,
    },
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: input,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: card,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

interface CustomThemeProviderProps {
  children: ReactNode;
}

export const CustomThemeProvider: React.FC<CustomThemeProviderProps> = ({
  children,
}) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export const colors = {
  error,
  success,
  highlightedSuccess,
  background,
  input,
  card,
  fontColor,
  white,
};
