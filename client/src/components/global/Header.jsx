import React from "react";
import { NavLink } from "react-router-dom";
import { RiChat1Line, RiLogoutBoxLine } from "react-icons/ri";
import { LuCircleDashed } from "react-icons/lu";
import { CiSearch, CiSettings } from "react-icons/ci";
import { FiUserPlus } from "react-icons/fi";

const Header = () => {
    return (
        <nav className="h-screen w-20 bg-slate-50 flex flex-col items-center justify-between py-6">
            <div className="flex flex-col items-center justify-center gap-6">
                <img
                    src="/vite.svg"
                    alt="Logo"
                    className="h-16 w-16 rounded-full"
                />
                <ul className="flex flex-col gap-3">
                    <li className="text-2xl">
                        <NavLink
                            to="/chat"
                            title="Chat"
                            className={({ isActive }) =>
                                isActive ? "text-blue-600" : ""
                            }
                        >
                            <RiChat1Line />
                        </NavLink>
                    </li>
                    <li className="text-2xl">
                        <NavLink
                            to="/status"
                            title="Status"
                            className={({ isActive }) =>
                                isActive ? "text-blue-600" : ""
                            }
                        >
                            <LuCircleDashed />
                        </NavLink>
                    </li>
                    <li className="text-2xl">
                        <NavLink
                            to="/search"
                            title="Search"
                            className={({ isActive }) =>
                                isActive ? "text-blue-600" : ""
                            }
                        >
                            <CiSearch />
                        </NavLink>
                    </li>
                    <li className="text-2xl">
                        <NavLink
                            to="/friends"
                            title="Friends"
                            className={({ isActive }) =>
                                isActive ? "text-blue-600" : ""
                            }
                        >
                            <FiUserPlus />
                        </NavLink>
                    </li>
                    <li className="text-2xl">
                        <NavLink
                            to="/settings"
                            title="Settings"
                            className={({ isActive }) =>
                                isActive ? "text-blue-600" : ""
                            }
                        >
                            <CiSettings />
                        </NavLink>
                    </li>
                </ul>
            </div>

            <div>
                <div>
                    <NavLink
                        to={"/profile"}
                        title="Profile"
                        className={({ isActive }) =>
                            isActive ? "text-blue-600" : ""
                        }
                    >
                        profile
                    </NavLink>{" "}
                </div>
                <button>
                    <RiLogoutBoxLine />
                </button>
            </div>
        </nav>
    );
};

export default Header;
