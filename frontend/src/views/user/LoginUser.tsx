import { AxiosError } from "axios";
import axios from "../../tools/api";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/styles/login.scss";
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
            <div className='login__entry-field'>
                <h1>Login</h1>
                <input
                    type='password'
                    ref={inputRef}
                    className='login__pass-field'
                    onKeyDown={(e) => {
                        if (e.key === "Enter") login();
                    }}
                    placeholder='Password'
                />
                <button onClick={login} type='submit' className='login__submit-btn'>
                    Login
                </button>
            </div>
            <div className={`login__error ${error !== "" ? "active" : ""}`}>{error}</div>
        </div>
    );
}
