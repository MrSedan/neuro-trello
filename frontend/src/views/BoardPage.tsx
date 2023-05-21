import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../tools/api";

interface category {
    id: number;
    name: string;
}

function BoardPage() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<category[]>([]);
    useEffect(() => {
        const getCateg = async () => {
            const pass = localStorage.getItem("Password") || "";
            try {
                const response = await axios.get("/category", {
                    headers: { Authorization: pass },
                });
                console.log(response.data);
                setCategories(response.data);
                return true;
            } catch (error) {
                console.error(error);
                navigate("/login");
            }
        };
        getCateg();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div>
            <h1>This is a test page</h1>
            <button
                onClick={() => {
                    localStorage.removeItem("Password");
                    navigate("/login", { replace: true });
                }}
            >
                Reset Password
            </button>
            <br />
            <Link to='/'>Go back</Link>
            {categories &&
                categories.map((item) => {
                    return (
                        <div key={item.id}>
                            <h2>{item.name}</h2>
                        </div>
                    );
                })}
        </div>
    );
}

export default BoardPage;
