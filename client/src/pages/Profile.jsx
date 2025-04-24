import React, { useState } from "react";
import { CircleUser, Camera } from "lucide-react";

const Profile = () => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [bio, setBio] = useState("Life is not same for everyone 😔😔");
    const [profileImage, setProfileImage] = useState(null);
    const [coverImage, setCoverImage] = useState(null);

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) setProfileImage(URL.createObjectURL(file));
    };

    const handleCoverPicChange = (e) => {
        const file = e.target.files[0];
        if (file) setCoverImage(URL.createObjectURL(file));
    };

    return (
        <div className="bg-gray-100 flex justify-center min-h-screen px-4 py-6">
            <div className="w-full max-w-5xl bg-white rounded-md shadow relative">
                {/* === Cover Photo === */}
                <div className="relative w-full h-[22rem] bg-gray-200 rounded-t-md overflow-hidden">
                    {coverImage ? (
                        <img
                            src={coverImage}
                            alt="cover"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                            No cover photo
                        </div>
                    )}
                    <label className="absolute right-4 bottom-4 bg-white px-3 py-1 rounded-md text-sm cursor-pointer shadow border z-10">
                        Add cover photo
                        <input
                            type="file"
                            className="hidden"
                            onChange={handleCoverPicChange}
                        />
                    </label>
                </div>

                {/* === Profile Picture - Facebook Style === */}
                <div className="absolute left-8 top-[calc(22rem-4rem)] z-30">
                    <div className="relative w-40 h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
                        {profileImage ? (
                            <img
                                src={profileImage}
                                alt="profile"
                                className="w-full h-full object-cover rounded-full"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <CircleUser className="w-20 h-20" />
                            </div>
                        )}
                        <label className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md border cursor-pointer hover:bg-gray-100 transition">
                            <Camera className="w-4 h-4 text-black" />
                            <input
                                type="file"
                                className="hidden"
                                onChange={handleProfilePicChange}
                            />
                        </label>
                    </div>
                </div>

                {/* === Name and Actions === */}
                <div className="mt-24 px-6 flex flex-col sm:flex-row sm:justify-between items-center sm:items-end">
                    <div className="text-left">
                        <h2 className="text-2xl font-bold">Your Name</h2>
                        <p className="text-sm text-gray-600">
                            Student | Developer
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex gap-2">
                        <button className="px-4 py-2 rounded-md bg-blue-600 text-white shadow hover:bg-blue-700 transition">
                            Add to Story
                        </button>
                        <button
                            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition shadow"
                            onClick={() => setIsEditOpen(true)}
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>

                {/* === Intro Section === */}
                <div className="mt-6 px-6 pb-6">
                    <div className="bg-white p-4 rounded-md shadow-sm w-full max-w-md">
                        <h3 className="font-semibold text-lg">Intro</h3>
                        <p className="text-sm text-gray-700 mt-2">{bio}</p>
                        <ul className="mt-4 space-y-2 text-sm text-gray-600">
                            <li>
                                🎓 Studied at{" "}
                                <span className="font-medium">ABC College</span>
                            </li>
                            <li>
                                💼 Works at{" "}
                                <span className="font-medium">
                                    XYZ Technologies
                                </span>
                            </li>
                            <li>
                                🏫 Went to{" "}
                                <span className="font-medium">
                                    High School 123
                                </span>
                            </li>
                        </ul>
                        <button
                            className="mt-3 text-blue-600 text-sm hover:underline"
                            onClick={() => setIsEditOpen(true)}
                        >
                            Edit Bio
                        </button>
                    </div>
                </div>

                {/* === Edit Modal === */}
                {isEditOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-lg relative shadow-lg">
                            <button
                                onClick={() => setIsEditOpen(false)}
                                className="absolute right-4 top-4 text-gray-500 text-xl font-bold"
                            >
                                &times;
                            </button>
                            <h2 className="text-xl font-bold mb-4">
                                Edit Profile
                            </h2>

                            {/* Cover Preview */}
                            <div className="relative w-full rounded-md overflow-hidden mb-4">
                                {coverImage ? (
                                    <img
                                        src={coverImage}
                                        alt="cover"
                                        className="w-full h-40 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                                        No cover photo
                                    </div>
                                )}
                                <label className="absolute right-4 bottom-2 bg-white px-3 py-1 rounded-md text-sm cursor-pointer shadow border">
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={handleCoverPicChange}
                                    />
                                    Change Cover
                                </label>
                            </div>

                            {/* Profile Preview */}
                            <div className="relative w-24 h-24 mb-4 mx-auto rounded-full overflow-hidden border-4 border-white shadow">
                                {profileImage ? (
                                    <img
                                        src={profileImage}
                                        alt="profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                                        <CircleUser className="w-10 h-10" />
                                    </div>
                                )}
                                <label className="absolute bottom-1 right-1 bg-white p-1 rounded-full cursor-pointer shadow border">
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={handleProfilePicChange}
                                    />
                                    <Camera className="h-4 w-4 text-black" />
                                </label>
                            </div>

                            {/* Bio Field */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Bio
                                </label>
                                <input
                                    type="text"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="w-full border px-3 py-2 rounded-md text-sm"
                                />
                            </div>

                            {/* Save Button */}
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setIsEditOpen(false)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
