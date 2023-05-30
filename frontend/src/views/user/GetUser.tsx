import axios from "axios";
import React from "react";
import { withRouter } from "../../tools/withRouter";

interface GetUserState {
    username?: string;
}

class GetUserPage extends React.Component<{ params: { id: string } }, GetUserState> {
    user_id?: string;

    constructor(props: { params: { id: string } }) {
        super(props);
        const { id } = this.props.params;
        this.user_id = id;
        this.state = {
            username: "",
        };
    }

    componentDidMount(): void {
        this.getUser();
    }

    async getUser() {
        await axios
            .get(`http://localhost:3500/user/get/${this.user_id}`)
            .then((response) => {
                const data = response.data;
                this.setState({
                    username: data.username,
                });
            })
            .catch((e) => {
                this.setState({
                    username: e.toJSON().status,
                });
            });
    }

    render() {
        return (
            <div>
                <h1>Username: {this.state.username}</h1>
            </div>
        );
    }
}

export default withRouter(GetUserPage);
