import { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import MessageBody from './types/MessageBody';
import { useWebSocket } from './context/SocketContext';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const { user } = useAuth();
    const ws: WebSocket | null = useWebSocket();
    const [generatedRoomID, setGeneratedRoomID] = useState<string>("");
    const [roomId, setRoomId] = useState<string>("")
    const navigate = useNavigate();


    useEffect(() => {
        if (!ws) return;

        const onOpen = () => {
            const authenticationMsg: MessageBody = {
                "type": "authentication",
                "roomId": null,
                "data": user
            };
            ws.send(JSON.stringify(authenticationMsg));
        };

        const onMessage = (event: MessageEvent) => {
            const response: MessageBody = JSON.parse(event.data);
            if (response.type === "createRoom") {
                setGeneratedRoomID(response.data);
            }
        };

        ws.addEventListener('open', onOpen);
        ws.addEventListener('message', onMessage);


        return () => {
            ws.removeEventListener('open', onOpen);
            ws.removeEventListener('message', onMessage);
        };

    }, [ws, user]);


    const handleCreateRoom = () => {

        const newCreateRoomRequest: MessageBody = {
            "type": "createRoom",
            "roomId": null,
            "data": "",
        }

        ws?.send(JSON.stringify(newCreateRoomRequest));
    }

    const handleJoinRoom = () => {
        navigate(`/chat/${roomId}`);
    }

    return (
        <main className='h-screen w-screen bg-gray-900'>
            <h1 className='text-3xl text-white text-center p-3'>Username: <span className='text-2xl text-gray-400'>{user}</span></h1>
            <p className='text-lg text-gray-300 m-4 text-center p-2 font-light italic'>Connect and collaborate with anyone, anytime, anywhere</p>
            <div className='flex gap-10 justify-center h-[80%] w-full mt-10'>
                <div className='bg-gray-950 w-[40%] h-[50%] rounded text-gray-300 p-5 text-2xl font-bold'>
                    <h2 className='text-center'>Join Room</h2>
                    <div className='flex flex-col md:flex-row justify-center w-[80%] h-max gap-2 mx-auto mt-20'>
                        <input type="text" className='rounded text-sm font-extralight p-2 text-gray-900' value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder='Enter Chat ID' />
                        <button onClick={handleJoinRoom} className='bg-blue-500 text-gray-900 w-[60px] rounded-md min-h-full font-mono text-base p-1'>JOIN</button>
                    </div>
                </div>
                <div className='bg-gray-950 w-[40%] h-[50%] rounded text-gray-300 p-5 text-2xl font-bold flex flex-col'>
                    <h2 className='text-center'>Create Room</h2>
                    <div className='flex flex-col justify-center items-center mt-30 flex-1'>
                        <button onClick={handleCreateRoom} className='bg-blue-500 text-gray-900 rounded-md p-1 font-mono text-base'>CREATE</button>
                    </div>
                    {generatedRoomID ? <p className='text-center font-thin'>Chat Id: <span className='font-bold'>{generatedRoomID}</span></p> : null}
                </div>
            </div>
        </main>
    )
}

export default Profile