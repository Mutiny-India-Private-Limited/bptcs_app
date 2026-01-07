import React, { useEffect } from "react";
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
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("login"));
    };
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
    }, []);

    const { errors: propsErrors, base_url } = usePage().props;
    const errors = Object.keys(formErrors).length ? formErrors : propsErrors;

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
                    className="space-y-5"
                    autoComplete="off"
                >
                    {/* Member ID */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600">
                            Member ID
                        </label>
                        <input
                            type="tel"
                            name="member_id"
                            value={data.member_id}
                            onChange={(e) =>
                                setData("member_id", e.target.value)
                            }
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="none"
                            spellCheck={false}
                            className="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
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
                        <label className="block text-sm font-medium text-gray-600">
                            Mobile Number
                        </label>
                        <input
                            type="tel"
                            name="mobile"
                            value={data.mobile}
                            onChange={(e) => setData("mobile", e.target.value)}
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="none"
                            spellCheck={false}
                            className="mt-1 w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                            placeholder="Enter your mobile number"
                        />
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

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={processing}
                        className={`w-full py-2.5 rounded-lg shadow-md font-semibold text-white transition-all duration-200 ${
                            processing
                                ? "bg-indigo-400 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                    >
                        {processing ? "Verifying..." : "Login"}
                    </button>
                    <br />
                    <button
                        id="btn-login-biometric"
                        type="button"
                        onClick={() => window.startBiometricLogin()}
                        style={{ display: "none" }}
                        className="mt-3 mx-auto flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium text-indigo-600 border border-indigo-600 hover:bg-indigo-50 transition"
                    >
                        <i className="fas fa-fingerprint text-base"></i>
                        <span>Login with Fingerprint</span>
                    </button>
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
