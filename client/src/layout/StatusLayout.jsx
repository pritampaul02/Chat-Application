import React from "react";
import { Outlet } from "react-router-dom";
import StatusSidebar from "../components/StatusComponent/StatusSidebar";

const StatusLayout = () => {
    return (
        <section className="flex w-full flex-row overflow-hidden">
            <StatusSidebar />
            <div className="flex-1">
                <Outlet />
            </div>
        </section>
    );
};

export default StatusLayout;
