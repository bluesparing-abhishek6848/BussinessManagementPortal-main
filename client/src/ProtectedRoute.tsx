
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import type { RootState } from './store';
import { mapUserRoute } from './Constant';
 

interface Props {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: Props) => {
  const { isLogin, user } = useSelector((state: RootState) => state.auth);
  const userRole = mapUserRoute(user?.role||"")

  if (!isLogin || !user) return <Navigate to="/" replace />;
  if (!allowedRoles.includes(userRole)) return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
