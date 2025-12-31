import React, { useEffect, useState } from "react";
import { Link, usePage, router, Head } from "@inertiajs/react";
import Toast, { showToast } from "@/Components/Toast";

export default function AppLayout({ children, ...meta }) {
    const title = meta.title || "BPTCS";
    const [loading, setLoading] = useState(false);
    const { flash, base_url } = usePage().props;
    const isActive = (routeName) => route().current(routeName);
    useEffect(() => {
        const start = () => {
            setLoading(true);
            showToast.dismiss(); // remove any toasts when navigating
        };
        const stop = () => setLoading(false);

        const removeStart = router.on("start", start);
        const removeFinish = router.on("finish", stop);
        const removeError = router.on("error", stop);

        return () => {
            removeStart();
            removeFinish();
            removeError();
        };
    }, []);

    useEffect(() => {
        if (flash?.success) showToast.success(flash.success);
        else if (flash?.error) showToast.error(flash.error);
    }, [flash]);

    useEffect(() => {
        //  Check if running inside Android App
        // if (window.AndroidBiometric) {
        //     const canScan = window.AndroidBiometric.canAuthenticate();
        //     const hasToken = window.AndroidBiometric.hasBiometricToken();
        //     console.log(hasToken);
        //     if (canScan) {
        //         const wrapper = document.getElementById("biometric-wrapper");
        //         if (wrapper) wrapper.style.display = "block";

        //         if (hasToken) {
        //             const loginBtn = document.getElementById(
        //                 "btn-login-biometric"
        //             );
        //             if (loginBtn) loginBtn.style.display = "block";
        //         } else {
        //             // const setupBtn = document.getElementById(
        //             //     "btn-setup-biometric"
        //             // );
        //             // if (setupBtn) setupBtn.style.display = "block";
        //             const switchEl = document.getElementById("touch-id-switch");
        //             const knobEl = document.getElementById("touch-id-knob");

        //             if (!switchEl) return;

        //             switchEl.setAttribute("aria-checked", !hasToken);

        //             if (!hasToken) {
        //                 switchEl.style.backgroundColor = "#34C759"; // green
        //                 knobEl.style.left = "18px"; // move knob right
        //             } else {
        //                 switchEl.style.backgroundColor = "#d1d5db"; // gray
        //                 knobEl.style.left = "2px"; // move knob left
        //                 window.AndroidBiometric.deleteBiometricToken?.();
        //             }
        //         }
        //     }
        // }
        if (window.AndroidBiometric) {
            const canScan = window.AndroidBiometric.canAuthenticate();
            const hasToken = window.AndroidBiometric.hasBiometricToken();

            if (canScan) {
                // 1. Show the main container if biometrics are supported
                const wrapper = document.getElementById("biometric-wrapper");
                if (wrapper) wrapper.style.display = "block";

                // 2. Handle the Login Button (for the Login Page)
                const loginBtn = document.getElementById("btn-login-biometric");
                if (loginBtn) {
                    loginBtn.style.display = hasToken ? "block" : "none";
                }

                // 3. Handle the Toggle Switch (for the Settings Page)
                const switchEl = document.getElementById("touch-id-switch");
                const knobEl = document.getElementById("touch-id-knob");

                if (switchEl && knobEl) {
                    // Set initial state based on current Android storage
                    updateToggleUI(hasToken, switchEl, knobEl);

                    // Add the click listener to handle Enable/Disable
                    switchEl.onclick = function () {
                        const currentlyEnabled =
                            window.AndroidBiometric.hasBiometricToken();

                        if (currentlyEnabled) {
                            // DISABLE: Remove from Android storage
                            window.AndroidBiometric.deleteBiometricToken?.();
                            updateToggleUI(false, switchEl, knobEl);
                        } else {
                            // ENABLE: Trigger the scan and save
                            window
                                .enableTouchID()
                                .then(() => {
                                    console.log("TouchID scan complete ");
                                    const nowEnabled =
                                        window.AndroidBiometric.hasBiometricToken();
                                    updateToggleUI(
                                        nowEnabled,
                                        switchEl,
                                        knobEl
                                    );
                                })
                                .catch(() => {
                                    console.log("TouchID scan failed ");
                                });

                            // Re-check after a brief delay to see if user succeeded in scan
                            setTimeout(() => {
                                const nowEnabled =
                                    window.AndroidBiometric.hasBiometricToken();
                                updateToggleUI(nowEnabled, switchEl, knobEl);
                            }, 500);
                        }
                    };
                }
            }
        }

        // Helper function to keep UI code clean
        function updateToggleUI(isEnabled, switchEl, knobEl) {
            switchEl.setAttribute("aria-checked", isEnabled);
            if (isEnabled) {
                switchEl.style.backgroundColor = "#34C759"; // Green
                knobEl.style.left = "18px"; // Move knob right
            } else {
                switchEl.style.backgroundColor = "#d1d5db"; // Gray
                knobEl.style.left = "2px"; // Move knob left
            }
        }

        // GLOBAL FUNCTIONS (Android + React)
        window.enableTouchID = async function () {
            try {
                const response = await axios.post(
                    route("generateBioToken"),
                    {},
                    { withCredentials: true } // important for Laravel session
                );

                const token = response.data?.token;
                if (!token) {
                    console.log("Token not generated");
                    return;
                }
                if (response.data.success) {
                    if (window.AndroidBiometric) {
                        console.log(token);
                        window.AndroidBiometric.saveLoginToken(token);
                        // alert("Biometric login enabled!");
                        // location.reload();
                    }
                } else {
                    alert(response.data.message || "Biometric failed");
                }
            } catch (err) {
                console.error(
                    err.response?.data?.message ||
                        "Failed to enable biometric login"
                );
                alert("Failed to enable biometric login.");
            }
        };

        // Start biometric scan
        window.startBiometricLogin = function () {
            window.AndroidBiometric?.triggerBiometric();
        };

        // Called by Android after successful biometric scan
        // window.loginWithToken = async function (token) {
        //     try {
        //         const response = await axios.post(
        //             route("loginWithBioToken"),
        //             { token },
        //             { withCredentials: true }
        //         );

        //         if (response.data.success) {
        //             if (window.AndroidBiometric && response.data.new_token) {
        //                 window.AndroidBiometric.saveLoginToken(data.new_token);
        //             }
        //             window.location.href = "/home";
        //         } else {
        //             alert(response.data.message || "Biometric login failed");
        //         }
        //     } catch (err) {
        //         console.error(err.response?.data?.message || "Login failed");
        //         alert("Biometric login failed.");
        //     }
        // };

        //  Cleanup
        return () => {
            delete window.enableTouchID;
            delete window.startBiometricLogin;
            // delete window.loginWithToken;
        };
    }, []);

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <div className="bg-gray-50 font-sans min-h-screen flex flex-col items-center">
                <div className="w-full max-w-md bg-white shadow-2xl min-h-screen flex flex-col relative">
                    {/* Header is rendered by the page component itself (PageHeader) */}

                    {/*  Main content area (relative for spinner positioning) */}
                    <div className="flex-1 w-full overflow-y-auto pb-24 relative">
                        {children}

                        {/* Spinner overlay only inside content (below header) */}
                        {loading && (
                            <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-30">
                                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>
                </div>

                {/*  Fixed bottom navigation */}
                <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md h-16 bg-white border-t border-gray-200 shadow-lg flex items-center justify-around  text-xs z-[10000]">
                    <NavLink
                        name="home"
                        icon="fa-house"
                        label="Home"
                        active={isActive("home")}
                    />
                    <NavLink
                        name="profile"
                        icon="fa-user"
                        label="Profile"
                        active={isActive("profile")}
                    />
                    <NavLink
                        name="office"
                        icon="fa-building"
                        label="Office"
                        active={isActive("office")}
                    />
                    <NavLink
                        name="ledger.years"
                        icon="fa-book"
                        label="Ledger"
                        active={isActive("ledger.years")}
                    />
                    <NavLink
                        name="more"
                        icon="fa-ellipsis-h"
                        label="More"
                        active={isActive("more")}
                    />
                </nav>

                {/* Toast */}
                <Toast />
            </div>
        </>
    );
}

function NavLink({ name, icon, label, active }) {
    return (
        <Link
            href={route(name)}
            className={`flex flex-col items-center justify-center w-1/5 p-2 transition-colors ${
                active
                    ? "text-indigo-600 font-semibold"
                    : "text-gray-600 hover:text-indigo-600"
            }`}
        >
            <i className={`fa-solid ${icon} text-lg`}></i>
            <span className="mt-1">{label}</span>
        </Link>
    );
}
