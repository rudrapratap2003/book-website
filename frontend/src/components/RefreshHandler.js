import { useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const RefreshHandler = ({ setIsAuthenticated }) => {
  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => {
    axios
      .get("/api/v1/me", { withCredentials: true })
      .then((res) => {
        const user = res.data
        setIsAuthenticated(user);

        // already authenticated; redirect away from auth pages
        if (location.pathname === "/login" || location.pathname === "/signup") {
          navigate("/", { replace: true });
        }
      })
      .catch(() => {
        // --- user is NOT logged-in ---
        setIsAuthenticated(false);

        // stay on "/" (public home) or "/login" or "/signup"; otherwise bounce to "/"
        if (
          location.pathname !== "/login" &&
          location.pathname !== "/signup"
        ) {
          navigate("/", { replace: true });   // show Home with the Log-In button
        }
      });
  }, [location.pathname, navigate, setIsAuthenticated]);

  return null; // nothing to render
};

export default RefreshHandler;