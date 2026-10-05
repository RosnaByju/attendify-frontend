import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const loggedInUser = sessionStorage.getItem("loggedInUser");

  if (!loggedInUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;