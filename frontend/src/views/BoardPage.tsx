import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../tools/api";
import "../assets/board.css";

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
            <div className='menu'>
                <h1>Categories page</h1>
                <button
                    onClick={() => {
                        localStorage.removeItem("Password");
                        navigate("/login", { replace: true });
                    }}
                >
                    Log Out
                </button>
                <br />
                <Link to='/'>Go back</Link>
                <br />
            </div> 
            <button
                    onClick={() => {

                    }}
                > 
                <h2>New</h2> 
                </button>
            <div className='desk'>

                {categories &&
                    categories.map((item) => {
                        return (
                            <div key={item.id} className='card' >
                                <h2>{item.name}</h2>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}

export default BoardPage;
