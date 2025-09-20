import { Navigate, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { getStoredUser, isAdminUser } from "../../lib/adminAuth";

const RequireAdmin = ({ children }) => {
  const location = useLocation();

  const { user, isAdmin } = useMemo(() => {
    const storedUser = getStoredUser();
    return {
      user: storedUser,
      isAdmin: isAdminUser(storedUser),
    };
  }, []);

  if (!isAdmin) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname, reason: "admin-required" }}
      />
    );
  }

  return typeof children === "function" ? children({ user }) : children;
};

export default RequireAdmin;
