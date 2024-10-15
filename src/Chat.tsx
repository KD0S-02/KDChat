import { FormEvent, useEffect, useState } from "react";
import { useWebSocket } from "./context/SocketContext";
import { useAuth } from "./context/AuthContext";
import { useParams } from "react-router-dom";
import MessageBody from "./types/MessageBody";

type Message = {
  body: string;
  userId: string,
}

function App() {
  const { user, accessToken } = useAuth();
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const ws: WebSocket | null = useWebSocket();
  const [joined, setJoined] = useState<boolean>(false);

  useEffect(() => {
    console.log(allMessages);
  }, [allMessages])


  useEffect(() => {
    if (ws?.readyState === WebSocket.OPEN && !joined) {
      const joinRoomRequest: MessageBody = {
        "type": "joinRoom",
        "roomId": id,
        "username": user
      };
      ws.send(JSON.stringify(joinRoomRequest));
    }

    const handleMessage = (event: MessageEvent) => {
      const newMessage: MessageBody = JSON.parse(event.data);

      if (newMessage.type === "message") {
        const currentMessage: Message = {
          body: newMessage.data as string,
          userId: newMessage.username as string,
        }
        setAllMessages((prevMessages) => [...prevMessages, currentMessage]);
      } else if (newMessage.type === "joinRoom" && newMessage.data === "joined") {
        setJoined(true);
      }
    };

    ws?.addEventListener('message', handleMessage);

    return () => {
      ws?.removeEventListener('message', handleMessage);
    };
  }, [ws, id]);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();

    if (ws?.readyState !== WebSocket.OPEN) return;

    if (message.trim() === "") return;

    const currentMessage: Message = {
      body: message,
      userId: user,
    }
    setAllMessages((prevMessages) => [...prevMessages, currentMessage]);

    const newMessage = {
      "type": "message",
      "roomId": id,
      "data": message,
      "username": user
    };
    ws?.send(JSON.stringify(newMessage));
    setMessage("");
  }

  if (!joined) {
    return (
      <main className="bg-[#111111] h-screen w-screen overflow-hidden text-yellow-50 text-4xl">
        Loading
      </main>
    );
  }

  return (
    <main className="bg-[#111111] min-h-screen w-screen overflow-hidden">
      <div className="flex justify-center gap-20">
        <h1 className="text-2xl p-2 text-[#33B272] font-bold text-center">
          Username:
          <span className="font-normal text-white">
            {` ${user}`}
          </span>
        </h1>
        <h1 className="text-2xl p-2 text-[#33B272] font-bold text-center">
          Chat ID:
          <span className="font-normal text-white">
            {` ${id}`}
          </span>
        </h1>
      </div>
      <div className="w-1/2 mx-auto h-[600px] bg-[#1A3A2A] rounded text-white flex-col mt-4">
        <div className="w-full h-[560px] p-4 overflow-y-scroll flex flex-col" id="chat-box">
          {allMessages.map((msg, index) => (
            <p key={index} className="w-full p-1 break-all">
              <span className="text-[#33B272] font-bold">{msg.userId}</span>
              <span>{msg.userId ? ' : ' : null}</span>
              {msg.body}
            </p>
          ))}
        </div>
        <div className="w-full flex h-[40px] relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="h-full w-full bg-[#33B272] text-white flex-end p-2 pr-[40px] rounded-b resize-none"
          />
          <button
            onClick={handleSendMessage}
            className="bg-[#226242] absolute right-0 h-[40px] w-[40px] text-2xl text-white rounded-br"
          >
            ↵
          </button>
        </div>
      </div>
    </main>
  );
}

export default App;