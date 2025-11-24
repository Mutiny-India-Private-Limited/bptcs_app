import React from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Link, usePage } from "@inertiajs/react";

export default function PrivacyPolicy() {
    const { base_url } = usePage().props; // Get base URL for images

    return (
        <GuestLayout title="Privacy Policy">
            <div className="max-w-3xl mx-auto p-6 space-y-4 text-gray-700">
                {/* Top Image / Logo */}
                <div className="flex justify-center ">
                    <img
                        src={`${base_url}/assets/images/logo.png`} // Replace with your logo path
                        alt="BPTCS Logo"
                        className="h-20 w-auto"
                    />
                </div>

                <h1 className="text-3xl font-bold text-indigo-700 text-center">
                    Privacy Policy
                </h1>

                <p>
                    At BPTCS, we value your privacy and are committed to
                    protecting your personal information. This Privacy Policy
                    outlines the types of information we collect, how we use it,
                    and your rights regarding your data.
                </p>

                <h2 className="text-xl font-semibold text-indigo-600 mt-4">
                    1. Information We Collect
                </h2>
                <p>
                    We may collect personal information such as your name,
                    mobile number, member ID, and any other information you
                    provide when using our services.
                </p>

                <h2 className="text-xl font-semibold text-indigo-600 mt-4">
                    2. How We Use Your Information
                </h2>
                <p>
                    Your information is used to provide our services, verify
                    your identity, communicate with you, and improve your
                    experience on our platform.
                </p>

                <h2 className="text-xl font-semibold text-indigo-600 mt-4">
                    3. Data Security
                </h2>
                <p>
                    We implement appropriate technical and organizational
                    measures to protect your personal data from unauthorized
                    access, alteration, disclosure, or destruction.
                </p>

                <h2 className="text-xl font-semibold text-indigo-600 mt-4">
                    4. Sharing Your Information
                </h2>
                <p>
                    We do not sell, trade, or otherwise transfer your personal
                    information to outside parties except as required by law or
                    with your explicit consent.
                </p>

                <h2 className="text-xl font-semibold text-indigo-600 mt-4">
                    5. Your Rights
                </h2>
                <p>
                    You have the right to access, correct, or delete your
                    personal information. You may also withdraw your consent to
                    our processing of your data at any time.
                </p>

                <h2 className="text-xl font-semibold text-indigo-600 mt-4">
                    6. Changes to This Policy
                </h2>
                <p>
                    We may update this Privacy Policy from time to time. Any
                    changes will be posted on this page with an updated revision
                    date.
                </p>

                {/* Footer */}
                <div className="mt-6 text-center space-y-2">
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} BPTCS. All rights reserved.
                    </p>
                    <Link
                        href={route("login")}
                        className="text-sm text-indigo-600 hover:underline"
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}
