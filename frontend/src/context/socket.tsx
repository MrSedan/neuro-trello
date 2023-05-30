import { Socket } from "socket.io-client";
import React, { useRef } from "react";
import { io } from "socket.io-client";
import { Outlet } from "react-router-dom";

interface ISocketContext {
    socket: Socket;
    updatePass: (newPass: string) => void;
}

export const SocketContext = React.createContext<ISocketContext>({ socket: {} as Socket, updatePass: () => {} });

const MySocketProvider = () => {
    const socketRef = useRef(
        io(process.env.REACT_APP_BASE_WS || process.env.REACT_APP_BASE_URL || "", {
            autoConnect: false,
            auth: {
                pass: localStorage.getItem("Password") || "",
            },
        }),
    );
    const socket = socketRef.current;
    const updatePass = (newPass: string) => {
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
