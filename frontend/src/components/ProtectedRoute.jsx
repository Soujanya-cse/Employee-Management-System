import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {

  const {
    user,
    isAuthenticated,
    loading
  } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(user.type)
  ) {

    if (user.type === "MANAGER") {
      return <Navigate to="/manager" replace />;
    }

    if (user.type === "EMPLOYEE") {
      return <Navigate to={`/employee/${user.id}`} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;