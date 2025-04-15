import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    // const [profilePic, setProfilePic] = useState("");
    const [previewImage, setPreviewImage] = useState(null);

    const [error, setError] = useState({
        profilepic: "",
        username: "",
        email: "",
        password: "",
        confirmpassword: "",
    });
    const [serverError, setServerError] = useState("");
    const [registerForm, setRegisterForm] = useState({
        profilepic: "",
        username: "",
        email: "",
        password: "",
        confirmpassword: "",
    });
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { profilepic, username, email, password, confirmpassword } =
            registerForm;
        if (!profilepic) {
            const proceed = window.confirm(
                "You have not picked a profile picture!\nDo you want to proceed without uploading one?"
            );
            if (!proceed) return; // Let user pick again
        }

        if (username.trim() === "") {
            setError({ ...error, username: "Username is required" });
            return;
        }
        setError({ ...error, username: "" });
        if (!/^[a-zA-Z_ ]+$/.test(username)) {
            setError({
                ...error,
                username:
                    "Username must contain only letters, spaces, or underscores",
            });
            return;
        }
        setError({ ...error, username: "" });

        if (email.trim() === "") {
            setError({ ...error, email: "Email is required" });
            return;
        }
        setError({ ...error, email: "" });
        if (password.trim() === "") {
            setError({ ...error, password: "Password is required" });
            return;
        }
        setError({ ...error, password: "" });
        if (password.length < 8) {
            setError({
                ...error,
                password: "Password must be at least 8 characters",
            });
            return;
        }
        setError({ ...error, password: "" });
        if (confirmpassword.trim() === "") {
            setError({
                ...error,
                confirmpassword: "confirmpassword is required",
            });
            return;
        }
        setError({ ...error, confirmpassword: "" });
        if (password !== confirmpassword) {
            setError({
                ...error,
                confirmpassword: "password do not match",
            });
            return;
        }
        setError({
            ...error,
            confirmpassword: "",
        });
        // setError({ username: "", email: "", password: "", confirmpassword: "" });
        // Simulating API Call

        console.log("Register in", registerForm);
    };

    // const handleChange = (e) => {
    // setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
    // console.log(registerForm.profilepic);
    // }
    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "profilepic") {
            if (files.length > 0) {
                const file = files[0];
                const reader = new FileReader();

                reader.onloadend = () => {
                    setPreviewImage(reader.result);
                };

                reader.readAsDataURL(file);

                setRegisterForm((prev) => ({
                    ...prev,
                    profilepic: file,
                }));
            } else {
                // File dialog closed without selection
                setPreviewImage(null);
                setRegisterForm((prev) => ({
                    ...prev,
                    profilepic: "",
                }));
            }
        } else {
            setRegisterForm((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    return (
        <div className="h-screen bg-cover bg-[url(https://img.freepik.com/free-photo/sunlight-shining-single-mountain-top-sunset-with-dark-cloudy-sky_181624-377.jpg?t=st=1743610986~exp=1743614586~hmac=771c52380ca61e0b2dd3b784a8b4bbe86cbf2cd643adf5202c62a5c9a62ebdb3&w=996)] flex justify-center items-center bg-gray-900">
            <div className="flex flex-col items-center justify-center w-full h-full">
                <div className="w-[400px] backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white/20">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">
                        Register
                    </h2>
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-5"
                    >
                        {/* Profile Picture Upload */}
                        <div className="relative">
                            {previewImage && (
                                <div className="flex justify-center mb-2">
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className="w-20 h-20 object-cover rounded-full border border-gray-300"
                                    />
                                </div>
                            )}

                            <label
                                htmlFor="profilePic"
                                className="block text-sm font-medium text-white mb-2"
                            >
                                Upload Profile Picture
                            </label>
                            <input
                                type="file"
                                id="profilePic"
                                name="profilepic"
                                accept="image/*"
                                onChange={handleChange}
                                className="w-full bg-white/20 text-white rounded-md p-2 border border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-teal-400 file:text-white hover:file:bg-teal-400"
                            />
                            {error.profilepic && (
                                <p className="text-red-400 text-sm mt-1">
                                    {error.profilepic}
                                </p>
                            )}
                        </div>
                        {/UserName Input Field/}
                        <div className="relative">
                            <label
                                htmlFor="username"
                                className={`absolute left-3 top-3 transition-all text-gray-300 text-sm ${
                                    registerForm.username
                                        ? "top-[-10px] text-xs text-white bg-gray-600 px-1"
                                        : "top-3"
                                }`}
                            >
                                Enter username
                            </label>
                            <input
                                id="username"
                                className={`w-full p-3 bg-white/20 text-white border ${
                                    error.username
                                        ? "border-red-500"
                                        : "border-gray-300 "
                                } rounded-md focus:outline-none placeholder-transparent`}
                                type="username"
                                name="username"
                                value={registerForm.username}
                                onChange={handleChange}
                                required
                            />
                            {error.username && (
                                <p className="text-red-400 text-sm mt-1">
                                    {error.username}
                                </p>
                            )}
                        </div>
                        {/* Email Input Field */}
                        <div className="relative">
                            <label
                                htmlFor="email"
                                className={`absolute left-3 top-3 transition-all text-gray-300 text-sm ${
                                    registerForm.email
                                        ? "top-[-10px] text-xs text-white bg-gray-600 px-1"
                                        : "top-3"
                                }`}
                            >
                                Enter email
                            </label>
                            <input
                                id="email"
                                className={`w-full p-3 bg-white/20 text-white border ${
                                    error.email
                                        ? "border-red-500"
                                        : "border-gray-300 "
                                } rounded-md focus:outline-none placeholder-transparent`}
                                type="email"
                                name="email"
                                value={registerForm.email}
                                onChange={handleChange}
                                required
                            />
                            {error.email && (
                                <p className="text-red-400 text-sm mt-1">
                                    {error.email}
                                </p>
                            )}
                        </div>
                        {/* Password Input Field */}
                        <div className="relative">
                            <label
                                htmlFor="password"
                                className={`absolute left-3 top-3 transition-all text-gray-300 text-sm ${
                                    registerForm.password
                                        ? "top-[-10px] text-xs text-white  bg-gray-600 px-1"
                                        : "top-3"
                                }`}
                            >
                                Enter password
                            </label>
                            <input
                                id="password"
                                className={`w-full p-3 bg-white/20 text-white border ${
                                    error.password
                                        ? "border-red-500"
                                        : "border-gray-300"
                                } rounded-md focus:outline-none placeholder-transparent`}
                                type="password"
                                name="password"
                                value={registerForm.password}
                                onChange={handleChange}
                                required
                            />
                            {error.password && (
                                <p className="text-red-400 text-sm mt-1">
                                    {error.password}
                                </p>
                            )}
                        </div>
                        {/* confirmpassword Input Field */}
                        <div className="relative">
                            <label
                                htmlFor="confirmpassword"
                                className={`absolute left-3 top-3 transition-all text-gray-300 text-sm ${
                                    registerForm.confirmpassword
                                        ? "top-[-10px] text-xs text-white  bg-gray-600 px-1"
                                        : "top-3"
                                }`}
                            >
                                Enter confirmpassword
                            </label>
                            <input
                                id="confirmpassword"
                                className={`w-full p-3 bg-white/20 text-white border ${
                                    error.confirmpassword
                                        ? "border-red-500"
                                        : "border-gray-300"
                                } rounded-md focus:outline-none placeholder-transparent`}
                                type="password"
                                name="confirmpassword"
                                value={registerForm.confirmpassword}
                                onChange={handleChange}
                                required
                            />
                            {error.confirmpassword && (
                                <p className="text-red-400 text-sm mt-1">
                                    {error.confirmpassword}
                                </p>
                            )}
                        </div>
                        {/* Register Button */}
                        <button
                            type="submit"
                            className="w-full flex justify-center bg-teal-500 hover:bg-teal-400 text-white font-semibold py-3 rounded-md cursor-pointer transition"
                        >
                            Register
                        </button>
                        {/* Server Error Message */}
                        {serverError && (
                            <p className="text-red-400 text-sm mt-2 text-center">
                                {serverError}
                            </p>
                        )}
                        {/* Register Link */}
                        <p className="text-center text-sm text-gray-300">
                            Already have an account?
                            <Link
                                to="/login"
                                className="text-teal-300 hover:underline"
                            >
                                Login now
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default Register;