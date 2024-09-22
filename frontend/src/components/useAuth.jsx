import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const useAuth = () => {
    const [userRole, setUserRole] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const roles = decodedToken.roles;

                // Check token expiry
                const currentTime = Date.now() / 1000; // Get current time in seconds
                if (decodedToken.exp < currentTime) {
                    // Token expired, clear authentication state
                    localStorage.removeItem("token");
                    setIsAuthenticated(false);
                    setUserRole(null);
                } else {
                    setIsAuthenticated(true);
                    setUserRole(roles.includes("ROLE_ADMIN") ? "ROLE_ADMIN" : "ROLE_USER");
                }
            } catch (error) {
                console.error("Error decoding token:", error);
                localStorage.removeItem("token");
                setIsAuthenticated(false);
                setUserRole(null);
            }
        } else {
            setIsAuthenticated(false);
            setUserRole(null);
        }

        setIsLoading(false); // Set loading to false after auth check is complete
    }, []);
    return { isAuthenticated, userRole, isLoading };
};

export default useAuth;