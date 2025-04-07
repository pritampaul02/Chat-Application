import React from "react";
import { NavLink } from "react-router-dom";
import { RiChat1Line, RiLogoutBoxLine } from "react-icons/ri";
import { LuCircleDashed } from "react-icons/lu";
import { CiSearch, CiSettings } from "react-icons/ci";
import { FiUserPlus } from "react-icons/fi";
import { FaUser } from "react-icons/fa6";

const Header = () => {
    return (
        <nav className="h-screen w-20  bg-slate-50 flex flex-col items-center justify-between py-6 pb-0">
            <div className="flex flex-col items-center justify-center gap-6">
                <img
                    src="/vite.svg"
                    alt="Logo"
                    className="h-16 w-16 rounded-full"
                />
                <ul className="flex flex-col gap-3">
                    <NavLink
                        to="/chat"
                        title="Chat"
                        className={({ isActive }) =>
                            isActive
                                ? "duration-10 bg-[#F5F5F5] border-l-green-400 border-l-2 "
                                : ""
                        }
                    >
                        <div className="hover:bg-[#F5F5F5] hover:rounded-[5px] w-10 text-[20px] h-10 flex justify-center items-center">
                            <li className="text-2xl">
                                <RiChat1Line />
                            </li>
                        </div>
                    </NavLink>

                    <NavLink
                        to="/status"
                        title="Status"
                        className={({ isActive }) =>
                            isActive
                                ? " bg-[#F5F5F5] border-l-green-400 border-l-2 "
                                : ""
                        }
                    >
                        <div className="hover:bg-[#F5F5F5] hover:rounded-[5px] w-10 text-[20px] h-10 flex justify-center items-center">
                            <li className="text-2xl">
                                <LuCircleDashed />
                            </li>
                        </div>
                    </NavLink>

                    <NavLink
                        to="/search"
                        title="Search"
                        className={({ isActive }) =>
                            isActive
                                ? " bg-[#F5F5F5] border-l-green-400 border-l-2"
                                : ""
                        }
                    >
                        <div className="hover:bg-[#F5F5F5] hover:rounded-[5px] w-10 text-[20px] h-10 flex justify-center items-center">
                            <li className="text-2xl">
                                <CiSearch />
                            </li>
                        </div>
                    </NavLink>

                    <NavLink
                        to="/friends"
                        title="Friends"
                        className={({ isActive }) =>
                            isActive
                                ? "bg-[#F5F5F5] border-l-green-400 border-l-2"
                                : ""
                        }
                    >
                        <div className="hover:bg-[#F5F5F5] hover:rounded-[5px] w-10 text-[20px] h-10 flex justify-center items-center">
                            {" "}
                            <li className="text-2xl">
                                <FiUserPlus />{" "}
                            </li>
                        </div>
                    </NavLink>
                </ul>
            </div>

            <div>
                <div className="flex justify-center items-center flex-col">
                    <ul>
                        <NavLink
                            to="/settings"
                            title="Settings"
                            className={({ isActive }) =>
                                isActive
                                    ? "bg-[#F5F5F5] border-l-green-400 border-l-2"
                                    : ""
                            }
                        >
                            <div className="hover:bg-[#F5F5F5] hover:rounded-[5px] w-10 text-[20px] h-10 flex justify-center items-center">
                                <li className="text-2xl">
                                    <CiSettings />{" "}
                                </li>
                            </div>
                        </NavLink>
                    </ul>
                    <ul>
                        {" "}
                        <NavLink
                            to={"/profile"}
                            title="Profile"
                            className={({ isActive }) =>
                                isActive
                                    ? "bg-[#F5F5F5] border-l-green-400 border-l-2"
                                    : ""
                            }
                        >
                            <div className="rounded-full  h-7 w-7 bg-[#D9D9D9] flex justify-center items-center">
                                {/* <img
                                        src="null"
                                        className="rounded-full  h-10 w-10 bg-white"
                                        alt="profile"
                                    /> */}
                                <FaUser className="text-2xl" />
                            </div>
                            profile
                        </NavLink>
                    </ul>{" "}
                </div>
                <button>
                    <RiLogoutBoxLine />
                </button>
            </div>
        </nav>
    );
};

export default Header;
