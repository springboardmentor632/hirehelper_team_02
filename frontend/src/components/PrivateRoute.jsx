import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // If token exists → allow access
  if (token) {
    return children;
  }

  // If not logged in → redirect ONCE to login
  return <Navigate to="/login" replace state={{ from: location }} />;
};

export default PrivateRoute;
