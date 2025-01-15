import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "./api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "./constants";
import { useState, useEffect } from "react";
import { useAuth } from './components/AuthContext';

function ProtectedRoute({ children }) {
    const { isAuthorized, setIsAuthorized } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check authentication status on component mount
        const storedAuthStatus = localStorage.getItem("isAuthorized");
        if (storedAuthStatus === "true") {
            setIsAuthorized(true);
        }
        auth().finally(() => setIsLoading(false));
    }, []);

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            const res = await api.post("/auth/refresh/", {
                refresh: refreshToken,
            });
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsAuthorized(true);
                localStorage.setItem("isAuthorized", "true"); // Persist auth status
            } else {
                setIsAuthorized(false);
                localStorage.setItem("isAuthorized", "false");
            }
        } catch (error) {
            console.log(error);
            setIsAuthorized(false);
            localStorage.setItem("isAuthorized", "false");
        }
    };

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        console.log(token);
        if (!token) {
            setIsAuthorized(false);
            localStorage.setItem("isAuthorized", "false");
            return;
        }
        try {
            const decoded = jwtDecode(token); // Corrected decode usage
            const tokenExpiration = decoded.exp;
            const now = Date.now() / 1000;

            if (tokenExpiration < now) {
                await refreshToken();
            } else {
                setIsAuthorized(true);
                localStorage.setItem("isAuthorized", "true");
            }
        } catch (error) {
            console.error("Token decoding error:", error);
            setIsAuthorized(false);
            localStorage.setItem("isAuthorized", "false");
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
