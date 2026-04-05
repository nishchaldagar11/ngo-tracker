import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {

  // 🔥 user object nikalo
  const user = JSON.parse(localStorage.getItem("user"));

  // 🔥 token check karo
  if (!user || !user.token) {
    return <Navigate to="/login" />;
  }

  return children;
}