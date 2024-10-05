import { createContext, useContext, useState, ReactNode } from 'react'

interface AuthContextType {
    user: string;
    role: "user" | "guest" | "";
    accessToken: string;
    login: (userData: string, token: string) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<string>("");
    const [accessToken, setAccessToken] = useState<string>("");
    const [role, setRole] = useState<"user" | "guest" | "">("")
    const [loading, setLoading] = useState<boolean>(true);

    const login = (userData: string, token: string) => {
        setUser(userData);
        setAccessToken(token);
        setLoading(false);
        setRole("user")
    };

    const logout = () => {
        setUser("");
        setAccessToken("");
        setRole("");
        setLoading(false);
    };

    return (
        <AuthContext.Provider value={{ user, login, role, logout, loading, accessToken }} >
            {children}
        </AuthContext.Provider >
    )
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}