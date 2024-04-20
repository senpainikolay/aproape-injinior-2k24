import { Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { AuthContextType } from "../../context/AuthProvider";
import { AlreadyLoggedIn } from "./AlreadyLoggedIn";
export const RequireNoAuth = () => {
    const { auth }: AuthContextType = useAuth();
    if (!auth?.isLoggedIn) {
        return <Outlet />;
    }
    return <AlreadyLoggedIn />;
};