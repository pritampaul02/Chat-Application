import React, { use, useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BsChatLeftTextFill } from "react-icons/bs";
import { EllipsisVertical, Filter, Plus, Search } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { AllChat } from "../../mockData/AllChat";
import { useDispatch, useSelector } from "react-redux";
import {
    createImageStatus,
    createPollStatus,
    createTextStatus,
    deleteStatus,
    fetchStatuses,
} from "../../store/status/statusAction";
import StatusPopup from "./StatusPopup";

const IMG_LINK =
    "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png";

import { X, ImageIcon, TextIcon, BarChart3 } from "lucide-react";

const StatusCreateModal = ({ onClose }) => {
    const [mode, setMode] = useState(null); // "image" | "text" | "poll"
    const [bgColor, setBgColor] = useState("#4f46e5");
    const [textStatus, setTextStatus] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [pollOptions, setPollOptions] = useState(["", ""]);
    const [pollQuestion, setPollQuestion] = useState("");
    const [imageCaption, setImageCaption] = useState("");

    const dispatch = useDispatch();
    const handlePollOptionChange = (index, value) => {
        const updated = [...pollOptions];
        updated[index] = value;
        setPollOptions(updated);
    };

    const handleAddPollOption = () => {
        setPollOptions([...pollOptions, ""]);
    };

    const handleSubmit = () => {
        if (mode === "text") {
            dispatch(
                createTextStatus({
                    type: "text",
                    text: textStatus,
                    background: bgColor,
                })
            );
        } else if (mode === "image") {
            if (!imageFile) return;

            const formData = new FormData();
            formData.append("type", "image");
            formData.append("image", imageFile); // This sends the file as Blob
            formData.append("caption", imageCaption);
            console.log("formData dfdssfd", formData);
            dispatch(createImageStatus(formData));
            onClose();
        } else if (mode === "poll") {
            dispatch(
                createPollStatus({
                    type: "poll",
                    question: pollQuestion,
                    options: pollOptions.filter((opt) => opt.trim() !== ""),
                })
            );
        }
        onClose(); // close modal after submission
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6 relative">
                <button
                    className="absolute top-3 right-3 text-gray-700 hover:text-red-500"
                    onClick={onClose}
                >
                    <X size={20} />
                </button>

                {!mode ? (
                    <div className="flex flex-col gap-4 items-center">
                        <h2 className="text-lg font-semibold">Create Status</h2>
                        <button
                            onClick={() => setMode("text")}
                            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded flex items-center justify-center gap-2"
                        >
                            <TextIcon size={18} /> Text
                        </button>
                        <button
                            onClick={() => setMode("image")}
                            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded flex items-center justify-center gap-2"
                        >
                            <ImageIcon size={18} /> Image
                        </button>
                        <button
                            onClick={() => setMode("poll")}
                            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded flex items-center justify-center gap-2"
                        >
                            <BarChart3 size={18} /> Poll
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold capitalize">
                            {mode} Status
                        </h2>

                        {mode === "text" && (
                            <>
                                <input
                                    type="text"
                                    placeholder="What's on your mind?"
                                    value={textStatus}
                                    onChange={(e) =>
                                        setTextStatus(e.target.value)
                                    }
                                    className="w-full border rounded p-2"
                                />
                                <div className="flex items-center gap-2">
                                    <label className="text-sm">
                                        Background Color:
                                    </label>
                                    <input
                                        type="color"
                                        value={bgColor}
                                        onChange={(e) =>
                                            setBgColor(e.target.value)
                                        }
                                    />
                                </div>
                                <div
                                    className="w-full h-40 flex items-center justify-center text-white text-xl rounded"
                                    style={{ backgroundColor: bgColor }}
                                >
                                    {textStatus || "Preview"}
                                </div>
                            </>
                        )}

                        {mode === "image" && (
                            <>
                                <>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            setImageFile(e.target.files[0])
                                        }
                                    />
                                    {imageFile && (
                                        <>
                                            <img
                                                src={URL.createObjectURL(
                                                    imageFile
                                                )}
                                                alt="Preview"
                                                className="w-full h-40 object-cover rounded"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Add a caption"
                                                value={imageCaption}
                                                onChange={(e) =>
                                                    setImageCaption(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border rounded p-2 mt-2"
                                            />
                                        </>
                                    )}
                                </>
                            </>
                        )}

                        {mode === "poll" && (
                            <>
                                {" "}
                                <input
                                    type="text"
                                    placeholder="Enter poll question"
                                    value={pollQuestion}
                                    onChange={(e) =>
                                        setPollQuestion(e.target.value)
                                    }
                                    className="w-full border rounded p-2 mb-3"
                                />
                                {pollOptions.map((opt, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        placeholder={`Option ${index + 1}`}
                                        value={opt}
                                        onChange={(e) =>
                                            handlePollOptionChange(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        className="w-full border rounded p-2 mb-2"
                                    />
                                ))}
                                <button
                                    onClick={handleAddPollOption}
                                    className="text-blue-600 text-sm hover:underline"
                                >
                                    + Add Option
                                </button>
                            </>
                        )}

                        <div className="flex justify-between items-center pt-4">
                            <button
                                onClick={() => setMode(null)}
                                className="text-gray-600 hover:text-gray-800 text-sm"
                            >
                                ← Back
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded"
                            >
                                Post
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const StatusSidebar = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const { statuses, success, loading } = useSelector((state) => state.status);

    const [showOptionsId, setShowOptionsId] = useState(null); // track which status is open
    const [showCreateModal, setShowCreateModal] = useState(false);
    useEffect(() => {
        dispatch(fetchStatuses());
    }, [dispatch]);

    const handleDelete = (id) => {
        dispatch(deleteStatus(id));
        setShowOptionsId(null); // close menu after delete
    };
    useEffect(() => {
        if (success) {
            dispatch(fetchStatuses());
        }
    }, [success, dispatch]);

    const renderStatusList = statuses?.map((el) => {
        const isActive = location.pathname === `/status/${el._id}`;
        const isMenuOpen = showOptionsId === el._id;

        return (
            <div key={el._id} className="relative">
                <NavLink
                    to={`/status/${el._id}`}
                    className={`w-full flex items-center pl-6 pr-6 py-3 hover:bg-[#00A3FF22] ${
                        isActive ? "bg-[#00A3FF33]" : ""
                    }`}
                >
                    <div className="flex-shrink-0">
                        <img
                            src={el.user.profile_pic.url}
                            alt={el.user.name}
                            className="object-cover rounded-full h-12 w-12"
                        />
                    </div>
                    <div className="ml-3 flex-1 min-w-0 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[1rem] truncate">
                                {el.user.name}
                            </span>
                            <span className="text-sm text-gray-600">
                                {new Date(el.createdAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                })}
                            </span>
                        </div>
                        <div
                            onClick={(e) => {
                                e.preventDefault(); // prevent NavLink
                                setShowOptionsId((prev) =>
                                    prev === el._id ? null : el._id
                                );
                            }}
                            className="cursor-pointer"
                        >
                            <EllipsisVertical />
                        </div>
                    </div>
                </NavLink>

                {/* Options menu */}
                {isMenuOpen && (
                    <div className="absolute top-14 right-6 bg-white shadow-lg rounded-md border z-20">
                        <button
                            onClick={() => handleDelete(el._id)}
                            className="px-4 py-2 hover:bg-red-100 text-red-600 w-full text-left text-sm"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        );
    });

    return (
        <div className="w-[22rem] bg-white border-r border-[#5E5E5E33] md:ml-14 h-screen flex flex-col">
            {/* Header */}
            <div className="flex flex-col w-full px-6 pb-3 pt-4">
                <div className="flex justify-between items-center h-16">
                    <h1 className="text-2xl font-medium">Status</h1>
                    <div className="flex gap-4">
                        <Plus className="cursor-pointer" />
                        <BsThreeDotsVertical
                            size={20}
                            className="cursor-pointer"
                        />
                    </div>
                </div>
                {/* Search */}
                <div className="h-10 w-full flex justify-between items-center">
                    <div className="h-10 w-[82%] flex border border-[#CCCFD0] items-center gap-2 rounded-[8px] bg-white px-2">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full h-full outline-none text-sm"
                        />
                    </div>
                    <button className="h-10 w-10 bg-primary hover:bg-primary/85 flex items-center justify-center rounded-[12px] text-white">
                        <Plus
                            onClick={() => setShowCreateModal(true)}
                            size={24}
                        />
                    </button>
                </div>{" "}
                {showCreateModal && (
                    <StatusCreateModal
                        onClose={() => setShowCreateModal(false)}
                    />
                )}
            </div>

            {/* Status List */}
            <div className="flex-1 overflow-y-auto customScrollbar">
                <div className="sticky top-0 bg-white z-10 flex items-center px-6 py-2">
                    <BsChatLeftTextFill className="text-[0.9rem] text-[#818181]" />
                    <p className="text-[#818181] ml-2 text-[0.7rem]">
                        ALL STATUS
                    </p>
                </div>
                <div className="pb-4">{renderStatusList}</div>
            </div>
        </div>
    );
};

export default StatusSidebar;
