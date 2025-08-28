"use client";

import { useState, useEffect } from "react";
import { AuthState } from "@/types/auth";

export const useSplashViewModel = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true
  });

  const isAuthenticated = async (): Promise<boolean> => {
    // Simulate auth check - replace with actual auth logic
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock auth check - you can replace this with actual auth logic
        const isAuth = localStorage.getItem("isAuthenticated") === "true";
        resolve(isAuth);
      }, 1000);
    });
  };

  const checkAuthStatus = async (): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      const authenticated = await isAuthenticated();
      setAuthState({
        isAuthenticated: authenticated,
        isLoading: false,
        user: authenticated ?
        {
          id: "1",
          email: "user@example.com",
          name: "John Doe"
        } :
        undefined
      });
    } catch (error) {
      console.error("Auth check failed:", error);
      setAuthState({
        isAuthenticated: false,
        isLoading: false
      });
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return {
    authState,
    isAuthenticated,
    checkAuthStatus
  };
};