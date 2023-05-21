import { useNavigate } from "react-router-dom";
import "../assets/home.css";

function HomePage() {
    const navigate = useNavigate();
    return (
        <div
            className='homePage'
            onClick={() => {
                navigate("/board");
            }}
        >
            <h1>Welcome to Neuro-Trello</h1>
            <h3>Click to go to board</h3>
        </div>
    );
}

export default HomePage;
