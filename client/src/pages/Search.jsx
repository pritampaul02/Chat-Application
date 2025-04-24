import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { UserRoundPlus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import mockData from "../mockData/mockData";

const Search = () => {
    const [query, setQuery] = useState("");
    const [showAll, setShowAll] = useState(false);
    const location = useLocation();

    const filteredResults = query
        ? mockData.filter((user) =>
              user.name.toLowerCase().includes(query.toLowerCase())
          )
        : mockData;

    const displayedResults = showAll
        ? filteredResults
        : filteredResults.slice(0, 10);
    let isloading = false;

    return (
        <div className="w-[22rem] bg-white border-r border-gray-200 h-screen flex flex-col">
            {/* Header */}
            <div className="w-full px-6 pb-3 pt-4 sticky top-0 bg-white z-10 ">
                <h1 className="text-2xl font-semibold mb-3 mt-4 text-gray-800">
                    Search
                </h1>
                <div className="flex items-center h-10 border border-gray-300 rounded-md px-3 bg-white hover:shadow transition">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setShowAll(false);
                        }}
                        placeholder="Search people..."
                        className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-500"
                    />
                    <IoSearch className="text-gray-500 text-xl" />
                </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {displayedResults.map((user) => {
                    const userPath = `/search/${user.name
                        .toLowerCase()
                        .replace(/\s+/g, "-")}/${user.id}`;
                    const isActive = location.pathname === userPath;

                    return (
                        <>
                            {" "}
                            {isloading ? (
                                <div class="flex items-center justify-between px-4 py-2 rounded-lg transition bg-gray-200 animate-pulse">
                                    <div class="flex items-center gap-3">
                                        <div class="w-10 h-10 rounded-full bg-gray-300"></div>
                                        <div class="flex flex-col">
                                            <div class="h-4 bg-gray-300 rounded w-1/2 my-1"></div>
                                            <div class="h-4 bg-gray-300 rounded w-1/2 my-1"></div>
                                        </div>
                                    </div>
                                    <div class="h-6 bg-gray-300 rounded w-20"></div>
                                </div>
                            ) : (
                                <Link
                                    to={userPath}
                                    key={user.id}
                                    className={`flex items-center justify-between px-4 py-2 rounded-lg transition ${
                                        isActive
                                            ? "bg-[#E5F4FF]"
                                            : "hover:bg-[#F0F4F7]"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={user.image}
                                            alt={user.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-gray-900">
                                                {user.name}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {user.info}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        {user.isFriend ? (
                                            <button className="text-primary text-sm font-medium hover:underline px-2 py-1">
                                                Message
                                            </button>
                                        ) : (
                                            <button className="bg-primary text-white text-sm px-3 py-1 rounded-md hover:bg-blue-700">
                                                <UserRoundPlus className="inline mr-1 w-4 h-4" />
                                                Add Friend
                                            </button>
                                        )}
                                    </div>
                                </Link>
                            )}
                        </>
                    );
                })}

                {/* See All */}
                {!showAll && filteredResults.length > 10 && (
                    <div className="text-center mt-4">
                        <button
                            onClick={() => setShowAll(true)}
                            className="text-blue-600 hover:underline text-sm font-medium"
                        >
                            See all results
                        </button>
                    </div>
                )}

                {/* No Results */}
                {filteredResults.length === 0 && (
                    <div className="text-center text-gray-500 mt-10 text-sm">
                        No users found for "
                        <span className="font-semibold">{query}</span>"
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
