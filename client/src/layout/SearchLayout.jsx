import React from "react";
import { Outlet } from "react-router-dom";
import Search from "../pages/Search";

const SearchLayout = () => {
    return (
        <section className="flex w-full h-screen overflow-hidden">
            <Search />
            <div className="flex-1 overflow-y-auto">
                <Outlet />
            </div>
        </section>
    );
};

export default SearchLayout;
