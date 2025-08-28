"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode } from
"react";
import {
  ThemeProvider as MUIThemeProvider,
  createTheme,
  Theme } from
"@mui/material/styles";
import { CssBaseline } from "@mui/material";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    } else {
      // Check system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const theme: Theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
      primary: {
        main: "#2563eb", // blue-600
        light: "#3b82f6", // blue-500
        dark: "#1d4ed8" // blue-700
      },
      secondary: {
        main: "#10b981", // emerald-500
        light: "#34d399", // emerald-400
        dark: "#059669" // emerald-600
      },
      background: {
        default: isDarkMode ? "#111827" : "#f9fafb", // gray-900 : gray-50
        paper: isDarkMode ? "#1f2937" : "#ffffff" // gray-800 : white
      },
      text: {
        primary: isDarkMode ? "#f9fafb" : "#111827", // gray-50 : gray-900
        secondary: isDarkMode ? "#d1d5db" : "#6b7280" // gray-300 : gray-500
      }
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h3: {
        fontWeight: 700,
        fontSize: "2rem",
        lineHeight: 1.2
      }
    },
    components: {
      MuiCircularProgress: {
        styleOverrides: {
          root: {
            color: isDarkMode ? "#3b82f6" : "#2563eb"
          }
        }
      }
    }
  });

  const value: ThemeContextType = {
    isDarkMode,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value} data-oid="bcgxile">
      <MUIThemeProvider theme={theme} data-oid="bml19tr">
        <CssBaseline data-oid="c.d.d31" />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>);

};