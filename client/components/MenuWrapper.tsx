import { useSegments } from 'expo-router';
// import { useAuth } from '../context/auth'; // exemplo de context de auth
import Menu from './menu';

export default function MenuWrapper() {
  const isLoggedIn = 1; // seu context de auth
  const segments = useSegments();

  const isInAuthRoutes = segments[0] === '(screens)' && segments[1] === 'auth';

  if (!isLoggedIn || !isInAuthRoutes) return null;
  

  return <Menu />;
}
