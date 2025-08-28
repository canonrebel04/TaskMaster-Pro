export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export interface SplashViewModel {
  isAuthenticated: () => Promise<boolean>;
  checkAuthStatus: () => Promise<void>;
}