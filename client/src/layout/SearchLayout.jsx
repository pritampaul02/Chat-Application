import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Search from "../pages/Search";

const SearchLayout = () => {
    const location = useLocation();
    const showSearch = location.pathname === "/search";

    return (
        <section className="flex w-full h-screen overflow-hidden">
            <div
                className={`w-[100%]  shrink-0 overflow-y-auto 
                    ${showSearch ? "block" : "hidden"} 
                    md:block`}
            >
                <Search />
            </div>

            <div className="flex-1 flex justify-center overflow-y-auto">
                <Outlet />
            </div>
        </section>
    );
};

export default SearchLayout;
