import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import PageHeader from "@/Components/PageHeader";

export default function BlogForm({ blogData = null, category = [] }) {
    const { data, setData, post, put, errors } = useForm({
        category: blogData?.category || "",
        author: blogData?.author || "",
        pub_date: blogData?.pub_date || "",
        heading: blogData?.heading || "",
        sub_heading: blogData?.sub_heading || "",
        description: blogData?.description || "",
        featured_image: null,
    });

    const [preview, setPreview] = useState(
        blogData?.featured_image
            ? `/storage/blog/${blogData.featured_image}`
            : null
    );

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData("featured_image", file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(
                blogData?.featured_image
                    ? `/storage/blog/${blogData.featured_image}`
                    : null
            );
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (blogData) {
            put(route("blogUpdate", [blogData.id])); // update
        } else {
            post(route("blogStore")); // create
        }
    };

    return (
        <AppLayout title={blogData ? "Edit Blog" : "Add Blog"}>
            <PageHeader
                title={blogData ? "Edit Blog" : "Add Blog"}
                subtitle="Create or edit blog content"
            />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden">
                        <div className=" text-gray-900">
                            <form
                                onSubmit={handleSubmit}
                                encType="multipart/form-data"
                                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                            >
                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Category{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="category"
                                        value={data.category}
                                        onChange={(e) =>
                                            setData("category", e.target.value)
                                        }
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="">
                                            Select or create a category
                                        </option>
                                        {category.map((c, i) => (
                                            <option key={i} value={c.category}>
                                                {c.category}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && (
                                        <small className="text-red-600">
                                            {errors.category}
                                        </small>
                                    )}
                                </div>

                                {/* Author */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Author{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="author"
                                        value={data.author}
                                        onChange={(e) =>
                                            setData("author", e.target.value)
                                        }
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Enter author"
                                    />
                                    {errors.author && (
                                        <small className="text-red-600">
                                            {errors.author}
                                        </small>
                                    )}
                                </div>

                                {/* Publish Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Publish Date{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="pub_date"
                                        value={data.pub_date}
                                        onChange={(e) =>
                                            setData("pub_date", e.target.value)
                                        }
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.pub_date && (
                                        <small className="text-red-600">
                                            {errors.pub_date}
                                        </small>
                                    )}
                                </div>

                                {/* Heading */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Heading{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="heading"
                                        value={data.heading}
                                        onChange={(e) =>
                                            setData("heading", e.target.value)
                                        }
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Enter heading"
                                    />
                                    {errors.heading && (
                                        <small className="text-red-600">
                                            {errors.heading}
                                        </small>
                                    )}
                                </div>

                                {/* Sub Heading */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Sub Heading{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="sub_heading"
                                        value={data.sub_heading}
                                        onChange={(e) =>
                                            setData(
                                                "sub_heading",
                                                e.target.value
                                            )
                                        }
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Enter sub heading"
                                    />
                                    {errors.sub_heading && (
                                        <small className="text-red-600">
                                            {errors.sub_heading}
                                        </small>
                                    )}
                                </div>

                                {/* Featured Image */}
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Featured Image{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="file"
                                        name="featured_image"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    {errors.featured_image && (
                                        <small className="text-red-600">
                                            {errors.featured_image}
                                        </small>
                                    )}

                                    {preview && (
                                        <div className="mt-3 flex items-center gap-3">
                                            <div className="w-32 h-32 overflow-hidden rounded-md border shadow-sm flex items-center justify-center bg-gray-50">
                                                <img
                                                    src={preview}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPreview(null);
                                                    setData(
                                                        "featured_image",
                                                        null
                                                    );
                                                }}
                                                className="text-red-500 text-sm hover:underline"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Content{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        rows="6"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Enter content"
                                    ></textarea>
                                    {errors.description && (
                                        <small className="text-red-600">
                                            {errors.description}
                                        </small>
                                    )}
                                </div>

                                {/* Submit */}
                                <div className="sm:col-span-2 flex justify-end">
                                    <button
                                        type="submit"
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-semibold shadow-md w-full sm:w-auto"
                                    >
                                        {blogData ? "Update Blog" : "Add Blog"}
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
