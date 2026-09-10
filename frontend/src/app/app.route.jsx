import { createBrowserRouter } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Dashboard from "../features/chat/pages/Dashboard";
import Proteded from "../features/auth/components/Proteded";
import { Navigate } from "react-router-dom";
import ForgetPassword from "../features/auth/pages/ForgetPassword";

export const route = createBrowserRouter([
  {
    path: "/login",
    element: 
         <Login />
    
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: <Proteded>
            <Dashboard/>
            </Proteded>
      
  },
  {
    path: "/dashboard",
    element: <Navigate to="/" replace />,
  },
  {
    path: "/forget-password",
    element: <ForgetPassword />,
  }

]);