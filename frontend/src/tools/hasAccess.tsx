import axios from "../tools/api";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoutes() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    useEffect(() => {
        const pass = localStorage.getItem("Password") || "";
        const isAuth = async () => {
            await axios
                .post("/user/login", {
                    password: pass,
                })
                .then((res) => {
                    console.log(res);
                    setIsLoggedIn(true);
                    setIsChecking(false);
                    return;
                })
                .catch((e) => {
                    console.log("You haven't access to this page");
                    setIsChecking(false);
                });
        };
        isAuth();
    }, []);

    if (isChecking) return <p>Checking...</p>;
    return isLoggedIn ? <Outlet /> : <Navigate to='/login' replace />;
}
