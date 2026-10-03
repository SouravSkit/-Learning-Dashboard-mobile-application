import { useCallback, useState } from 'react';
import { MockCourseAPI } from '../repository/MockCourseAPI';

const api = new MockCourseAPI();

/// Login form state, validation, and the simulated network request.
export function useLoginViewModel() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useCallback(async (): Promise<boolean> => {
    setErrorMessage(null);

    // Validation
    if (email.trim().length === 0) {
      setErrorMessage('Email cannot be empty');
      return false;
    }
    if (password.length === 0) {
      setErrorMessage('Password cannot be empty');
      return false;
    }

    // Simulated network request
    setIsLoading(true);
    try {
      await api.login(email, password);
      setIsLoggedIn(true);
      return true;
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [email, password]);

  return { email, setEmail, password, setPassword, errorMessage, isLoading, isLoggedIn, login };
}
