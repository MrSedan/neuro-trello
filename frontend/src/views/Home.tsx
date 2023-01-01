import React from 'react';
import { Link } from 'react-router-dom';

class HomePage extends React.Component {
    render() {
        return (
            <div>
                <h1>Test</h1>
                <Link to="/user/create">To user</Link>
            </div>
        );
    }
}

export default HomePage;