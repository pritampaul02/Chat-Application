import React, { useState, useEffect } from "react";
import { FiMail, FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { sendResetOtp } from "../store/forgotPassword/forgotPasswordSlice.controller";
import { clearForgotPasswordState } from "../store/forgotPassword/forgotPasswordSlice";

const RequestPasswordReset = () => {
    const [email, setEmail] = useState("");
    const [localError, setLocalError] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, success } = useSelector(
        (state) => state.forgotPassword
    );

    useEffect(() => {
        if (success) {
            setTimeout(() => {
                navigate("/reset-password", { state: { email } });
            }, 1000);
        }
        return () => {
            dispatch(clearForgotPasswordState());
        };
    }, [success, navigate, email, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email.trim()) {
            setLocalError("Email is required");
            return;
        }
        dispatch(sendResetOtp(email));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-[url(https://res.cloudinary.com/dyyy9djvx/image/upload/v1751125716/background_image_fvpfcp.jpg)] p-4">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6">
                <h2 className="text-2xl text-white text-center mb-6">
                    Forgot Password?
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative">
                        <FiMail className="absolute left-3 top-3.5 text-white/50" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setLocalError("");
                            }}
                            placeholder="Enter your email"
                            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                    {localError && (
                        <p className="text-red-400 text-sm">{localError}</p>
                    )}
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    {success && (
                        <p className="text-green-400 text-sm">
                            OTP sent to your email
                        </p>
                    )}
                    <button
                        type="submit"
                        disabled={loading.sendResetOtp}
                        className="w-full py-3 bg-teal-600 hover:bg-teal-700 rounded-lg text-white font-medium flex items-center justify-center"
                    >
                        {loading.sendResetOtp ? "Sending..." : "Send OTP"}
                        <FiArrowRight className="ml-2" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RequestPasswordReset;
