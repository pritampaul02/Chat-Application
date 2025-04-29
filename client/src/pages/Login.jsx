import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/auth/authActions";
import { clearError } from "../store/auth/authSlice";

// adjust import if needed

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) {
            navigate("/chat"); // redirect to home page after login
        }
    }, [user, navigate]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                dispatch(clearError());
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [error, dispatch]);

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            email: "",
            password: "",
        };

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
            isValid = false;
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        dispatch(loginUser(formData));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const handleForgotPassword = () => {
        navigate("/request-password-reset");
    };

    return (
        <div className="min-h-screen bg-cover bg-[url(https://img.freepik.com/free-photo/sunlight-shining-single-mountain-top-sunset-with-dark-cloudy-sky_181624-377.jpg)] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/10">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-white/70">Sign in to continue</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div className="space-y-1">
                            <div className="relative">
                                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email address"
                                    className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                                        errors.email
                                            ? "border-red-500"
                                            : "border-white/10"
                                    } text-white placeholder-white/30`}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-400 text-sm">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-1">
                            <div className="relative">
                                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                                        errors.password
                                            ? "border-red-500"
                                            : "border-white/10"
                                    } text-white placeholder-white/30`}
                                />
                            </div>
                            {errors.password && (
                                <p className="text-red-400 text-sm">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Forgot Password Link */}
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                className="text-sm text-teal-400 hover:underline focus:outline-none"
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex items-center justify-center cursor-pointer py-3 px-4 rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium hover:from-teal-600 hover:to-teal-700 transition-all ${
                                loading ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                        >
                            {loading ? (
                                "Signing in..."
                            ) : (
                                <>
                                    Login <FiArrowRight className="ml-2" />
                                </>
                            )}
                        </button>

                        {error && (
                            <div className="text-red-400 text-center text-sm py-2">
                                {error}
                            </div>
                        )}

                        <div className="text-center text-white/70 text-sm">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="text-teal-400 hover:underline font-medium"
                            >
                                Sign up
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
