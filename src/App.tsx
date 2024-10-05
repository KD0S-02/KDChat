import { FormEvent, useEffect, useState } from "react";
import useSocket from "./hooks/useSocket";
import { useAuth } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState<string[]>([]);
  const { user, accessToken } = useAuth();

  const ws: WebSocket | undefined = useSocket();

  useEffect(() => {
    ws?.addEventListener('message', (event) => {
      setAllMessages(prevMessages => [...prevMessages, event.data]);
    })
  }, [ws])

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!ws?.OPEN) {
      console.log('websocket not connected');
      return;
    }
    setAllMessages(prevMessages => [...prevMessages, message]);
    ws?.send(message);
  }

  if (!user) navigate('/');

  return (
    <div className="bg-black h-screen w-screen overflow-hidden">
      <h1 className="text-2xl p-2 text-white mx-auto font-bold text-center">Username:
        <span className="font-normal text-white">
          {` ${user}`}
        </span>
      </h1>
      <div className="w-1/2 mx-auto h-[600px] bg-blue-900 rounded text-white flex-col mt-4">
        <div className="w-full h-[560px] p-4 overflow-y-scroll flex flex-col" id="chat-box">
          {
            allMessages.map(
              message => <p className="w-full p-1 break-all">{message}</p>
            )
          }
        </div>
        <div className="w-full flex h-[40px] relative">
          <textarea value={message} onChange={(e) => { setMessage(e.target.value) }} className="h-full w-full bg-blue-300 text-black flex-end p-2 pr-[40px] rounded-b" />
          <button onClick={handleSendMessage} className="bg-blue-700 absolute right-0 h-[40px] w-[40px] text-2xl text-white rounded-br">↵</button>
        </div>
      </div>

    </div >
  )
}

export default App
