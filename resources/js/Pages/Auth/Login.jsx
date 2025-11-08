import React from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, useForm, usePage } from "@inertiajs/react";

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

    const { errors: propsErrors } = usePage().props;
    const errors = Object.keys(formErrors).length ? formErrors : propsErrors;

    return (
        <GuestLayout title="Login">
            {/* Wrapper with fade effect while submitting */}
            <div
                className={`transition-opacity duration-300 ${
                    processing
                        ? "opacity-50 pointer-events-none"
                        : "opacity-100"
                }`}
            >
                <h1 className="text-2xl font-extrabold text-center text-indigo-700 mb-6">
                    Member Login
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">
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
                </form>

                <p className="text-center text-xs text-gray-500 mt-6">
                    © {new Date().getFullYear()} BPTCS. All rights reserved.
                </p>
            </div>
        </GuestLayout>
    );
}
