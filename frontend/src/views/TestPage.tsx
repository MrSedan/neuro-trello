import { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "../context/socket";

export default function TestPage() {
    const { socket, updatePass } = useContext(SocketContext);
    const [connected, setConnected] = useState(socket.connected);
    const [items, setItems] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        updatePass(localStorage.getItem("Password") || "");
    }, [updatePass]);
    useEffect(() => {
        const onConnect = () => {
            console.log("Con");
            setConnected(true);
        };
        const onDisconnect = () => {
            console.log("Disc");
            setConnected(false);
        };
        const onMessage = (value: string) => {
            setItems((previous) => [...previous, value]);
            console.log("new item");
        };
        const onError = (error: any) => {
            console.log("Error:", error);
        };
        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("connect_error", onError);
        socket.on("message", onMessage);
        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("connect_error", onError);
            socket.off("message", onMessage);
        };
    }, [socket]);
    return (
        <div>
            <h1>{connected ? "Connected" : "Disconnected"}</h1>
            <input type='text' ref={inputRef} />
            <button
                onClick={() => {
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
            {items &&
                items.map((item, index) => {
                    return <h1 key={index}>{item}</h1>;
                })}
        </div>
    );
}
