import { useEffect } from "react";

export default function GlobalImagePreview() {
    useEffect(() => {
        const handleClick = (e) => {
            const img = e.target.closest(".global-preview-image");
            const overlay = document.getElementById("global-image-overlay");
            const preview = document.getElementById("global-image-preview");

            if (img && overlay && preview) {
                preview.src = img.src;
                overlay.classList.remove("hidden");
            }

            if (
                e.target.id === "global-image-overlay" ||
                e.target.id === "global-image-close"
            ) {
                closeOverlay();
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                closeOverlay();
            }
        };

        const closeOverlay = () => {
            const overlay = document.getElementById("global-image-overlay");
            const preview = document.getElementById("global-image-preview");

            if (overlay && preview) {
                overlay.classList.add("hidden");
                preview.src = "";
            }
        };

        document.addEventListener("click", handleClick);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("click", handleClick);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <div
            id="global-image-overlay"
            className="hidden fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
        >
            <button
                id="global-image-close"
                className="absolute top-4 right-4 text-white text-3xl font-bold hover:opacity-80"
            >
                ×
            </button>

            <img
                id="global-image-preview"
                src=""
                alt="Preview"
                className="max-w-[90%] max-h-[90%] rounded shadow-lg"
            />
        </div>
    );
}
