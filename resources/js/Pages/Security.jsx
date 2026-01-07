import React, { useState, useEffect } from "react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";
import { router } from "@inertiajs/react";

export default function Security() {
    const [showPopup, setShowPopup] = useState(false);
    const [enabled, setEnabled] = useState(false);
    const hasToken = window.AndroidBiometric.hasBiometricToken();

    useEffect(() => {
        setShowPopup(true);
        if (!window.AndroidBiometric) {
            router.visit(route("home"));
        } else {
            if (hasToken) {
                setEnabled(true);
                setShowPopup(false);
                router.visit(route("home"));
            } else {
                console.log("No Token found");
            }
        }
    }, []);

    const enableTouchID = async () => {
        try {
            if (!hasToken) {
                await window.enableTouchID?.();
            } else {
                console.log("Token already exists");
            }
        } catch (err) {
            console.log("TouchID scan failed", err);
        }
    };

    window.enableTouchID = async function () {
        try {
            const response = await axios.post(
                route("generateBioToken"),
                {},
                { withCredentials: true }
            );

            const token = response.data?.token;
            if (!token || !response.data.success) {
                console.log("Token not generated or request failed");
                return;
            }

            if (!window.AndroidBiometric) {
                console.log("AndroidBiometric not available");
                return;
            }

            const loginResponse = window.AndroidBiometric.saveLoginToken(token);
            console.log(loginResponse);

            const enabled = window.AndroidBiometric.hasBiometricToken();

            if (enabled) {
                console.log("TouchID enabled successfully");
                setEnabled(true);
                setShowPopup(false); // CLOSE POPUP HERE
                router.reload();
            } else {
                console.log("Failed to save biometric token");
            }
        } catch (err) {
            console.error(
                err.response?.data?.message ||
                    "Failed to enable biometric login"
            );
        }
    };

    window.onBiometricSuccess = function () {
        console.log("Android verified successfully!");

        // You can show a success message or redirect the user
        alert("Touch ID Enabled Successfully!");

        // Example: Redirect to dashboard after a short delay
        setTimeout(() => {
            router.visit(route("home"));
        }, 500);
    };
    // Minimal version: Prevents the error and logs the event
    window.appLockVerified = function () {
        console.log("App content is now visible.");
        // You don't need to call any other functions here
    };

    const touchIdDescription = (
        <>
            Enable Touch ID to log in securely using your fingerprint without
            entering your password each time.
        </>
    );

    const touchIdBenefits = (
        <ul className="mt-4 space-y-2 text-sm text-gray-700">
            <li>• Faster login experience</li>
            <li>• Your fingerprint is stored securely on your device</li>
            <li>• No biometric data is saved on our servers</li>
            <li>• Adds an extra layer of account protection</li>
        </ul>
    );

    return (
        <AppLayout title="Security">
            {/* Header */}
            <PageHeader
                title="Security"
                subtitle="Manage your login and authentication settings"
            />

            {/* Content */}
            <div className="max-w-xl mx-auto mt-8 px-4">
                <div
                    onClick={() => setShowPopup(true)}
                    className="cursor-pointer bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
                >
                    <h3 className="text-lg font-semibold text-gray-900">
                        Touch ID Login
                    </h3>

                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                        {touchIdDescription}
                    </p>

                    {touchIdBenefits}

                    <div className="mt-4 text-sm font-medium">
                        {enabled ? (
                            <span className="text-green-600">
                                Touch ID is enabled ✓
                            </span>
                        ) : (
                            <span className="text-indigo-600">
                                Tap to enable Touch ID →
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Popup */}
            {showPopup && (
                <div className="fixed inset-0 z-[50000001] flex items-center justify-center bg-black/60">
                    <div className="bg-white rounded-2xl w-[90%] max-w-sm p-6 shadow-xl">
                        {/* Icon */}
                        <div className="flex justify-center mb-4">
                            <i className="fa-solid fa-fingerprint text-indigo-600 text-3xl"></i>
                        </div>

                        {/* Title */}
                        <h2 className="text-xl font-semibold text-gray-900 text-center">
                            Enable Touch ID
                        </h2>

                        {/* Description */}
                        <p className="text-sm text-gray-600 mt-2 leading-relaxed text-center">
                            {touchIdDescription}
                        </p>

                        {/* Benefits */}
                        <div className="mt-4 text-left">{touchIdBenefits}</div>

                        {/* Action Button */}
                        <button
                            onClick={enableTouchID}
                            disabled={enabled}
                            className={`mt-6 w-full py-3 rounded-xl font-semibold transition
                    ${
                        enabled
                            ? "bg-green-500 text-white"
                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }
                `}
                        >
                            {enabled ? "Touch ID Enabled ✓" : "Enable Touch ID"}
                        </button>

                        {/* Cancel */}
                        {/* {!enabled && (
                            <button
                                onClick={() => setShowPopup(false)}
                                className="mt-4 w-full text-sm text-gray-500 hover:text-gray-700"
                            >
                                Not Now
                            </button>
                        )} */}
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
