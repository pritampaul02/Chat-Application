import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiCamera, FiArrowRight } from "react-icons/fi";

const Register = () => {
    const [formData, setFormData] = useState({
        profilepic: null,
        username: "",
        email: "",
        password: "",
        confirmpassword: "",
    });

    const [errors, setErrors] = useState({
        username: "",
        email: "",
        password: "",
        confirmpassword: "",
    });

    const [serverError, setServerError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            username: "",
            email: "",
            password: "",
            confirmpassword: "",
        };

        // Username validation
        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
            isValid = false;
        } else if (!/^[a-zA-Z_ ]+$/.test(formData.username)) {
            newErrors.username = "Only letters, spaces, or underscores allowed";
            isValid = false;
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
            isValid = false;
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required";
            isValid = false;
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
            isValid = false;
        }

        // Confirm password validation
        if (formData.password !== formData.confirmpassword) {
            newErrors.confirmpassword = "Passwords do not match";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log("Registration data:", formData);
            navigate("/"); // Redirect after successful registration
        } catch (error) {
            setServerError("Registration failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "profilepic") {
            setFormData((prev) => ({
                ...prev,
                profilepic: files[0] || null,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));

            // Clear error when user starts typing
            if (errors[name]) {
                setErrors((prev) => ({
                    ...prev,
                    [name]: "",
                }));
            }
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.match("image.*")) {
            setErrors((prev) => ({
                ...prev,
                profilepic: "Please select an image file",
            }));
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setErrors((prev) => ({
                ...prev,
                profilepic: "Image must be less than 2MB",
            }));
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setFormData((prev) => ({
                ...prev,
                profilepicPreview: event.target.result,
                profilepic: file,
            }));
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="min-h-screen bg-cover bg-[url(https://img.freepik.com/free-photo/sunlight-shining-single-mountain-top-sunset-with-dark-cloudy-sky_181624-377.jpg?t=st=1743610986~exp=1743614586~hmac=771c52380ca61e0b2dd3b784a8b4bbe86cbf2cd643adf5202c62a5c9a62ebdb3&w=996)] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/10">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Create Account
                        </h1>
                        <p className="text-white/70">
                            Join our community today
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Profile Picture Upload */}
                        <div className="flex flex-col items-center">
                            <label
                                htmlFor="profilePic"
                                className="relative cursor-pointer group"
                            >
                                <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-white/20 group-hover:border-teal-400 transition-all">
                                    {formData.profilepicPreview ? (
                                        <img
                                            src={formData.profilepicPreview}
                                            alt="Profile preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <FiCamera className="text-3xl text-white/50 group-hover:text-teal-400" />
                                    )}
                                </div>
                                <div className="absolute bottom-0 right-0 bg-teal-500 rounded-full p-2">
                                    <FiCamera className="text-white text-sm" />
                                </div>
                            </label>
                            <input
                                id="profilePic"
                                type="file"
                                name="profilepic"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                            {errors.profilepic && (
                                <p className="text-red-400 text-sm mt-2">
                                    {errors.profilepic}
                                </p>
                            )}
                        </div>

                        {/* Username Field */}
                        <div className="space-y-1">
                            <div className="relative">
                                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Username"
                                    className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                                        errors.username
                                            ? "border-red-500"
                                            : "border-white/10"
                                    } text-white placeholder-white/30`}
                                />
                            </div>
                            {errors.username && (
                                <p className="text-red-400 text-sm">
                                    {errors.username}
                                </p>
                            )}
                        </div>

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

                        {/* Confirm Password Field */}
                        <div className="space-y-1">
                            <div className="relative">
                                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                                <input
                                    type="password"
                                    name="confirmpassword"
                                    value={formData.confirmpassword}
                                    onChange={handleChange}
                                    placeholder="Confirm password"
                                    className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                                        errors.confirmpassword
                                            ? "border-red-500"
                                            : "border-white/10"
                                    } text-white placeholder-white/30`}
                                />
                            </div>
                            {errors.confirmpassword && (
                                <p className="text-red-400 text-sm">
                                    {errors.confirmpassword}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full flex items-center justify-center py-3 px-4 rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium hover:from-teal-600 hover:to-teal-700 transition-all ${
                                isSubmitting
                                    ? "opacity-70 cursor-not-allowed"
                                    : ""
                            }`}
                        >
                            {isSubmitting ? (
                                "Creating account..."
                            ) : (
                                <>
                                    Register <FiArrowRight className="ml-2" />
                                </>
                            )}
                        </button>

                        {serverError && (
                            <div className="text-red-400 text-center text-sm py-2">
                                {serverError}
                            </div>
                        )}

                        <div className="text-center text-white/70 text-sm">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-teal-400 hover:underline font-medium"
                            >
                                Sign in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
