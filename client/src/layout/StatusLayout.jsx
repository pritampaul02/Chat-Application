import React from "react";
import { Outlet } from "react-router-dom";
import StatusSidebar from "../components/StatusComponent/StatusSidebar";

const StatusLayout = () => {
    return (
        <section className="flex w-full h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200">
            <StatusSidebar />
            <div className="flex-1 h-full overflow-hidden">
                <Outlet />
            </div>
        </section>
    );
};

export default StatusLayout;
