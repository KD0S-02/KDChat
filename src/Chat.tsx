import { FormEvent, useEffect, useState } from "react";
import { useWebSocket } from "./context/SocketContext";
import { useAuth } from "./context/AuthContext";
import { useParams } from "react-router-dom";
import MessageBody from "./types/MessageBody";

function App() {
  const { user, accessToken } = useAuth();
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState<string[]>([]);
  const ws: WebSocket | null = useWebSocket();
  const [joined, setJoined] = useState<boolean>(false);

  useEffect(() => {
    console.log(allMessages);
  }, [allMessages])


  useEffect(() => {
    if (ws?.readyState === WebSocket.OPEN && !joined) {
      const joinRoomRequest: MessageBody = {
        "type": "joinRoom",
        "roomId": id as string,
        "data": ""
      };
      ws.send(JSON.stringify(joinRoomRequest));
    }

    const handleMessage = (event: MessageEvent) => {
      const newMessage: MessageBody = JSON.parse(event.data);
      if (newMessage.type === "message") {
        console.log('new message received');
        setAllMessages((prevMessages) => [...prevMessages, newMessage.data]);
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

    const formattedMessage = `${user} : ${message}`;
    setAllMessages((prevMessages) => [...prevMessages, formattedMessage]);

    const newMessage = {
      "type": "message",
      "roomId": id,
      "data": message
    };
    ws?.send(JSON.stringify(newMessage));
    setMessage("");
  }

  if (!joined) {
    return (
      <main className="bg-gray-900 h-screen w-screen overflow-hidden text-yellow-50 text-4xl">
        Loading
      </main>
    );
  }

  return (
    <main className="bg-gray-900 h-screen w-screen overflow-hidden">
      <h1 className="text-2xl p-2 text-white mx-auto font-bold text-center">
        Username:
        <span className="font-normal text-white">
          {` ${user}`}
        </span>
      </h1>
      <div className="w-1/2 mx-auto h-[600px] bg-blue-900 rounded text-white flex-col mt-4">
        <div className="w-full h-[560px] p-4 overflow-y-scroll flex flex-col" id="chat-box">
          {allMessages.map((msg, index) => (
            <p key={index} className="w-full p-1 break-all">{msg}</p>
          ))}
        </div>
        <div className="w-full flex h-[40px] relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="h-full w-full bg-blue-300 text-black flex-end p-2 pr-[40px] rounded-b"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-700 absolute right-0 h-[40px] w-[40px] text-2xl text-white rounded-br"
          >
            ↵
          </button>
        </div>
      </div>
    </main>
  );
}

export default App;