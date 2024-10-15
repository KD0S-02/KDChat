import { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import { MessageBody, Group } from './types/MessageBody';
import { useWebSocket } from './context/SocketContext';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const { user } = useAuth();
    const ws: WebSocket | null = useWebSocket();
    const [generatedRoomID, setGeneratedRoomID] = useState<string>("");
    const [groups, setGroups] = useState<Group[] | undefined>();
    const [roomId, setRoomId] = useState<string>("")
    const [groupName, setGroupName] = useState<string>("")
    const navigate = useNavigate();


    useEffect(() => {
        if (!ws) return;

        const onOpen = () => {
            const authenticationMsg: MessageBody = {
                "type": "authentication",
                "username": user
            };
            ws.send(JSON.stringify(authenticationMsg));
        };

        const onMessage = (event: MessageEvent) => {
            const response: MessageBody = JSON.parse(event.data);
            if (response.type === "createRoom") {
                setGeneratedRoomID(response.data as string);
            }
            if (response.type === "groupList") {
                setGroups(response.data as Group[]);
                console.log(JSON.stringify(response.data));
                localStorage.setItem('groups', JSON.stringify(groups));
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
            "data": groupName,
            "username": user,
        }

        ws?.send(JSON.stringify(newCreateRoomRequest));
    }

    const handleJoinRoom = () => {
        navigate(`/chat/${roomId}`);
    }

    return (
        <main className='w-screen bg-[#111111] flex flex-col'>
            <div className='flex w-full min-h-screen'>
                <nav className='flex flex-col w-[20vw] bg-[#111111] border-r-[1px] border-[#33B272]'>
                    <h1 className='text-white text-2xl text-center font-bold p-4'>Groups</h1>
                    {
                        groups ? groups.map(group =>
                            <button key={group.groupId} className='h-[40px] border-b-[1px] border-[#33B272] bg-[#292727] text-[#33B272]' onClick={() => navigate(`/chat/${group.groupId}`)}>{group.groupName}</button>
                        ) :


                            <div role="status" className='mx-auto mt-[200px]'>
                                <svg aria-hidden="true" className="w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-[#33B272]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                            </div>


                    }
                </nav>
                <div className='flex-grow'>
                    <h1 className='text-3xl text-white text-center p-3 '>Username: <span className='text-2xl text-gray-400'>{user}</span></h1>
                    <p className='text-lg text-[#33B272] m-4 text-center p-2 font-light italic'>Connect and collaborate with anyone, anytime, anywhere</p>

                    <div className='flex flex-grow gap-10 justify-center w-full mt-10'>
                        <div className='bg-[#1A3A2A] w-[40%] h-[300px] rounded text-gray-300 p-5 text-2xl font-bold'>
                            <h2 className='text-center'>Join Room</h2>
                            <div className='flex flex-col md:flex-row justify-center w-[80%] h-max gap-2 mx-auto mt-20'>
                                <input type="text" className='rounded text-sm font-extralight p-2 text-gray-900' value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder='Enter Chat ID' />
                                <button onClick={handleJoinRoom} className='bg-[#33B272] text-white w-[60px] rounded-md min-h-full font-mono text-base p-1'>JOIN</button>
                            </div>
                        </div>
                        <div className='bg-[#1A3A2A] w-[40%] h-[300px] rounded text-gray-300 p-5 text-2xl font-bold flex flex-col'>
                            <h2 className='text-center'>Create Room</h2>
                            <div className='flex flex-col gap-4 justify-center items-center mt-30 flex-1'>
                                <div className='flex gap-2 w-full'>
                                    <label className="text-xl" htmlFor="groupNameInput">Group Name:</label>
                                    <input type="text" id="groupNameInput" className='rounded text-sm flex-grow font-extralight p-2 text-gray-900' value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder='Enter Group Name' />
                                </div>
                                <button onClick={handleCreateRoom} className='bg-[#33B272] text-white rounded-md p-1 font-mono text-base'>CREATE</button>
                            </div>
                            {generatedRoomID ? <p className='text-center font-thin'>Chat ID: <span className='font-bold text-[#33B272]'>{generatedRoomID}</span></p> : null}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Profile