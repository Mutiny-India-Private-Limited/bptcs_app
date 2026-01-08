import React, { useEffect, useRef, useState } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";

export default function Login() {
    const {
        data,
        setData,
        post,
        processing,
        errors: formErrors,
    } = useForm({
        member_id: "",
        mobile: "",
        otp: "",
    });
    const [otpSent, setOtpSent] = useState(false);
    const [resendKey, setResendKey] = useState(0);
    const [resendTimer, setResendTimer] = useState(60);
    const otpInputRef = useRef(null);
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!otpSent) {
            post(route("login.sendOtp"), {
                preserveScroll: true,
                onSuccess: () => {
                    setOtpSent(true);
                    setResendKey((k) => k + 1); // start timer
                },
            });
        } else {
            post(route("login.verifyOtp"), {
                preserveScroll: true,
                onError: () => {
                    setData("otp", "");
                },
            });
        }
    };

    const resendOtp = () => {
        post(route("login.sendOtp"), {
            preserveScroll: true,
            onSuccess: () => {
                setResendKey((k) => k + 1); //  restart timer
            },
        });
    };

    const { errors: propsErrors, base_url, flash } = usePage().props;
    const errors = Object.keys(formErrors).length ? formErrors : propsErrors;
    useEffect(() => {
        if (!window?.AppInterface) return;

        const fetchTokenAndSave = () => {
            try {
                const response = JSON.parse(
                    window.AppInterface.getDeviceDetails?.()
                );

                if (!response) {
                    console.warn("FCM token not found");
                    return;
                }

                axios
                    .post(route("api.saveGuestDeviceDetails"), {
                        fcm_token: response.fcm_token,
                        device_name: response.device_name,
                        device_type: response.device_type,
                        device_id: response.device_id,
                    })
                    .then(() => console.log("Device details saved"))
                    .catch((err) => {
                        console.error(
                            err.response?.data?.error || "Device save failed"
                        );
                    });
            } catch (e) {
                console.error("Invalid device details JSON", e);
            }
        };

        const autoLoginMember = () => {
            try {
                const userResponse = JSON.parse(
                    window.AppInterface?.getLoggedInUser?.()
                );
                if (userResponse === undefined || userResponse === null) {
                    console.log("No logged-in member found in app");
                    return;
                }

                axios
                    .post(route("app_login"), {
                        member_id: userResponse,
                    })
                    .then(() => {
                        window.location.reload();
                    })
                    .catch((err) => {
                        console.error(
                            err.response?.data?.message || "Auto login failed"
                        );
                    })
                    .finally(() => {});
            } catch (e) {
                console.error("Invalid logged-in user JSON", e);
            }
        };

        // Run both
        fetchTokenAndSave();
        autoLoginMember();
        if (flash?.otp_sent) {
            setOtpSent(true);
        }
    }, [flash]);
    useEffect(() => {
        if (!otpSent) return;

        setResendTimer(60);

        const interval = setInterval(() => {
            setResendTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [otpSent, resendKey]);
    useEffect(() => {
        if (otpSent && otpInputRef.current) {
            otpInputRef.current.focus();
        }
    }, [otpSent]);

    return (
        <GuestLayout title="Login">
            <div
                className={`transition-opacity duration-300 ${
                    processing
                        ? "opacity-50 pointer-events-none"
                        : "opacity-100"
                }`}
            >
                {/* Logo */}
                <div className="flex justify-center">
                    <img
                        src={`${base_url}/assets/images/logo.png`} // Replace with your logo path
                        alt="BPTCS Logo"
                        className="h-20 w-auto"
                    />
                </div>

                <h1 className="text-2xl font-extrabold text-center text-indigo-700 mb-6">
                    Member Login
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    autoComplete="off"
                >
                    {/* Member ID */}
                    <div>
                        <label className="block text-sm font-bold text-gray-600">
                            Member ID{" "}
                            <span className="text-red-500 text-xs">*</span>
                        </label>
                        <input
                            type="tel"
                            name="member_id"
                            value={data.member_id}
                            disabled={otpSent}
                            onChange={(e) =>
                                setData("member_id", e.target.value)
                            }
                            className={`mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm ${
                                otpSent ? "bg-gray-100 cursor-not-allowed" : ""
                            }`}
                            placeholder="Enter your Member ID"
                        />

                        {errors.member_id && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.member_id}
                            </p>
                        )}
                    </div>

                    {/* Mobile Number */}
                    <div>
                        <label className="block text-sm font-bold text-gray-600">
                            Mobile Number{" "}
                            <span className="text-red-500 text-xs">*</span>
                        </label>
                        <input
                            type="tel"
                            name="mobile"
                            value={data.mobile}
                            disabled={otpSent}
                            maxLength={10}
                            onChange={(e) => setData("mobile", e.target.value)}
                            className={`mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm ${
                                otpSent ? "bg-gray-100 cursor-not-allowed" : ""
                            }`}
                            placeholder="Enter your mobile number"
                        />
                        {otpSent && (
                            <button
                                type="button"
                                onClick={() => {
                                    setOtpSent(false);
                                    setData("otp", "");
                                    setResendTimer(0);
                                }}
                                className="text-xs text-indigo-600 hover:underline text-center "
                            >
                                Change Mobile Number
                            </button>
                        )}
                        {errors.mobile && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.mobile}
                            </p>
                        )}
                    </div>

                    {/* Login error */}
                    {errors.login && (
                        <p className="text-red-600 text-sm text-center">
                            {errors.login}
                        </p>
                    )}

                    {otpSent && (
                        <div>
                            <label className="block text-sm font-bold text-gray-600">
                                Enter OTP{" "}
                                <span className="text-red-500 text-xs">*</span>
                            </label>
                            <input
                                type="tel"
                                name="otp"
                                maxLength={6}
                                ref={otpInputRef}
                                value={data.otp}
                                onChange={(e) => {
                                    const value = e.target.value.replace(
                                        /\D/g,
                                        ""
                                    );
                                    setData("otp", value);
                                }}
                                className="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                placeholder="Enter OTP"
                            />

                            {otpSent && (
                                <div className="text-xs text-center mt-2">
                                    {resendTimer > 0 ? (
                                        <span className="text-gray-500">
                                            Resend OTP in {resendTimer}s
                                        </span>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={resendOtp}
                                            disabled={processing}
                                            className="text-indigo-600 hover:underline font-medium"
                                        >
                                            Resend OTP
                                        </button>
                                    )}
                                </div>
                            )}

                            {errors.otp && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.otp}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={
                            processing ||
                            (!otpSent &&
                                (data.member_id.trim() === "" ||
                                    data.mobile.length !== 10)) || // login disabled if member_id empty or mobile not 10 digits
                            (otpSent && data.otp.length !== 6) // verify disabled until OTP 6 digits
                        }
                        className={`w-full py-2.5 rounded-lg shadow-md font-semibold text-white transition-all duration-200
        ${
            processing ||
            (!otpSent &&
                (data.member_id.trim() === "" || data.mobile.length !== 10)) ||
            (otpSent && data.otp.length !== 6)
                ? "bg-indigo-400 cursor-not-allowed opacity-50"
                : "bg-indigo-600 hover:bg-indigo-700"
        }`}
                    >
                        {processing
                            ? "Processing..."
                            : otpSent
                            ? "Verify OTP"
                            : "Proceed"}
                    </button>

                    <br />
                    {/* <button
                        id="btn-login-biometric"
                        type="button"
                        onClick={() => window.startBiometricLogin()}
                        style={{ display: "none" }}
                        className="mt-3 mx-auto flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium text-indigo-600 border border-indigo-600 hover:bg-indigo-50 transition"
                    >
                        <i className="fas fa-fingerprint text-base"></i>
                        <span>Login with Fingerprint</span>
                    </button> */}
                </form>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                        © {new Date().getFullYear()} BPTCS. All rights reserved.
                    </p>
                    <Link
                        href={route("privacy_policy")}
                        className="text-xs text-indigo-600 hover:underline mt-1 inline-block"
                    >
                        Privacy & Policy
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}
