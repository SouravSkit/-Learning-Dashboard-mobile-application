import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

interface AuthContextValue {
  isLoggedIn: boolean;
  signIn: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/// Switches between login and the dashboard — no real session storage needed.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const value = useMemo(
    () => ({ isLoggedIn, signIn: () => setIsLoggedIn(true) }),
    [isLoggedIn],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
