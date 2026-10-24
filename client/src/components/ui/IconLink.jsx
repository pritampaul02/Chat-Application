import React from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

const IconLink = ({ to, title, icon, badge = 0 }) => {
    return (
        <NavLink to={to} title={title}>
            {({ isActive }) => (
                <div className="relative group flex items-center justify-center">
                    {/* Active side indicator glow */}
                    {isActive && (
                        <motion.div
                            layoutId="activeDockIndicator"
                            transition={{
                                type: "spring",
                                stiffness: 350,
                                damping: 28,
                            }}
                            className="hidden md:block absolute -left-3 h-8 w-1.5 rounded-r-full bg-[#00A1FF] shadow-[0_0_12px_#00A1FF]"
                        />
                    )}

                    {/* Active bottom indicator for mobile */}
                    {isActive && (
                        <motion.div
                            layoutId="activeMobileIndicator"
                            transition={{
                                type: "spring",
                                stiffness: 350,
                                damping: 28,
                            }}
                            className="md:hidden absolute -bottom-2 w-8 h-1 rounded-t-full bg-[#00A1FF] shadow-[0_0_12px_#00A1FF]"
                        />
                    )}

                    <div
                        className={`relative w-11 h-11 rounded-2xl flex justify-center items-center transition-all duration-200 ${
                            isActive
                                ? "bg-[#00A1FF]/15 text-[#00A1FF] border border-[#00A1FF]/30 shadow-md shadow-[#00A1FF]/15"
                                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                        }`}
                    >
                        <span className="text-xl">{icon}</span>

                        {/* Unread badge count */}
                        {badge > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 text-[10px] font-bold bg-[#00A1FF] text-white rounded-full flex items-center justify-center shadow-md animate-pulse">
                                {badge > 99 ? "99+" : badge}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </NavLink>
    );
};

export default IconLink;
