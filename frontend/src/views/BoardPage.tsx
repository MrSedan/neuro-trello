import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import axios from "../tools/api";
import "../assets/board.css";
import ModalCreate from "./ModalCreate";

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
    const catInputRef = useRef<HTMLInputElement>(null);
    const taskInputRef = useRef<HTMLInputElement>(null);
    const [categories, setCategories] = useState<category[]>([]);
    const [tasks, setTasks] = useState<task[]>([]);
    const [categoryId, setCatId] = useState(0);
    const [openCreateCategory, setOpenCreateCategory] = useState(false);
    const [openCreateTask, setOpenCreateTask] = useState(false);
    const catDialogRef = useRef<HTMLDialogElement>(null);
    const taskDialogRef = useRef<HTMLDialogElement>(null);
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
        const categoryName = catInputRef.current?.value || "";
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
            if (catDialogRef.current) catDialogRef.current.style.visibility = "hidden";
        } catch (error) {
            if ((error as AxiosError).response) {
                console.error("Error", error);
            }
        }
    }
    async function createTask(catId: number) {
        const taskName = taskInputRef.current?.value || "";
        const pass = localStorage.getItem("Password") || "";
        try {
            await axios.post(
                "/task/new",
                {
                    name: taskName,
                    category_id: catId,
                },
                {
                    headers: { Authorization: pass },
                },
            );
            console.log("Task Created!");
            getTask();
            if (taskDialogRef.current) taskDialogRef.current.style.visibility = "hidden";
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
                <div>
                    <button
                        onClick={() => {
                            navigate("/", { replace: true });
                        }}
                    >
                        Go back
                    </button>
                    <button
                        style={{ background: "#e15f41", color: "white" }}
                        onClick={() => {
                            localStorage.removeItem("Password");
                            navigate("/login", { replace: true });
                        }}
                    >
                        Log Out
                    </button>
                </div>
            </div>
            {openCreateCategory ? (
                <ModalCreate
                    name='Category'
                    setOpen={setOpenCreateCategory}
                    onConfirm={createCategory}
                    inputRef={catInputRef}
                />
            ) : null}
            {openCreateTask ? (
                <ModalCreate
                    name='Task'
                    setOpen={setOpenCreateTask}
                    onConfirm={() => {
                        createTask(categoryId);
                    }}
                    inputRef={taskInputRef}
                />
            ) : null}
            <button
                id='newCat'
                onClick={() => {
                    setOpenCreateCategory(true);
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
                                <button
                                    onClick={() => {
                                        setCatId(item.id);
                                        setOpenCreateTask(true);
                                    }}
                                >
                                    +
                                </button>
                                <hr />
                                <div className='task'>
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
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}

export default BoardPage;
