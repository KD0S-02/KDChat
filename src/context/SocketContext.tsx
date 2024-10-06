import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Props = {
    children: ReactNode;
};

const WebSocketContext = createContext<WebSocket | null>(null);

export const WebSocketProvider: React.FC<Props> = ({ children }) => {
    const [ws, setWs] = useState<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8081/chat");
        setWs(socket);

        return () => {
            socket.close();
        };
    }, []);

    return <WebSocketContext.Provider value={ws}>{children}</WebSocketContext.Provider>;
};

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};
