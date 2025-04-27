import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiCamera, FiArrowRight } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../store/auth/authSlice"; // update path if needed
const Register = () => {
    const [formData, setFormData] = useState({
        profilepic: null,
        profilepicPreview: null,
        name: "",
        email: "",
        password: "",
        confirmpassword: "",
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux state
    const { loading, error, user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) {
            navigate("/chat"); // redirect after successful registration
        }
    }, [user, navigate]);

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Username is required";
            isValid = false;
        } // else if (!/^[a-z0-9_ ]+$/.test(formData.username)) {
        //     newErrors.username = "Only letters, spaces, or underscores allowed";
        //     isValid = false;
        // }

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
        // console.log(formData.name);
        // const form = new FormData();
        // form.append("name", formData.name);
        // form.append("email", formData.email);
        // form.append("password", formData.password);
        // if (formData.profilepic) {
        //     form.append("profilepic", formData.profilepic);
        // }
        // console.log(form);
        // console.log(formData);
        const userData = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            // don't send profilepic if backend doesn't expect it yet
        };
        console.log(userData);
        dispatch(registerUser(userData));
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "profilepic") {
            const file = files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFormData((prev) => ({
                        ...prev,
                        profilepic: file,
                        profilepicPreview: reader.result,
                    }));
                };
                reader.readAsDataURL(file);
            }
        } else {
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
        }
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
                        {/* Profile Pic Upload */}
                        <div className="flex flex-col items-center">
                            <label
                                htmlFor="profilepic"
                                className="relative cursor-pointer group"
                            >
                                <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-white/20 group-hover:border-teal-400 transition-all">
                                    {formData.profilepicPreview ? (
                                        <img
                                            src={formData.profilepicPreview}
                                            alt="Preview"
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
                                id="profilepic"
                                type="file"
                                name="profilepic"
                                accept="image/*"
                                onChange={handleChange}
                                className="hidden"
                            />
                        </div>

                        {/* Username */}
                        <div className="space-y-1">
                            <div className="relative">
                                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Username"
                                    className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-lg focus:ring-2 focus:ring-teal-500 text-white placeholder-white/30 ${
                                        errors.name
                                            ? "border-red-500"
                                            : "border-white/10"
                                    }`}
                                />
                            </div>
                            {errors.name && (
                                <p className="text-red-400 text-sm">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                            <div className="relative">
                                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email address"
                                    className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-lg focus:ring-2 focus:ring-teal-500 text-white placeholder-white/30 ${
                                        errors.email
                                            ? "border-red-500"
                                            : "border-white/10"
                                    }`}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-400 text-sm">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <div className="relative">
                                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-lg focus:ring-2 focus:ring-teal-500 text-white placeholder-white/30 ${
                                        errors.password
                                            ? "border-red-500"
                                            : "border-white/10"
                                    }`}
                                />
                            </div>
                            {errors.password && (
                                <p className="text-red-400 text-sm">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1">
                            <div className="relative">
                                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                                <input
                                    type="password"
                                    name="confirmpassword"
                                    value={formData.confirmpassword}
                                    onChange={handleChange}
                                    placeholder="Confirm password"
                                    className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-lg focus:ring-2 focus:ring-teal-500 text-white placeholder-white/30 ${
                                        errors.confirmpassword
                                            ? "border-red-500"
                                            : "border-white/10"
                                    }`}
                                />
                            </div>
                            {errors.confirmpassword && (
                                <p className="text-red-400 text-sm">
                                    {errors.confirmpassword}
                                </p>
                            )}
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center py-3 px-4 rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium hover:from-teal-600 hover:to-teal-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                "Creating account..."
                            ) : (
                                <>
                                    Register <FiArrowRight className="ml-2" />
                                </>
                            )}
                        </button>

                        {/* Server error */}
                        {error && (
                            <div className="text-red-400 text-center text-sm py-2">
                                {error}
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
