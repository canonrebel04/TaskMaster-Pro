"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode } from
"react";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user?: User;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | undefined>();

  const signUp = async (email: string, password: string): Promise<void> => {
    try {
      // Create user in PocketBase
      const response = await fetch('http://127.0.0.1:8090/api/collections/users/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          passwordConfirm: password,
          name: email.split('@')[0], // Default name from email
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create account');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account';
      throw new Error(errorMessage);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      // Replace with actual PocketBase login logic
      const response = await fetch('http://127.0.0.1:8090/api/collections/users/auth-with-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      setUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
      });
      setIsAuthenticated(true);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid credentials';
      throw new Error(errorMessage);
    }
  };

  const logout = async (): Promise<void> => {
    setUser(undefined);
    setIsAuthenticated(false);
  };

  const checkAuthStatus = async (): Promise<void> => {
    try {
      setIsLoading(true);
      // Replace with actual PocketBase auth check
      const isAuth = localStorage.getItem("isAuthenticated") === "true";

      setIsAuthenticated(isAuth);
      setUser(
        isAuth ?
        {
          id: "1",
          email: "user@example.com",
          name: "John Doe"
        } :
        undefined
      );
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuthenticated(false);
      setUser(undefined);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value = React.useMemo<AuthContextType>(() => ({
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    signUp,
    checkAuthStatus
  }), [isAuthenticated, isLoading, user]);

  return (
    <AuthContext.Provider value={value} data-oid="xqvslk:">
      {children}
    </AuthContext.Provider>);

};