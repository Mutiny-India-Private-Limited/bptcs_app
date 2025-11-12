import React, { useState } from "react";
import { usePage, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";
const DEFAULT_IMAGE =
    "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170";

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("default", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(date);
};

export default function BlogList() {
    const { blogs } = usePage().props;

    return (
        <AppLayout title="All Blogs">
            <PageHeader
                title="All Blogs"
                subtitle="Discover our latest posts"
            />

            <div className="py-4 px-4 space-y-3">
                {blogs && blogs.length > 0 ? (
                    blogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)
                ) : (
                    <p className="text-gray-500 text-center py-10">
                        No blogs available.
                    </p>
                )}
            </div>
        </AppLayout>
    );
}

function BlogCard({ blog }) {
    const { base_url } = usePage().props;

    const [imgSrc, setImgSrc] = useState(
        blog.featured_image
            ? `${base_url}/storage/${blog.featured_image}`
            : DEFAULT_IMAGE
    );

    const handleError = () => {
        if (imgSrc !== DEFAULT_IMAGE) setImgSrc(DEFAULT_IMAGE);
    };

    return (
        <Link
            href={route("blog_details", blog.id)} // adjust route name as needed
            className="block bg-white shadow-sm rounded-lg p-2 hover:bg-gray-50 transition"
        >
            <div className="flex items-center space-x-3">
                {/* Thumbnail */}
                <div className="flex-shrink-0 w-24 h-20 rounded-md overflow-hidden">
                    <img
                        src={imgSrc}
                        alt={blog.heading}
                        onError={handleError}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Blog Info */}
                <div className="flex-1 min-w-0">
                    <h2 className="text-base font-semibold text-gray-900 truncate">
                        {blog.heading}
                    </h2>
                    {blog.sub_heading && (
                        <p className="text-sm text-gray-600 truncate">
                            {blog.sub_heading}
                        </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                        {blog.category} • {blog.author} •{" "}
                        {formatDate(blog.pub_date)}
                    </p>

                    {/* Read More link */}
                    <p className="mt-1 text-indigo-600 text-xs font-semibold">
                        Read More →
                    </p>
                </div>
            </div>
        </Link>
    );
}
