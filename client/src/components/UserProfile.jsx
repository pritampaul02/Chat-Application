import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import mockData from "../mockData/mockData";

const UserProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = mockData.find((u) => u.id === Number(id));

    if (!user) {
        return (
            <div className="text-center mt-10 text-gray-500">
                User not found
            </div>
        );
    }
    let isloading = false;

    return (
        <>
            {isloading ? (
                <div className="flex flex-col w-[60rem] h-full bg-white overflow-y-auto animate-pulse">
                    <div className="relative h-96 w-full ">
                        <div className="w-full h-full relative rounded-2xl bg-gray-200 "></div>
                        <div className="absolute bottom-[-60px] left-10">
                            <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200"></div>
                        </div>
                    </div>

                    <div className="mt-20 px-10 py-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/5"></div>
                        </div>

                        <div className="flex space-x-3">
                            <div className="h-10 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-10 bg-gray-200 rounded w-1/4"></div>
                        </div>
                    </div>

                    <div className="px-10 py-6 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div>
                            <div className="h-3 bg-gray-200 rounded w-full mt-1"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4 mt-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col w-[60rem] h-full bg-white overflow-y-auto">
                    {/* Banner */}
                    <div className="relative h-96 w-full ">
                        <div
                            className={`w-full h-full relative rounded-2xl bg-gray-200 text-gray-400 `}
                        >
                            {user.banner && (
                                <img
                                    src={user.banner}
                                    className={`w-full h-full object-cover rounded-2xl `}
                                />
                            )}
                        </div>

                        {/* Profile Picture */}
                        <div className="absolute bottom-[-60px] left-10">
                            <img
                                src={user.image}
                                alt={user.name}
                                className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
                            />
                        </div>
                    </div>

                    {/* Profile Header with Name & Buttons */}
                    <div className="mt-20 px-10 py-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {user.name}
                            </h1>
                            <p className="text-gray-600">{user.info}</p>
                        </div>

                        <div className="flex space-x-3">
                            <button className="bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-primary-200 transition">
                                Add Friend
                            </button>
                            <button
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                                onClick={() => navigate(`/chat/${user.id}`)}
                            >
                                Message
                            </button>
                        </div>
                    </div>

                    {/* Description / Intro */}
                    <div className="px-10 py-6 space-y-2">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Intro
                        </h2>
                        <p className="text-gray-700">
                            🌟 Simple boy <br />
                            👨‍💻 Digital Creator <br />
                            🎓 Studied at Panskura Banamali College
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserProfile;
