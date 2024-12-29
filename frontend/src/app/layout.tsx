import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";
import { MoviesProvider } from "@/providers/MoviesProvider";
import { CustomThemeProvider } from "@/providers/ThemeProvider";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
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
