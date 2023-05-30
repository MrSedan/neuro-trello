import { AxiosError } from "axios";
import axios from "../../tools/api";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/login.css";
export default function LoginUserPage() {
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState("");
    async function login() {
        const password = inputRef.current?.value || "";
        console.log(process.env.REACT_APP_BASE_URL);
        setError("");
        try {
            await axios.post("/user/login", {
                password: password,
            });
            localStorage.setItem("Password", password);
            navigate("/board");
        } catch (error) {
            if ((error as AxiosError).response) {
                console.log((error as AxiosError).response!.status, "wrong pass");
                setError("Wrong pass!");
            } else {
                console.error("Error", error);
                setError("Something went wrong!");
            }
            localStorage.removeItem("Password");
        }
    }
    return (
        <div className='login'>
            <div className='entryField'>
                <h1>Login</h1>
                <input
                    type='password'
                    ref={inputRef}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") login();
                    }}
                    placeholder='Password'
                />
                <button onClick={login} type='submit'>
                    Login
                </button>
            </div>
            <div className={`error ${error !== "" ? "active" : ""}`}>{error}</div>
        </div>
    );
}
