import React, { useState } from "react";
import { usePage, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";
import { router } from "@inertiajs/react";

const DEFAULT_IMAGE =
    "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170";

export default function BlogShow() {
    const { blog, base_url } = usePage().props;

    const [imgSrc, setImgSrc] = useState(
        blog.featured_image
            ? `${base_url}/storage/${blog.featured_image}`
            : DEFAULT_IMAGE
    );

    const handleError = () => {
        if (imgSrc !== DEFAULT_IMAGE) setImgSrc(DEFAULT_IMAGE);
    };

    return (
        <AppLayout title={blog.heading}>
            <PageHeader
                title="Blog Details"
                subtitle="Read the full story below"
            />

            <div className="max-w-3xl mx-auto px-4 py-6 bg-white shadow-sm rounded-lg">
                {/* Blog Header */}
                <div className="mb-4">
                    <Link
                        href={route("blogs")}
                        className="text-indigo-600 text-sm font-semibold hover:underline"
                    >
                        ← Back to Blogs
                    </Link>
                </div>

                {/* Blog Image */}
                <div className="rounded-lg overflow-hidden mb-4">
                    <img
                        src={imgSrc}
                        alt={blog.heading}
                        onError={handleError}
                        className="w-full h-56 sm:h-72 object-cover"
                    />
                </div>

                {/* Blog Meta */}
                <div className="flex flex-wrap items-center text-sm text-gray-500 mb-3">
                    <span className="font-medium text-indigo-600 mr-2">
                        {blog.category}
                    </span>
                    <span>• {blog.author}</span>
                    <span className="mx-2">•</span>
                    <span>
                        {new Date(blog.pub_date).toLocaleDateString("en-GB")}
                    </span>
                </div>

                {/* Blog Title */}
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                    {blog.heading}
                </h1>

                {/* Sub-heading */}
                {blog.sub_heading && (
                    <h2 className="text-lg text-gray-700 mb-4">
                        {blog.sub_heading}
                    </h2>
                )}

                {/* Blog Description (supports HTML) */}
                <div
                    className="prose prose-sm sm:prose-base max-w-none text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: blog.description }}
                />

                {/* Attachment Section */}
                {blog.attachment && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Attachment
                        </h3>

                        {/* File Name + View Button */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-100 p-3 rounded gap-2">
                            <span className="text-gray-700 text-sm break-all">
                                {blog.attachment.split("/").pop()}
                            </span>

                            <a
                                href={`${base_url}/storage/${blog.attachment}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 font-semibold text-sm hover:underline"
                            >
                                View
                            </a>
                        </div>

                        {/* Inline PDF Viewer */}
                        {blog.attachment.endsWith(".pdf") && (
                            <>
                                {/*
            The iframe now uses 'block' on all screen sizes (default is mobile first)
            instead of 'hidden sm:block'.
        */}
                                <iframe
                                    src={`https://docs.google.com/viewerng/viewer?url=${base_url}/storage/${blog.attachment}&embedded=true`}
                                    className="block w-full h-96 mt-4 border rounded"
                                    // The 'hidden sm:block' has been changed to 'block'
                                    // to ensure it shows on mobile (sm:hidden is the default for mobile)
                                />

                                {/* The original mobile 'View PDF' button (<a> tag) is now removed. */}
                            </>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="mt-8 border-t pt-4 text-sm text-gray-500 text-center">
                    Written by{" "}
                    <span className="font-medium">{blog.author}</span>
                </div>
            </div>
        </AppLayout>
    );
}
