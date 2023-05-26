import { useContext, useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import axios from "../tools/api";
import "../assets/board.css";
import ModalCreate from "./ModalCreate";
import ModalCategory from "./ModalCategory";
import { Task, Category } from "./Interfaces";
import { SocketContext } from "../context/socket";

interface category {
    id: number;
    name: string;
}
interface MyError extends Error {
    data: any;
}
function BoardPage() {
    const { socket } = useContext(SocketContext);
    const navigate = useNavigate();
    const catInputRef = useRef<HTMLInputElement>(null);
    const taskInputRef = useRef<HTMLInputElement>(null);
    const [categories, setCategories] = useState<category[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [categoryId, setCatId] = useState(0);
    const [openCreateCategory, setOpenCreateCategory] = useState(false);
    const [openCreateTask, setOpenCreateTask] = useState(false);
    const [openModalCategory, setOpenModalCategory] = useState(false);
    const catDialogRef = useRef<HTMLDialogElement>(null);
    const taskDialogRef = useRef<HTMLDialogElement>(null);
    const [error, setError] = useState("");
    useEffect(() => {
        const onConnect = () => {
            socket.emit("get_categories");
            socket.emit("get_tasks");
        };
        const onDisconnect = () => {};
        const onError = (error: Error) => {
            console.log("Error:", error.message);
            console.log((error as MyError).data);
            if ((error as MyError).data) setError((error as MyError).data.type);
        };
        const onTasks = (tasks: Task[]) => {
            setTasks(tasks);
        };
        const onNewTask = (task: Task) => {
            if (tasks.indexOf(task) === -1) setTasks((previous) => [...previous, task]);
        };
        const onCategory = (categories: Category[]) => {
            setCategories(categories);
        };
        const onNewCategory = (category: Category) => {
            if (categories.indexOf(category) === -1) setCategories((previous) => [...previous, category]);
        };
        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("connect_error", onError);
        socket.on("tasks", onTasks);
        socket.on("new_task", onNewTask);
        socket.on("categories", onCategory);
        socket.on("new_category", onNewCategory);
        socket.on("error", onError);
        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("connect_error", onError);
            socket.off("tasks", onTasks);
            socket.off("new_task", onNewTask);
            socket.off("categories", onCategory);
            socket.off("new_category", onNewCategory);
            socket.off("error", onError);
        };
    }, [socket, categories, tasks]);
    useEffect(() => {
        socket.connect();
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

            {/* TODO: {openModalCategory ? <ModalCategory catName='' setOpen={setOpenModalCategory} tasks={} /> : null} */}

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
