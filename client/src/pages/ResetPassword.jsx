import React, { useState, useEffect } from "react";
import { FiArrowRight } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    resetPassword,
    sendResetOtp,
} from "../store/forgotPassword/forgotPasswordSlice.controller";
import { clearForgotPasswordState } from "../store/forgotPassword/forgotPasswordSlice";

const ResetPassword = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const email = state?.email;

    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [localError, setLocalError] = useState("");

    const [timer, setTimer] = useState(300); // 5 minutes
    const [resendVisible, setResendVisible] = useState(false);

    const { loading, error, message, otpSent, passwordReset } = useSelector(
        (state) => state.forgotPassword
    );

    // Countdown logic
    useEffect(() => {
        if (timer === 0) {
            return;
        }

        if (timer === 239) {
            setResendVisible(true);
        }

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    // Redirect on successful password reset
    useEffect(() => {
        if (passwordReset) {
            setTimeout(() => {
                navigate("/login");
            }, 1500);
        }

        return () => {
            dispatch(clearForgotPasswordState());
        };
    }, [passwordReset, navigate, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLocalError("");

        if (!otp || !password || !confirmPassword) {
            setLocalError("All fields are required");
            return;
        }
        if (password.length < 8) {
            setLocalError("Password must be at least 8 characters");
            return;
        }
        if (password !== confirmPassword) {
            setLocalError("Passwords do not match");
            return;
        }

        dispatch(resetPassword({ email, otp, password }));
    };

    const handleResendOtp = () => {
        dispatch(sendResetOtp(email));
        setTimer(300);
        setResendVisible(false);
    };

    const formatTime = (seconds) => {
        const m = String(Math.floor(seconds / 60)).padStart(2, "0");
        const s = String(seconds % 60).padStart(2, "0");
        return `${m}:${s}`;
    };

    const timerColor = timer <= 60 ? "text-red-400" : "text-green-400";

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-[url(https://res.cloudinary.com/dyyy9djvx/image/upload/v1751125716/background_image_fvpfcp.jpg)] p-4">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6">
                <h2 className="text-2xl text-white text-center mb-6">
                    Reset Password
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:ring-2 focus:ring-teal-500"
                        value={otp}
                        maxLength={6}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <div className="flex justify-between items-center text-sm">
                        <span className={timerColor}>
                            {timer === 0
                                ? "OTP expired"
                                : `OTP expires in: ${formatTime(timer)}`}
                        </span>
                        {resendVisible && (
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                className="text-teal-300 hover:underline cursor-pointer"
                            >
                                Resend OTP
                            </button>
                        )}
                    </div>
                    <input
                        type="password"
                        placeholder="New Password"
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:ring-2 focus:ring-teal-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:ring-2 focus:ring-teal-500"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    {localError && (
                        <p className="text-red-400 text-sm">{localError}</p>
                    )}
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    {otpSent && (
                        <p className="text-green-400 text-sm">
                            OTP resent successfully!
                        </p>
                    )}
                    {passwordReset && (
                        <p className="text-green-400 text-sm">
                            Password reset successfully!
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading.resetPassword}
                        className="w-full cursor-pointer py-3 bg-teal-600 hover:bg-teal-700 rounded-lg text-white font-medium flex items-center justify-center"
                    >
                        {loading.resetPassword
                            ? "Resetting..."
                            : "Reset Password"}
                        <FiArrowRight className="ml-2" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
