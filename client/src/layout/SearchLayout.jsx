import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Search from "../pages/Search";

const SearchLayout = () => {
    const location = useLocation();
    const showSearch = location.pathname === "/search";
    console.log("showSearch", showSearch);
    return (
        <section className="flex w-full h-screen overflow-hidden">
            <div
                className={`w-full md:w-[25rem] border-r border-gray-200  shrink-0 overflow-y-auto 
                     ${showSearch ? "block" : "hidden"} 
                    md:block`}
            >
                <Search />
            </div>

            <div className="flex flex-1 justify-center overflow-y-auto">
                <Outlet />
            </div>
        </section>
    );
};

export default SearchLayout;
