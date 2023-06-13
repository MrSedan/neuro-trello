import { useNavigate } from "react-router-dom";
import "../assets/styles/hello.scss";

function HomePage() {
    const navigate = useNavigate();
    return (
        <div
            className='hello-page'
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
