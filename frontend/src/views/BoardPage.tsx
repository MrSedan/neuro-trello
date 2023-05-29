import { useContext, useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import axios from "../tools/api";
import "../assets/board.css";
import ModalCreate from "./ModalCreate";
import ModalEdit from "./ModalEdit";
import { Task, Category } from "./Interfaces";
import { SocketContext } from "../context/socket";
import pencil from "../assets/img/pencil.svg";
import { dragEndHandler, dragOverHandler, dragStartHandler, dropCardHandler, dropHandler } from "../tools/dragndrop";
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
    const [openModalEdit, setOpenModalEdit] = useState(false);
    const [editingItem, setEditingItem] = useState<Task | Category>();
    const catDialogRef = useRef<HTMLDialogElement>(null);
    const taskDialogRef = useRef<HTMLDialogElement>(null);
    const [error, setError] = useState("");
    const [currentCard, setCurrentCard] = useState<Category>();
    const [currentTaskCard, setCurrentTaskCard] = useState<Task>();
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
        const onEditTask = (task: Task) => {
            setTasks((previous) => {
                const taskIndex = previous.findIndex((item) => item.id === task.id);
                const editedTasks = previous;
                editedTasks[taskIndex] = task;
                return [...editedTasks];
            });
        };
        const onDeleteTask = (task: Task) => {
            setTasks((previous) => [...previous.filter((item) => item.id !== task.id)]);
        };
        const onCategory = (categories: Category[]) => {
            setCategories(categories);
        };
        const onNewCategory = (category: Category) => {
            if (categories.indexOf(category) === -1) setCategories((previous) => [...previous, category]);
        };
        const onEditCategory = (category: Category) => {
            setCategories((previous) => {
                const categoryIndex = previous.findIndex((item) => item.id === category.id);
                const editedCategories = previous;
                editedCategories[categoryIndex] = category;
                return [...editedCategories];
            });
        };
        const onDeleteCategory = (category: Category) => {
            setCategories((previous) => [...previous.filter((item) => item.id !== category.id)]);
        };
        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("connect_error", onError);
        socket.on("tasks", onTasks);
        socket.on("new_task", onNewTask);
        socket.on("edit_task", onEditTask);
        socket.on("move_task", onEditTask);
        socket.on("del_task", onDeleteTask);
        socket.on("categories", onCategory);
        socket.on("new_category", onNewCategory);
        socket.on("edit_category", onEditCategory);
        socket.on("del_category", onDeleteCategory);
        socket.on("error", onError);
        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("connect_error", onError);
            socket.off("tasks", onTasks);
            socket.off("new_task", onNewTask);
            socket.off("edit_task", onEditTask);
            socket.off("move_task", onEditTask);
            socket.off("del_task", onDeleteTask);
            socket.off("categories", onCategory);
            socket.off("new_category", onNewCategory);
            socket.off("edit_category", onEditCategory);
            socket.off("del_category", onDeleteCategory);
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
    async function editItem(item: Category | Task) {
        const pass = localStorage.getItem("Password") || "";
        const url = "/" + ("categoryId" in item ? "task" : "category") + "/edit";
        try {
            await axios.post(url, item, {
                headers: { Authorization: pass },
            });
            console.log("Item edited!");
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

            {openModalEdit && editingItem ? (
                <ModalEdit item={editingItem} setOpen={setOpenModalEdit} onConfirm={editItem} />
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
                        const cardName = item.name.length > 15 ? item.name.substring(0, 15) + "..." : item.name;
                        return (
                            <div
                                key={item.id}
                                className='card'
                                onDragOver={(e) => dragOverHandler(e)}
                                onDrop={(e) => dropHandler(e, item, currentTaskCard)}
                            >
                                <div className='cardHeader'>
                                    <h2>{cardName} </h2>
                                    <button
                                        className='editCardButton'
                                        onClick={() => {
                                            setOpenModalEdit(true);
                                            setEditingItem(item);
                                        }}
                                    >
                                        <img src={pencil} className='editButton' alt='edit' />
                                    </button>
                                </div>
                                <button
                                    className='createTask'
                                    onClick={() => {
                                        setCatId(item.id);
                                        setOpenCreateTask(true);
                                    }}
                                >
                                    +
                                </button>

                                <div className='task'>
                                    {tasks
                                        .filter((task) => {
                                            return task.categoryId === item.id;
                                        })
                                        .map((task) => {
                                            const taskName =
                                                task.name.length > 23 ? task.name.substring(0, 23) + "..." : task.name;
                                            return (
                                                <div
                                                    className='taskCard'
                                                    key={task.id}
                                                    onDragStart={(e) =>
                                                        dragStartHandler(
                                                            e,
                                                            item,
                                                            task,
                                                            setCurrentCard,
                                                            setCurrentTaskCard,
                                                        )
                                                    }
                                                    onDrop={(e) => dropHandler(e, item, currentTaskCard)}
                                                    draggable={true}
                                                >
                                                    <div>{taskName}</div>
                                                    <button
                                                        className='editTaskButton'
                                                        onClick={() => {
                                                            setOpenModalEdit(true);
                                                            setEditingItem(task);
                                                        }}
                                                    >
                                                        <img src={pencil} className='editButton' alt='edit' />
                                                    </button>
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
