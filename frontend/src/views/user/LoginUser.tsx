import axios from "axios";
import React from "react";

class LoginUserPage extends React.Component {
    password?: string
    username?: string
    login() {
        axios.post()
    }
    render() {
        return (
            <div>
                <input type="text" onChange={(event)=>this.username=event.target.value}/>
                <input type="password" onChange={(event)=>this.password=event.target.value}/>
                <button></button>
            </div>
        )
    }
}

export default LoginUserPage;