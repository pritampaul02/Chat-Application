import React from "react";
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

    return (
        <div className="flex flex-col w-full h-full bg-white overflow-y-auto">
            {/* Banner */}
            <div className="relative h-64 w-full">
                <img
                    src="https://timelinecovers.pro/facebook-cover/download/waterfall-green-nature-facebook-cover.jpg"
                    alt="Banner"
                    className="w-full h-full object-cover"
                />

                {/* Profile Picture */}
                <div className="absolute bottom-[-40px] left-10">
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
                <h2 className="text-lg font-semibold text-gray-800">Intro</h2>
                <p className="text-gray-700">
                    🌟 Simple boy <br />
                    👨‍💻 Digital Creator <br />
                    🎓 Studied at Panskura Banamali College
                </p>
            </div>
        </div>
    );
};

export default UserProfile;
