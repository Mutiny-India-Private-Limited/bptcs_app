import React, { useState } from "react";
import { useForm, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";

export default function AddNotification({ userDevice = [] }) {
    const { data, setData, post, errors } = useForm({
        fcm_token: "all",
        title: "",
        actionUrl: "https://app.bptcspatna.com/public/notifications",
        image: null,
        body: "",
    });

    const [preview, setPreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData("image", file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("fireSendNotification"), {
            onSuccess: () => {
                // Clear all form fields
                setData({
                    fcm_token: "all",
                    title: "",
                    actionUrl:
                        "https://app.bptcspatna.com/public/notifications",
                    image: null,
                    body: "",
                });
                // Clear image preview
                setPreview(null);
            },
        });
    };

    return (
        <AppLayout title="Add Notification">
            {/* Header */}
            <PageHeader
                title="Add Notification"
                subtitle="Send a new push notification"
            />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden">
                        {/* Card Header */}

                        {/* Form */}
                        <div className="p-6 text-gray-900">
                            <form
                                onSubmit={handleSubmit}
                                encType="multipart/form-data"
                                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                            >
                                {/* User */}
                                <div>
                                    <label
                                        htmlFor="fcm_token"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        User
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="fcm_token"
                                        name="fcm_token"
                                        value={data.fcm_token}
                                        onChange={(e) =>
                                            setData("fcm_token", e.target.value)
                                        }
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="all">All</option>
                                        {userDevice.map((item, i) => (
                                            <option
                                                key={i}
                                                value={item.fcm_token}
                                            >
                                                {item.email_id}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.fcm_token && (
                                        <small className="text-red-600">
                                            {errors.fcm_token}
                                        </small>
                                    )}
                                </div>

                                {/* Title */}
                                <div>
                                    <label
                                        htmlFor="title"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Title
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData("title", e.target.value)
                                        }
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.title && (
                                        <small className="text-red-600">
                                            {errors.title}
                                        </small>
                                    )}
                                </div>

                                {/* Action URL */}
                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="actionUrl"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Action URL
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="actionUrl"
                                        name="actionUrl"
                                        value={data.actionUrl}
                                        onChange={(e) =>
                                            setData("actionUrl", e.target.value)
                                        }
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.actionUrl && (
                                        <small className="text-red-600">
                                            {errors.actionUrl}
                                        </small>
                                    )}
                                </div>

                                {/* Image */}
                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="image"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Image
                                    </label>
                                    <input
                                        type="file"
                                        id="image"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="mt-1 block w-full text-sm text-gray-700 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.image && (
                                        <small className="text-red-600">
                                            {errors.image}
                                        </small>
                                    )}

                                    {/* Smaller Image Preview */}
                                    {preview && (
                                        <div className="mt-3 flex items-center gap-3">
                                            <div className="w-24 h-18 overflow-hidden rounded-md border shadow-sm flex items-center justify-center bg-gray-50">
                                                <img
                                                    src={preview}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setPreview(null)}
                                                className="text-red-500 text-sm hover:underline"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="body"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Description
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="body"
                                        name="body"
                                        value={data.body}
                                        onChange={(e) =>
                                            setData("body", e.target.value)
                                        }
                                        rows="4"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    ></textarea>
                                    {errors.body && (
                                        <small className="text-red-600">
                                            {errors.body}
                                        </small>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div className="sm:col-span-2 flex justify-end">
                                    <button
                                        type="submit"
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-semibold shadow-md w-full sm:w-auto"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
