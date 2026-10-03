import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

/// Entry route: sends the user to the dashboard or the login screen.
export default function Index() {
  const { isLoggedIn } = useAuth();
  return <Redirect href={isLoggedIn ? '/dashboard' : '/login'} />;
}
