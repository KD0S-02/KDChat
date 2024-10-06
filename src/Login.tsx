import { FormEvent, useState } from "react"
import { useAuth } from "./context/AuthContext";
import Notificaiton from "./components/Notificaiton";
import { useNavigate } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [notifType, setNotifType] = useState<string>("");
    const [notifMsg, setNotifMsg] = useState<string>("");

    const { login } = useAuth();

    const handleNotif = (type: string, message: string, timeout: number): void => {
        setNotifMsg(message);
        setNotifType(type);
        setTimeout(() => {
            setNotifMsg("");
            setNotifType("");
        }, timeout)
    }

    const navigate = useNavigate()

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        const url = "http://localhost:8080/api/v1/auth/signin";
        const body = {
            "username": username,
            "password": password
        };
        setNotifMsg("Waiting for Server");
        setNotifType("wait");

        const response = await fetch(url, {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify(body),
        })
        const status = response.status;
        if (status === 403) {
            handleNotif("error", "Wrong Username/Password", 3000);
            return;
        }
        else if (status === 200) {
            const data = await response.json();
            handleNotif("success", "Login Successfull", 3000);
            login(username, data.accessToken);
            setUsername("");
            setPassword("");
            navigate('/profile');
        }
    }

    return (
        <main className="h-screen w-screen bg-gray-800 flex flex-col justify-center">
            {notifMsg !== "" && notifType !== "" ? <Notificaiton type={notifType} message={notifMsg}></Notificaiton> : null}
            <div className="bg-blue-900 w-[600px] p-5 rounded-lg mx-auto shadow-md">
                <h1 className="mx-auto text-3xl font-bold text-white w-[90%] text-center mt-2">Login</h1>
                <form onSubmit={(e: FormEvent) => { handleLogin(e) }} className="flex flex-col mx-auto w-[90%] gap-4">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="username" className="text-white font-bold">Username</label>
                        <input id="username" type="text" className="w-full rounded bg-blue-300 h-[50px] p-2" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="username" className="text-white font-bold">Password</label>
                        <input id="username" type="password" className="w-full rounded bg-blue-300 h-[50px] p-2" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <input type="submit" value="LOGIN" className="w-[100px] h-[40px] bg-white rounded font-bold mx-auto mt-10 hover:cursor-pointer hover:bg-blue-400 hover:text-white transition-all" />
                </form>
            </div>
        </main>
    )
}

export default Login