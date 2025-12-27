import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, role: allowedRole }) => {
  const { isAuth, role } = useSelector((state) => state.auth);

  if (!isAuth) return <Navigate to="/" replace />;

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;