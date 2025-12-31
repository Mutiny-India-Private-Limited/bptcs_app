import React, { useEffect } from "react";
import { Head, router, usePage } from "@inertiajs/react";

export default function GuestLayout({ children, ...meta }) {
    const title = meta.title || "BPTCS";

    useEffect(() => {
        //  Check if running inside Android App
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
            }
        }

        // Start biometric scan
        window.startBiometricLogin = function () {
            window.AndroidBiometric?.triggerBiometric();
        };

        // Called by Android after successful biometric scan
        window.loginWithToken = async function (token) {
            try {
                const response = await axios.post(
                    route("loginWithBioToken"),
                    { token },
                    { withCredentials: true }
                );

                if (response.data.success) {
                    // if (window.AndroidBiometric && response.data.new_token) {
                    //     window.AndroidBiometric.saveLoginToken(
                    //         response.data.new_token
                    //     );
                    // }
                    // window.location.href = "/home";
                    router.visit(route("home"));
                } else {
                    alert(response.data.message || "Biometric login failed");
                }
            } catch (err) {
                console.error(err.response?.data?.message || "Login failed");
                alert("Biometric login failed.");
            }
        };

        //  Cleanup
        return () => {
            delete window.enableTouchID;
            delete window.startBiometricLogin;
            delete window.loginWithToken;
        };
    }, []);

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <div className="bg-gray-50 font-sans min-h-screen flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md bg-white shadow-2xl rounded-xl overflow-hidden relative flex flex-col">
                    <div className="p-6">{children}</div>
                </div>
            </div>
        </>
    );
}
