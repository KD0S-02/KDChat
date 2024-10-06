import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './Chat.tsx'
import Login from './Login.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import Register from './Register.tsx'
import Profile from './Profile.tsx'
import { WebSocketProvider } from './context/SocketContext.tsx'
import { AuthProvider } from './context/AuthContext.tsx';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/profile",
    element:
      <ProtectedRoute>
        <WebSocketProvider>
          <Profile />
        </WebSocketProvider>
      </ProtectedRoute>
  },
  {
    path: "/chat/:id",
    element:
      <ProtectedRoute>
        <WebSocketProvider>
          <App />
        </WebSocketProvider>
      </ProtectedRoute >
  }

])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router}></RouterProvider>
    </AuthProvider>
  </StrictMode>,
)
