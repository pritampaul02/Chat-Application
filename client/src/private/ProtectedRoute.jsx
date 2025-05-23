import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { SocketContextProvider } from "../context/socketContext";

const ProtectedRoute = () => {
    const { user, loading } = useSelector((state) => state.auth);

    // if (loading) {
    //     return <div className="text-center mt-10">Loading...</div>;
    // }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <SocketContextProvider><Outlet /></SocketContextProvider>;
};

export default ProtectedRoute;
