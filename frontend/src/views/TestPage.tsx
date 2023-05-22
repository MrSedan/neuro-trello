import { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "../context/socket";
import axios from "../tools/api";

interface task {
    name: string;
    id: number;
    categoryId: number;
}

interface MyError extends Error {
    data: any;
}

export default function TestPage() {
    const { socket, updatePass } = useContext(SocketContext);
    const [connected, setConnected] = useState(socket.connected);
    const [error, setError] = useState("");
    const [items, setItems] = useState<task[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const taskRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (!socket.connected) socket.connect();
    }, [socket]);
    useEffect(() => {
        const onConnect = () => {
            console.log("Con");
            setError("");
            setConnected(true);
            socket.emit("get_tasks");
            localStorage.setItem("Password", inputRef.current?.value || localStorage.getItem("Password") || "");
        };
        const onDisconnect = () => {
            console.log("Disc");
            setConnected(false);
        };
        const onError = (error: Error) => {
            console.log("Error:", error.message);
            console.log((error as MyError).data);
            if ((error as MyError).data) setError((error as MyError).data.type);
        };
        const onTasks = (tasks: task[]) => {
            setItems(tasks);
        };
        const onNewTask = (task: task) => {
            if (items.indexOf(task) === -1) setItems((previous) => [...previous, task]);
        };
        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("connect_error", onError);
        socket.on("tasks", onTasks);
        socket.on("new_task", onNewTask);
        socket.on("error", onError);
        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("connect_error", onError);
            socket.off("tasks", onTasks);
            socket.off("new_task", onNewTask);
            socket.off("error", onError);
        };
    }, [socket, items]);
    return (
        <div>
            <h1>{connected ? "Connected" : "Disconnected"}</h1>
            <input type='text' ref={inputRef} />
            <button
                onClick={() => {
                    setItems([]);
                    if (!connected) {
                        updatePass(inputRef.current?.value || "");
                        socket.connect();
                    } else {
                        socket.disconnect();
                    }
                }}
            >
                {!connected ? "Connect" : "Disconnect"}
            </button>
            {connected && (
                <div>
                    <input type='text' placeholder='Task' ref={taskRef} />
                    <button
                        onClick={async () => {
                            await axios
                                .post(
                                    "/task/new",
                                    { category_id: 1, name: taskRef.current?.value || "task" },
                                    {
                                        headers: {
                                            Authorization: localStorage.getItem("Password") || "",
                                        },
                                    },
                                )
                                .catch((error) => {
                                    console.error(error);
                                });
                        }}
                    >
                        Send
                    </button>
                </div>
            )}
            {items ? (
                items.map((item) => {
                    return (
                        <h1 key={item.id}>
                            Category: {item.categoryId} Task: {item.name}
                        </h1>
                    );
                })
            ) : (
                <h1>Loading...</h1>
            )}
            {error && <h1>{error}</h1>}
            {
                <h1>
                    {process.env.REACT_APP_BASE_URL || ""} {JSON.stringify(socket.auth)}
                </h1>
            }
        </div>
    );
}
