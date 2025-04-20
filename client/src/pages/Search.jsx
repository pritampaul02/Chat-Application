import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { Link } from "react-router-dom";
import mockData from "../mockData/mockData";

const Search = () => {
    const [query, setQuery] = useState("");
    const [showAll, setShowAll] = useState(false);

    const filteredResults = query
        ? mockData.filter((user) =>
              user.name.toLowerCase().includes(query.toLowerCase())
          )
        : mockData;

    const displayedResults = showAll
        ? filteredResults
        : filteredResults.slice(0, 10);

    return (
        <div className="w-[400px] h-full bg-[#f1f3f5] border-r overflow-y-auto">
            {/* Sticky Header */}
            <div className="sticky top-0 z-20 bg-white shadow-sm">
                <div className="flex px-4 py-4 justify-between items-center h-16">
                    <h1 className="text-2xl font-medium ">Search</h1>
                </div>
                <div className="px-4 py-4">
                    <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 shadow">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setShowAll(false);
                            }}
                            placeholder="Search people..."
                            className="flex-1 px-4 py-1 text-base bg-transparent outline-none text-gray-700"
                        />
                        <IoSearch className="text-gray-500 text-xl" />
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="space-y-4 px-4 py-6">
                {displayedResults.map((user) => (
                    <Link
                        to={`${user.name.toLowerCase().replace(/\s+/g, "-")}/${
                            user.id
                        }`}
                        key={user.id}
                        className="block bg-white px-4 py-3 rounded-lg shadow-sm hover:shadow-md transition"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <img
                                    src={user.image}
                                    alt={user.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900">
                                        {user.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {user.info}
                                    </p>
                                </div>
                            </div>
                            <div>
                                {user.isFriend ? (
                                    <button className="border border-blue-600 text-blue-600 px-3 py-1 text-sm rounded-lg hover:bg-blue-50">
                                        Message
                                    </button>
                                ) : (
                                    <button className="bg-blue-600 text-white px-3 py-1 text-sm rounded-lg hover:bg-blue-700">
                                        Add Friend
                                    </button>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}

                {!showAll && filteredResults.length > 10 && (
                    <div className="text-center mt-6">
                        <button
                            onClick={() => setShowAll(true)}
                            className="text-blue-600 hover:underline text-sm"
                        >
                            See all results
                        </button>
                    </div>
                )}

                {filteredResults.length === 0 && (
                    <div className="text-center text-gray-500 mt-10 text-sm">
                        No users found for "
                        <span className="font-medium">{query}</span>"
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
