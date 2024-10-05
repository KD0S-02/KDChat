import { FormEvent, useState } from "react";
import Notification from "./components/Notificaiton";

function Register() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [notifType, setNotifType] = useState<string>("");
    const [notifMsg, setNotifMsg] = useState<string>("");

    const handleSignUp = async (e: FormEvent) => {
        e.preventDefault();
        const url = "http://localhost:8080/api/v1/auth/signup";
        const body = {
            "username": username,
            "password": password,
            "email": email,
            "role": "USER"
        }
        try {
            setNotifMsg('Waiting for Server');
            setNotifType('wait')

            const response = await fetch(url,
                {
                    headers: { "Content-Type": "application/json" },
                    method: "POST",
                    body: JSON.stringify(body)
                }
            );


            if (response.status === 201) {
                setNotifMsg('User Created Successfully');
                setNotifType('success');
                setTimeout(() => {
                    setNotifMsg('');
                    setNotifType('');
                }, 3000)
                setUsername('');
                setPassword('');
                setEmail('');
            }
        }
        catch {
            setNotifMsg('Server Error');
            setNotifType('error');
            setTimeout(() => {
                setNotifMsg('');
                setNotifType('');
            }, 3000)
        }
    }

    return (
        <main className="h-screen w-screen bg-gray-800 flex flex-col justify-center">
            {notifMsg !== "" && notifType !== "" ? <Notification type={notifType} message={notifMsg} /> : null}
            <div className="bg-blue-900 w-[600px] p-5 rounded-lg mx-auto shadow-md">
                <h1 className="mx-auto text-3xl font-bold text-white w-[90%] text-center mt-2">Sign Up</h1>
                <form onSubmit={(e) => handleSignUp(e)} className="flex flex-col mx-auto w-[90%] gap-4">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="username" className="text-white font-bold">Username</label>
                        <input id="username" type="text" className="w-full rounded bg-blue-300 h-[50px] p-2" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="text-white font-bold">Email</label>
                        <input id="email" type="email" className="w-full rounded bg-blue-300 h-[50px] p-2" value={email} onChange={(e) => setEmail(e.target.value)} pattern="/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/"
                            required />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="password" className="text-white font-bold">Password</label>
                        <input id="password" type="password" className="w-full rounded bg-blue-300 h-[50px] p-2" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <input type="submit" value="SINGUP" className="w-[100px] h-[40px] bg-white rounded font-bold mx-auto mt-10 hover:cursor-pointer hover:bg-blue-400 hover:text-white transition-all" onSubmit={(e) => { handleSignUp(e) }} />
                </form>
            </div>
        </main>
    )
}

export default Register