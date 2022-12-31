import React from "react";
import { Link } from "react-router-dom";

class PageNotFound extends React.Component {
    render() {
        return (
            <div>
                <h1>Page not found</h1>
                <Link to='/'>Back home</Link>
            </div>
        );
    }
}

export default PageNotFound;