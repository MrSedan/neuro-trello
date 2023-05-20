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
    try {
      await axios.post("/user/login", {
        password: password,
      });
      localStorage.setItem("Password", password);
      console.log("Saved pass");
      navigate("/test");
    } catch (error) {
      if ((error as AxiosError).response)
        console.log((error as AxiosError).response!.status);
      else console.error("Error", error);
      localStorage.removeItem("Password");
      console.log("Deleted pass");
      setError("Error!");
    }
  }
  return (
    <div className="login">
      {error !== "" && <div className="error">{error}</div>}
      <div className="entryField">
        <h1>Login</h1>
        <input type="password" ref={inputRef} />
        <button onClick={login}>Login</button>
      </div>
    </div>
  );
}
