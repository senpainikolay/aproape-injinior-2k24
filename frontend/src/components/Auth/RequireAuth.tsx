import {  Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { AuthContextType } from "../../context/AuthProvider";

export const RequireAuth = () => {
    const { auth }: AuthContextType = useAuth();
    if (auth?.isLoggedIn) {
        return <Outlet />;
    }
    return <Navigate to="/SignIn"  />;
};