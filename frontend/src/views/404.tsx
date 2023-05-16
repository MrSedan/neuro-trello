import { Link } from "react-router-dom";

function PageNotFound() {
    return (
        <div>
            <h1>Page not found</h1>
            <Link to="/">Back home</Link>
        </div>
    );
}

export default PageNotFound;
