import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const ProtectedRoutes = () => {
  const token = Cookies.get("accessToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  let decoded;
 
  try {
    decoded = jwtDecode(token);
  } catch (err) {
    console.error("Invalid token", err);
    return <Navigate to="/login" replace />;
  }


  const currentTime = Math.floor(Date.now() / 1000);
  const isExpired = decoded.exp && decoded.exp < currentTime;

  if (isExpired) {
    Cookies.remove("accessToken");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};



export default ProtectedRoutes;
