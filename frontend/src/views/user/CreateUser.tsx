import React from "react";
import axios from "axios";

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
        this.createUser = this.createUser.bind(this);
    }
    handleInput =(type:string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (type==='pass'){
            this.setState({
                password: event.target.value
            });
        } else if (type==='name'){
            this.setState({
                username: event.target.value
            });
        }
    }

    createUser = async () => {
        const data: CreateUserState = {
            username: this.state.username,
            password: this.state.password
        }
        await axios.put('http://localhost:3500/user/create', data)
            .then((response)=>{
                console.log(response)
            }).catch((e)=>console.log(e));
    }


    render() {
        return (
            <div>
                <input type="text" placeholder="Username" onChange={this.handleInput('name')}/>
                <input type="password" placeholder="Password" onChange={this.handleInput('pass')}/>
                <button onClick={this.createUser}>Submit</button>
            </div>
            
        )
    }
}

export default CreateUserPage;