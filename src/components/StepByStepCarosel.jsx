// src/components/StepByStepCarosel.js
import { useRef, useEffect, useState, useCallback } from "react";
import { FaFileAlt, FaCheckCircle } from "react-icons/fa";

const StepByStepCarousel = ({ steps, carouselSettings, title }) => {
    const carouselRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragged, setDragged] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeftPos, setScrollLeftPos] = useState(0);

    // Renamed for clarity: 'isActive' to 'isHovered'
    const [isHovered, setIsHovered] = useState(false);
    // Ref to hold the latest hovered state for event listeners
    const isHoveredRef = useRef(isHovered);

    const [scrollProgress, setScrollProgress] = useState(0);
    const [dimensions, setDimensions] = useState({
        slideWidth: carouselSettings.slideWidth,
        slideHeight: carouselSettings.slideHeight,
        fontScale: 1,
    });

    const SCROLL_SPEED = 7;

    // --- Update isHoveredRef whenever isHovered state changes ---
    useEffect(() => {
        isHoveredRef.current = isHovered;
    }, [isHovered]);

    useEffect(() => {
        const updateDimensions = () => {
            const containerWidth = carouselRef.current?.offsetWidth || window.innerWidth;
            const fullSlideWidth = carouselSettings.slideWidth;
            const requiredWidth = fullSlideWidth * carouselSettings.minimumSlidesToShow;

            if (containerWidth < requiredWidth) {
                const adjustedWidth = containerWidth / carouselSettings.minimumSlidesToShow;
                const fontScale = adjustedWidth / fullSlideWidth;
                setDimensions({
                    slideWidth: adjustedWidth,
                    slideHeight: (adjustedWidth * carouselSettings.slideHeight) / fullSlideWidth,
                    fontScale,
                });
            } else {
                setDimensions({
                    slideWidth: fullSlideWidth,
                    slideHeight: carouselSettings.slideHeight,
                    fontScale: 1,
                });
            }
        };

        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, [carouselSettings]);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragged(false);
        setStartX(e.pageX);
        setScrollLeftPos(carouselRef.current.scrollLeft);
        document.body.style.userSelect = "none"; // prevent text/image selection
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const scrollDistance = e.pageX - startX;
        if (Math.abs(scrollDistance) > 5) setDragged(true);
        carouselRef.current.scrollLeft = scrollLeftPos - scrollDistance * carouselSettings.dragSpeed;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        document.body.style.userSelect = "auto"; // re-enable text/image selection
        setTimeout(() => setDragged(false), 100);
    };

    // 🧭 Scroll by WHEEL (only when hovered - using isHoveredRef)
    useEffect(() => {
        const container = carouselRef.current;
        if (!container) return;

        const onWheel = (e) => {
            if (isHoveredRef.current) { // Check ref here
                e.preventDefault(); // Crucial: Prevent default page scroll
                const scrollAmount = (e.deltaX || e.deltaY) * SCROLL_SPEED;
                container.scrollBy({ left: scrollAmount, behavior: "smooth" });
            }
        };

        // Attach listener to the container, not document, for wheel events
        container.addEventListener("wheel", onWheel, { passive: false });
        return () => container.removeEventListener("wheel", onWheel);
    }, [SCROLL_SPEED]); // Depend on SCROLL_SPEED, as isHovered is read from ref

    // ⌨️ Scroll by Arrow Keys (CRITICAL CHANGES HERE)
    useEffect(() => {
        const handleKey = (e) => {
            // Use the ref to get the latest value of isHovered
            if (isHoveredRef.current) {
                if (e.key === "ArrowLeft") {
                    e.preventDefault(); // IMPORTANT: Prevent default browser scroll
                    carouselRef.current.scrollBy({
                        left: -dimensions.slideWidth, // Use slideWidth for consistent scroll
                        behavior: "smooth",
                    });
                } else if (e.key === "ArrowRight") {
                    e.preventDefault(); // IMPORTANT: Prevent default browser scroll
                    carouselRef.current.scrollBy({
                        left: dimensions.slideWidth, // Use slideWidth for consistent scroll
                        behavior: "smooth",
                    });
                }
                // Optional but recommended: Prevent default for up/down arrows too
                // if they cause unwanted page scroll when this carousel is active.
                if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                    e.preventDefault();
                }
            }
        };

        // Attach event listener to the document in the CAPTURING phase
        // This ensures it runs before the default browser scroll behavior.
        document.addEventListener("keydown", handleKey, { capture: true });

        // Cleanup function: remove the listener when the component unmounts
        return () => {
            document.removeEventListener("keydown", handleKey, { capture: true });
        };
    }, [dimensions.slideWidth]); // Depend only on dimensions.slideWidth and `scroll` function if you had one in this component

    useEffect(() => {
        const container = carouselRef.current;
        if (!container) return; // Add null check for container
        const updateProgress = () => {
            const scrollLeft = container.scrollLeft;
            const scrollMax = container.scrollWidth - container.clientWidth;
            const percent = scrollMax > 0 ? (scrollLeft / scrollMax) * 100 : 0;
            setScrollProgress(percent);
        };

        container.addEventListener("scroll", updateProgress);
        return () => container.removeEventListener("scroll", updateProgress);
    }, []);

    const scrollLeft = useCallback(() => { // Memoize scroll functions with useCallback
        carouselRef.current.scrollBy({
            left: -dimensions.slideWidth,
            behavior: "smooth",
        });
    }, [dimensions.slideWidth]);

    const scrollRight = useCallback(() => { // Memoize scroll functions with useCallback
        carouselRef.current.scrollBy({
            left: dimensions.slideWidth,
            behavior: "smooth",
        });
    }, [dimensions.slideWidth]);


    return (
        <div
            onMouseEnter={() => setIsHovered(true)} // Now 'isHovered'
            onMouseLeave={() => setIsHovered(false)} // Now 'isHovered'
            className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20"
            style={{
                height: "100%",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
            }}
        >
            {title && (
                <h2
                    style={{
                        textAlign: "center",
                        fontSize: `${1.1 * dimensions.fontScale}rem`,
                        marginBottom: "0.3rem",
                        marginTop: 0,
                    }}
                >
                    {title}
                </h2>
            )}

            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <p
                    style={{
                        textTransform: "uppercase",
                        fontSize: `${0.8 * dimensions.fontScale}rem`,
                        color: "#2563eb",
                        fontWeight: 600,
                    }}
                >
                    SAUDI PCC ONLINE PROCESS
                </p>
                <h2
                    style={{
                        fontSize: `${1.5 * dimensions.fontScale}rem`,
                        fontWeight: "bold",
                        color: "#1e293b",
                        marginTop: "0.25rem",
                    }}
                >
                    Step-by-Step Process
                </h2>
            </div>

            <div style={{ position: "relative" }}>
                <button
                    onClick={scrollLeft}
                    style={{
                        position: "absolute",
                        top: "40%",
                        left: "0",
                        zIndex: 10,
                        fontSize: "2rem",
                        background: "transparent",
                        color: "#000",
                        border: "none",
                        cursor: "pointer",
                    }}
                    aria-label="Scroll Left"
                >
                    ‹
                </button>
                <button
                    onClick={scrollRight}
                    style={{
                        position: "absolute",
                        top: "40%",
                        right: "0",
                        zIndex: 10,
                        fontSize: "2rem",
                        background: "transparent",
                        color: "#000",
                        border: "none",
                        cursor: "pointer",
                    }}
                    aria-label="Scroll Right"
                >
                    ›
                </button>

                <div
                    ref={carouselRef}
                    className="no-scrollbar"
                    style={{
                        display: "flex",
                        overflowX: "auto",
                        scrollBehavior: "smooth",
                        scrollSnapType: "x mandatory",
                        WebkitOverflowScrolling: "touch",
                        gap: "1rem",
                        paddingBottom: "0.5rem",
                        cursor: isDragging ? "grabbing" : "grab",
                        paddingLeft: "0",
                        paddingRight: "0"
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            onClick={(e) => {
                                if (dragged) e.preventDefault();
                            }}
                            style={{
                                flex: "0 0 auto",
                                width: `${dimensions.slideWidth}px`,
                                height: `${dimensions.slideHeight}px`,
                                backgroundColor: step.slideBackgroundColor,
                                padding: `${1 * dimensions.fontScale}rem`,
                                borderRadius: "1rem",
                                boxShadow: "0 0 8px rgba(0,0,0,0.08)",
                                display: "flex",
                                flexDirection: "row",
                                gap: `${0.75 * dimensions.fontScale}rem`,
                                alignItems: "flex-start",
                                position: "relative",
                            }}
                        >
                            <div
                                style={{
                                    position: "absolute",
                                    top: `${0.5 * dimensions.fontScale}rem`,
                                    right: `${0.5 * dimensions.fontScale}rem`,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: `${0.4 * dimensions.fontScale}rem`,
                                    background: "#eef4ff",
                                    padding: `${0.35 * dimensions.fontScale}rem ${0.6 * dimensions.fontScale}rem`,
                                    borderRadius: "1rem",
                                    fontSize: `${0.75 * dimensions.fontScale}rem`,
                                    fontWeight: 600,
                                    color: "#2563eb",
                                }}
                            >
                                <FaFileAlt style={{ fontSize: `${1 * dimensions.fontScale}rem` }} />
                                <span>STEP {step.step.toString().padStart(2, "0")}</span>
                            </div>

                            <img
                                src={step.image}
                                alt={`Step ${step.step}`}
                                draggable={false}
                                style={{
                                    width: "40%",
                                    height: "100%",
                                    objectFit: "cover",
                                    borderRadius: "0.5rem",
                                }}
                            />
                            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                                <h3
                                    style={{
                                        fontSize: `${1.1 * dimensions.fontScale}rem`,
                                        fontWeight: "bold",
                                        color: step.titleColor,
                                        marginBottom: `${0.4 * dimensions.fontScale}rem`,
                                    }}
                                >
                                    {step.title}
                                </h3>
                                <p
                                    style={{
                                        fontSize: `${0.9 * dimensions.fontScale}rem`,
                                        color: step.descriptionColor,
                                        marginBottom: `${0.4 * dimensions.fontScale}rem`,
                                    }}
                                >
                                    {step.description}
                                </p>
                                <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                                    {step.checklist.map((item, i) => (
                                        <li
                                            key={i}
                                            style={{
                                                fontSize: `${0.85 * dimensions.fontScale}rem`,
                                                color: step.checklistColor,
                                                display: "flex",
                                                alignItems: "center",
                                                marginBottom: `${0.25 * dimensions.fontScale}rem`,
                                            }}
                                        >
                                            <FaCheckCircle style={{ marginRight: `${0.5 * dimensions.fontScale}rem` }} />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Progress Bar - Now Responsive */}
            <div
                style={{
                    width: "100%",
                    maxWidth: `${700 * dimensions.fontScale}px`,
                    margin: "1rem auto 0",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        height: "6px",
                        background: "#e2e8f0",
                        borderRadius: "4px",
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            width: `${scrollProgress}%`,
                            height: "100%",
                            background: "#2563eb",
                            transition: "width 0.3s ease",
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default StepByStepCarousel;