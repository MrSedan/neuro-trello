import { Link, useNavigate } from "react-router-dom";
import "../assets/home.css";

function HomePage() {
    const navigate = useNavigate();
    return (
        <div
            className="homePage"
            onClick={() => {
                console.log("aboba");
                navigate("/user/create");
            }}
        >
            <h1>Welcome to Neuro-Trello</h1>
            <h3>Click to go to user login and create</h3>
        </div>
    );
}

export default HomePage;
