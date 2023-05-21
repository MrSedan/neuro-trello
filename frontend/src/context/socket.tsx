import { Socket } from "socket.io-client";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Outlet } from "react-router-dom";

interface ISocketContext {
    socket: Socket;
    updatePass: (newPass: string) => void;
}

export const SocketContext = React.createContext<ISocketContext>({ socket: {} as Socket, updatePass: () => {} });

const MySocketProvider = () => {
    const [pass, setPass] = useState(localStorage.getItem("Password") || "");
    const socket = io(process.env.REACT_APP_BASE_URL || "", {
        autoConnect: false,
        auth: {
            pass: pass,
        },
    });
    useEffect(() => {
        const onError = (err: Error) => {
            console.log(typeof err);
        };
        socket.on("connect_error", onError);
        return () => {
            socket.off("connect_error", onError);
        };
    }, [socket]);
    const updatePass = (newPass: string) => {
        setPass(newPass);
        socket.auth = { pass: newPass };
        if (socket.connected) {
            socket.disconnect();
            socket.connect();
        }
    };
    return (
        <SocketContext.Provider value={{ socket, updatePass }}>
            <Outlet />
        </SocketContext.Provider>
    );
};

export default MySocketProvider;
