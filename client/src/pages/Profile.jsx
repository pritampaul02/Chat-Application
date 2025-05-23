// ✅ FULLY RESPONSIVE Profile Component (Optimized)
import React, { useState, useEffect } from "react";
import { CircleUser, Camera, Pencil } from "lucide-react";
import { CiLocationOn } from "react-icons/ci";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getMe, updateProfile } from "../store/auth/authActions";

const Profile = () => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [bio, setBio] = useState("");
    const [location, setLocation] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [profileImage, setProfileImage] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [profileFile, setProfileFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);

    const dispatch = useDispatch();
    const { user: myUser } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!myUser?._id) dispatch(getMe());
    }, [dispatch, myUser]);

    useEffect(() => {
        if (myUser) {
            setBio(myUser.bio || "");
            setLocation(myUser.location || "");
            setProfileImage(myUser.profile_pic.url);
            setCoverImage(myUser.coverPhoto.url);
        }
    }, [myUser]);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (location.trim().length < 2) return setSuggestions([]);
            try {
                const res = await axios.get(
                    "https://api.opencagedata.com/geocode/v1/json",
                    {
                        params: {
                            key: import.meta.env.VITE_SEARCH_LOCATION_API_KEY,
                            q: location,
                            limit: 5,
                            language: "en",
                        },
                    }
                );
                setSuggestions(res.data.results.map((r) => r.formatted));
            } catch (err) {
                console.error(err);
            }
        };
        const debounce = setTimeout(fetchSuggestions, 400);
        return () => clearTimeout(debounce);
    }, [location]);

    const handleSelectSuggestion = (s) => {
        setLocation(s);
        setSuggestions([]);
    };

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(URL.createObjectURL(file));
            setProfileFile(file);
        }
    };

    const handleCoverPicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImage(URL.createObjectURL(file));
            setCoverFile(file);
        }
    };

    const handleSave = () => {
        const formData = new FormData();
        formData.append("bio", bio);
        formData.append("location", location);
        if (profileFile) formData.append("profile_pic", profileFile);
        if (coverFile) formData.append("coverPhoto", coverFile);

        dispatch(updateProfile(formData)).then(() => {
            setIsEditOpen(false);
        });
    };

    return (
        <div className="bg-gray-100 md:ml-14 flex justify-center min-h-screen px-2 sm:px-4 py-6">
            <div className="w-full max-w-5xl bg-white rounded-md shadow relative">
                {/* === Cover Photo === */}
                <div className="relative w-full h-[16rem] sm:h-[20rem] md:h-[22rem] bg-gray-200 rounded-t-md overflow-hidden">
                    {myUser?.coverPhoto?.url ? (
                        <img
                            src={myUser?.coverPhoto?.url}
                            alt="cover"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                            No cover photo
                        </div>
                    )}
                    <label className="absolute right-2 bottom-2 bg-white px-2 py-1 rounded-md text-xs sm:text-sm cursor-pointer shadow border z-10">
                        Add cover photo
                        <input
                            type="file"
                            className="hidden"
                            onChange={handleCoverPicChange}
                        />
                    </label>
                </div>

                {/* === Profile Picture === */}
                <div className="absolute left-4 sm:left-8 top-[calc(16rem-3.5rem)] sm:top-[calc(20rem-4rem)] z-30">
                    <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
                        {myUser?.profile_pic?.url ? (
                            <img
                                src={myUser?.profile_pic?.url}
                                alt="profile"
                                className="w-full h-full object-cover rounded-full"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <CircleUser className="w-16 h-16" />
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
                <div className="mt-24 sm:mt-28 px-4 sm:px-6 flex flex-col sm:flex-row sm:justify-between items-center sm:items-end gap-4 sm:gap-0">
                    <div className="text-center sm:text-left">
                        <h2 className="text-xl sm:text-2xl font-bold">
                            {myUser.name}
                        </h2>
                        <p className="text-sm text-gray-600">{bio}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <button className="w-full sm:w-auto px-4 py-2 rounded-md bg-primary text-white shadow hover:bg-blue-700 transition text-sm">
                            Add to Story
                        </button>
                        <button
                            className="w-full sm:w-auto px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition shadow text-sm"
                            onClick={() => setIsEditOpen(true)}
                        >
                            <Pencil className="inline mr-2" />
                            Edit Profile
                        </button>
                    </div>
                </div>

                {/* === Intro Section === */}
                <div className="mt-6 px-4 sm:px-6 pb-6">
                    <div className="bg-white p-4 rounded-md shadow-sm w-full max-w-md mx-auto">
                        <h3 className="font-semibold text-base sm:text-lg">
                            Intro
                        </h3>
                        <p className="text-sm text-gray-700 mt-2">{bio}</p>
                        <ul className="mt-4 space-y-2 text-sm text-gray-600">
                            {/* <li>
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
                            </li> */}
                            <li>
                                <CiLocationOn className="inline text-lg" /> From{" "}
                                <span className="font-medium">{location}</span>
                            </li>
                        </ul>
                        <button
                            className="mt-3 text-blue-600 text-sm hover:underline"
                            onClick={() => setIsEditOpen(true)}
                        >
                            Edit Bio
                        </button>
                        <div className="flex justify-end mt-2">
                            {(profileFile || coverFile) && (
                                <button
                                    className="text-white bg-primary px-3 py-1.5 rounded-md text-sm hover:bg-blue-700 transition"
                                    onClick={handleSave}
                                >
                                    Save
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* === Edit Modal === */}
                {isEditOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
                        <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-lg relative shadow-lg max-h-[90vh] overflow-y-auto">
                            <button
                                onClick={() => setIsEditOpen(false)}
                                className="absolute right-4 top-4 text-gray-500 text-xl font-bold"
                            >
                                &times;
                            </button>
                            <h2 className="text-lg sm:text-xl font-bold mb-4">
                                Edit Profile
                            </h2>

                            {/* Cover Preview */}
                            <div className="relative w-full rounded-md overflow-hidden mb-4">
                                {coverImage ? (
                                    <img
                                        src={coverImage}
                                        alt="cover"
                                        className="w-full h-32 sm:h-40 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-32 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                                        No cover photo
                                    </div>
                                )}
                                <label className="absolute right-4 bottom-2 bg-white px-2 py-1 rounded-md text-sm cursor-pointer shadow border">
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={handleCoverPicChange}
                                    />
                                    Change Cover
                                </label>
                            </div>

                            {/* Profile Preview */}
                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-4 mx-auto rounded-full overflow-hidden border-4 border-white shadow">
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

                            {/* Location Field with Suggestions */}
                            <div className="mb-4 relative">
                                <label className="block text-sm font-medium mb-1">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    value={location}
                                    placeholder="City or country"
                                    onChange={(e) =>
                                        setLocation(e.target.value)
                                    }
                                    className="w-full border px-3 py-2 rounded-md text-sm"
                                />
                                {suggestions.length > 0 && (
                                    <ul className="absolute z-50 bg-white border w-full mt-1 rounded shadow max-h-40 overflow-y-auto">
                                        {suggestions.map((s, idx) => (
                                            <li
                                                key={idx}
                                                onClick={() =>
                                                    handleSelectSuggestion(s)
                                                }
                                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                            >
                                                {s}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Save */}
                            <div className="flex justify-end">
                                <button
                                    onClick={handleSave}
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
