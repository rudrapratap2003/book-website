import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axiosInstance.js";

const RefreshHandler = ({ setIsAuthenticated }) => {
  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => {
    api.get(`/api/v1/me`)
      .then((res) => {
        const user = res.data
        setIsAuthenticated(user);

        if (location.pathname === "/login" || location.pathname === "/signup") {
          navigate("/", { replace: true });
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
        if (
          location.pathname !== "/login" &&
          location.pathname !== "/signup"
        ) {
          navigate("/", { replace: true });
        }
      });
  }, [location.pathname, navigate, setIsAuthenticated]);

  return null;
};

export default RefreshHandler;