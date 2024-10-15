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
        <main className="h-screen w-screen bg-[#111111]  flex flex-col justify-center">
            {notifMsg !== "" && notifType !== "" ? <Notificaiton type={notifType} message={notifMsg}></Notificaiton> : null}
            <div className="bg-[#33B272] w-[600px] p-5 mx-auto shadow-md">
                <h1 className="mx-auto text-3xl font-extrabold text-[#1A3A2A] w-[90%] text-center mt-2">Login</h1>
                <form onSubmit={(e: FormEvent) => { handleLogin(e) }} className="flex flex-col mx-auto w-[90%] gap-4">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="username" className="text-[#1A3A2A] font-thin">Username</label>
                        <input id="username" type="text" className="text-white w-full rounded bg-[#5DC691] h-[50px] p-2" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="username" className="text-[#1A3A2A] font-thin">Password</label>
                        <input id="username" type="password" className="text-white w-full rounded bg-[#5DC691] h-[50px] p-2" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <input type="submit" value="LOGIN" className="w-[100px] h-[40px] text-[#226242] bg-[#9bf3f0] rounded-lg font-bold mx-auto mt-10 hover:cursor-pointer hover:bg-[#226242] hover:text-white transition-all" />
                </form>
            </div>
        </main>
    )
}

export default Login