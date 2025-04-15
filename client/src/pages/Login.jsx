import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputBox from "../components/ui/InputBox";

const Login = () => {
    const [error, setError] = useState({ email: "", password: "" });
    const [serverError, setServerError] = useState("");
    const [logInForm, setLogInForm] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { email, password } = logInForm;

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
        setError({
            ...error,
            password: "",
        });

        // setError({ email: "", password: "" });

        // Simulating API Call

        console.log("Logging in", logInForm);
    };

    const handleForgetUser = () => {
        navigate("/request-password-reset");
    };

    const handleChange = (e) => {
        setLogInForm({ ...logInForm, [e.target.name]: e.target.value });
    };

    return (
        <div className="h-screen  bg-cover bg-[url(https://img.freepik.com/free-photo/sunlight-shining-single-mountain-top-sunset-with-dark-cloudy-sky_181624-377.jpg?t=st=1743610986~exp=1743614586~hmac=771c52380ca61e0b2dd3b784a8b4bbe86cbf2cd643adf5202c62a5c9a62ebdb3&w=996)] flex justify-center items-center bg-gray-900">
            <div className="flex flex-col items-center justify-center w-full h-full">
                <div className="w-[400px] backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white/20">
                    <h2 className="text-2xl font-bold text-white mb-6 text-center">
                        Login
                    </h2>
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-5"
                    >
                        {/* Email Input Field */}
                        <div className="relative">
                            <label
                                htmlFor="email"
                                className={`absolute left-3 top-3 transition-all text-gray-300 text-sm ${
                                    logInForm.email
                                        ? "top-[-10px] text-xs text-white bg-gray-600 px-1"
                                        : "top-3"
                                }`}
                            >
                                Enter email
                            </label>
                            {/* <InputBox
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                name="email"
                                className={`w-full p-3 bg-white/20 text-white border ${
                                    error.email
                                        ? "border-red-500"
                                        : "border-gray-300 "
                                } rounded-md focus:outline-none placeholder-transparent`}
                                value={logInForm.email}
                                onChange={handleChange}
                                required
                                labelShow={true}
                            /> */}

                            <input
                                id="email"
                                className={`w-full p-3 bg-white/20 text-white border ${
                                    error.email
                                        ? "border-red-500"
                                        : "border-gray-300 "
                                } rounded-md focus:outline-none placeholder-transparent`}
                                type="email"
                                name="email"
                                value={logInForm.email}
                                onChange={handleChange}
                                required
                            />
                            {error.email && (
                                <p className="text-red-400 text-sm mt-1">
                                    {error.email}
                                </p>
                            )}
                        </div>
                        {/* Password Input Field */}{" "}
                        <div className="relative">
                            <label
                                htmlFor="password"
                                className={`absolute left-3 top-3 transition-all text-gray-300 text-sm ${
                                    logInForm.password
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
                                value={logInForm.password}
                                onChange={handleChange}
                                required
                            />
                            {error.password && (
                                <p className="text-red-400 text-sm mt-1">
                                    {error.password}
                                </p>
                            )}
                        </div>
                        {/* Forgot Password */}
                        <div
                            onClick={handleForgetUser}
                            className="text-teal-300 cursor-pointer hover:underline"
                        >
                            Forgot password?
                        </div>
                        {/* Login Button */}
                        <button
                            type="submit"
                            className="w-full flex justify-center bg-teal-500 hover:bg-teal-400 text-white font-semibold py-3 rounded-md cursor-pointer transition"
                        >
                            Login
                        </button>
                        {/* Server Error Message */}
                        {serverError && (
                            <p className="text-red-400 text-sm mt-2 text-center">
                                {serverError}
                            </p>
                        )}
                        {/* Register Link */}
                        <p className="text-center text-sm text-gray-300">
                            Don't have an account?
                            <Link
                                to="/register"
                                className="text-teal-300 hover:underline"
                            >
                                Register Now
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;