import React, { useState, useEffect } from "react";
import { CircleUser, Camera, Pencil, MapPin, X } from "lucide-react";
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
    const [isSaving, setIsSaving] = useState(false);

    const dispatch = useDispatch();
    const { user: myUser } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!myUser?._id) dispatch(getMe());
    }, [dispatch, myUser]);

    useEffect(() => {
        if (myUser) {
            setBio(myUser?.bio || "");
            setLocation(myUser?.location || "");
            setProfileImage(myUser?.profile_pic?.url || myUser?.profilePicture);
            setCoverImage(myUser?.coverPhoto?.url);
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
                // Silently ignore geocoding fallback
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
        const file = e.target.files?.[0];
        if (file) {
            setProfileImage(URL.createObjectURL(file));
            setProfileFile(file);
        }
    };

    const handleCoverPicChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverImage(URL.createObjectURL(file));
            setCoverFile(file);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append("bio", bio);
            formData.append("location", location);
            if (profileFile) formData.append("profile_pic", profileFile);
            if (coverFile) formData.append("coverPhoto", coverFile);

            await dispatch(updateProfile(formData)).unwrap();
            dispatch(getMe());
            setIsEditOpen(false);
        } catch (err) {
            console.error("Failed to update profile:", err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex-1 h-full overflow-y-auto customScrollbar p-4 sm:p-8 font-sans transition-colors duration-200">
            <div className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-3xl shadow-2xl overflow-hidden relative backdrop-blur-xl">
                {/* === Cover Photo === */}
                <div className="relative w-full h-48 sm:h-64 md:h-72 bg-gradient-to-r from-sky-100 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 overflow-hidden">
                    {coverImage ? (
                        <img
                            src={coverImage}
                            alt="Cover banner"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500 text-xs">
                            No cover photo set
                        </div>
                    )}
                    <label className="absolute right-4 bottom-4 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer shadow-lg backdrop-blur-md transition-colors flex items-center gap-1.5">
                        <Camera size={14} />
                        <span>Update Banner</span>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleCoverPicChange}
                        />
                    </label>
                </div>

                {/* === Profile Picture === */}
                <div className="relative px-6 sm:px-10 pb-6">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-6">
                        <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white dark:border-slate-950 shadow-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                    <CircleUser className="w-16 h-16" />
                                </div>
                            )}
                            <label className="absolute bottom-1 right-1 bg-[#00A1FF] hover:bg-[#008fe6] p-2 rounded-full shadow-lg border-2 border-white dark:border-slate-950 cursor-pointer transition-colors text-white">
                                <Camera className="w-3.5 h-3.5" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleProfilePicChange}
                                />
                            </label>
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="flex items-center gap-2">
                            {(profileFile || coverFile) && (
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="px-4 py-2 rounded-xl bg-[#00A1FF] hover:bg-[#008fe6] text-white text-xs font-semibold shadow-lg shadow-[#00A1FF]/20 active:scale-95 transition-all cursor-pointer"
                                >
                                    {isSaving ? "Saving..." : "Save Photos"}
                                </button>
                            )}
                            <button
                                onClick={() => setIsEditOpen(true)}
                                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700/80 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                            >
                                <Pencil size={13} />
                                <span>Edit Profile</span>
                            </button>
                        </div>
                    </div>

                    {/* Name & Bio */}
                    <div className="space-y-2 mb-6">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                            {myUser?.name || "Pulse User"}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
                            {bio || "Add a bio to let friends know what you are up to."}
                        </p>
                        {location && (
                            <p className="text-xs text-[#00A1FF] flex items-center gap-1 pt-1">
                                <MapPin size={14} />
                                <span>{location}</span>
                            </p>
                        )}
                    </div>

                    {/* Info Card */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800/80">
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/60">
                            <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                                Email Address
                            </h4>
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{myUser?.email}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/60">
                            <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                                Total Friends
                            </h4>
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                {myUser?.friends?.length || 0} Connections
                            </p>
                        </div>
                    </div>
                </div>

                {/* === Edit Profile Modal === */}
                {isEditOpen && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-6 w-full max-w-md relative shadow-2xl text-slate-800 dark:text-slate-100">
                            <button
                                onClick={() => setIsEditOpen(false)}
                                className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Edit Profile</h2>

                            {/* Bio Input */}
                            <div className="mb-4">
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                                    About / Status Bio
                                </label>
                                <textarea
                                    rows={3}
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Write a little about yourself..."
                                    className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-[#00A1FF] resize-none"
                                />
                            </div>

                            {/* Location Input with suggestions */}
                            <div className="mb-6 relative">
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    value={location}
                                    placeholder="City or country"
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-[#00A1FF]"
                                />
                                {suggestions.length > 0 && (
                                    <ul className="absolute z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 w-full mt-1 rounded-xl shadow-2xl max-h-36 overflow-y-auto customScrollbar text-xs divide-y divide-slate-200 dark:divide-slate-800">
                                        {suggestions.map((s, idx) => (
                                            <li
                                                key={idx}
                                                onClick={() => handleSelectSuggestion(s)}
                                                className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-slate-700 dark:text-slate-300"
                                            >
                                                {s}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Modal Actions */}
                            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                                <button
                                    onClick={() => setIsEditOpen(false)}
                                    className="px-4 py-2 rounded-xl text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#00A1FF] hover:bg-[#008fe6] text-white shadow-lg shadow-[#00A1FF]/25 hover:opacity-95 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                                >
                                    {isSaving ? "Saving..." : "Save Changes"}
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
