import React from "react";
import { useParams } from "react-router-dom";
import { withRouter } from "../../tools/withRouter";

class GetUserPage extends React.Component<{params: {id: string}}> {
    user_id?: string;
    constructor(props: {params: {id: string}}){
        super(props);
        const { id } = this.props.params;
        this.user_id = id;
        
    }

    render() {
        return (
            <h1>{this.user_id}</h1>
        )
    }
}

export default withRouter(GetUserPage);