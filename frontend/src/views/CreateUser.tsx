import React from "react";
import * as crypto from "crypto";

interface CreateUserProps {

}

interface CreateUserState {
    username?: string
    password?: string
}

class CreateUserPage extends React.Component<CreateUserProps, CreateUserState> {
    constructor(props: CreateUserProps){
        super(props);
        this.state = {username: ''};
    }
    handleInput =(type:string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (type=='pass'){
            this.setState({
                password: event.target.value
            });
        } else if (type=='name'){
            this.setState({
                username: event.target.value
            });
        }
    }

    render() {
        return (
            <div>
                <input type="text" placeholder="Username" onChange={this.handleInput('name')}/>
                <input type="password" placeholder="Password" onChange={this.handleInput('pass')}/>
                <button>Submit</button>
            </div>
            
        )
    }
}

export default CreateUserPage;