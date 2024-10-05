import { useEffect, useState } from 'react'

const useSocket = () => {
    const [ws, setWs] = useState<WebSocket | undefined>(undefined);

    useEffect(() => {

        if (ws?.OPEN) return;

        setWs(new WebSocket("ws://localhost:8080/chat"));

        return () => {
            if (ws?.OPEN)
                ws?.close();
        };
    }, []);
    return ws;
}

export default useSocket