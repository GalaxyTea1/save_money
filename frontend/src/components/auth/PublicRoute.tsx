import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const accessToken = useAuthStore(state => state.accessToken);

  if (accessToken) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;