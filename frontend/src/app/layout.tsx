import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";
import { MoviesProvider } from "@/providers/MoviesProvider";
import { CustomThemeProvider } from "@/providers/ThemeProvider";

export const metadata: Metadata = {
  title: "Movie Database",
  description: "By A.R. Elangos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CustomThemeProvider>
          <AuthProvider>
            <MoviesProvider>{children}</MoviesProvider>
          </AuthProvider>
        </CustomThemeProvider>
      </body>
    </html>
  );
}
