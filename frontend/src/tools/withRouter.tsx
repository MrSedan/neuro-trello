import { useParams } from "react-router-dom";

export function withRouter(Child: any) {
    return (props: {}) => {
        const params = useParams();
        return <Child {...props} params={params} />;
    };
}
