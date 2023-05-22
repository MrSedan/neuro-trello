import { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import axios from "../tools/api";
import "../assets/board.css";

interface category {
    id: number;
    name: string;
}
interface task {
    id: number;
    name: string;
    categoryId: number;
}
function BoardPage() {
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);
    const [categories, setCategories] = useState<category[]>([]);
    const [tasks, setTasks] = useState<task[]>([]);
    const dialogRef = useRef<HTMLDialogElement>(null);
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
    const getTask = async () => {
        const pass = localStorage.getItem("Password") || "";
        try {
            const response = await axios.get("/task", {
                headers: { Authorization: pass },
            });
            console.log(response.data);
            setTasks(response.data);
            return true;
        } catch (error) {
            console.error(error);
            navigate("/login");
        }
    };

    useEffect(() => {
        getCateg();
        getTask();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    async function createCategory() {
        const categoryName = inputRef.current?.value || "";
        const pass = localStorage.getItem("Password") || "";
        try {
            await axios.post(
                "/category/new",
                {
                    name: categoryName,
                },
                {
                    headers: { Authorization: pass },
                },
            );
            console.log("Category Created!");
            getCateg();
            if (dialogRef.current) dialogRef.current.style.visibility = "hidden";
        } catch (error) {
            if ((error as AxiosError).response) {
                console.error("Error", error);
            }
        }
    }
    return (
        <div>
            <div className='menu'>
                <h1>Board</h1>
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
            <dialog open className='popUp' ref={dialogRef} style={{ visibility: "hidden" }}>
                <h1>Create new Category</h1>
                <button
                    onClick={() => {
                        if (dialogRef.current) dialogRef.current.style.visibility = "hidden";
                    }}
                >
                    Cancel
                </button>
                <input
                    ref={inputRef}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") createCategory();
                    }}
                    placeholder='Category name'
                />
                <button onClick={createCategory}>Confirm</button>
            </dialog>
            <button
                onClick={() => {
                    if (dialogRef.current) dialogRef.current.style.visibility = "visible";
                }}
            >
                <h2>New</h2>
            </button>

            <div className='desk'>
                {categories &&
                    categories.map((item) => {
                        return (
                            <div key={item.id} className='card'>
                                <h2>{item.name}</h2>
                                <hr />
                                <div className='task'>
                                    <p>
                                        {tasks
                                            .filter((task) => {
                                                return task.categoryId === item.id;
                                            })
                                            .map((task) => {
                                                return (
                                                    <div key={task.id}>
                                                        {task.name}
                                                        <hr />
                                                    </div>
                                                );
                                            })}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}

export default BoardPage;
