import { Redirect } from 'expo-router';
import { useAppSelector } from '@/store/hooks';
import { homeRouteForRole } from '@/store/authSlice';

// Entry: route to the role home if authenticated, else to login.
export default function Index() {
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);
  if (isAuthenticated && user) return <Redirect href={homeRouteForRole(user.role) as never} />;
  return <Redirect href="/(auth)/login" />;
}
