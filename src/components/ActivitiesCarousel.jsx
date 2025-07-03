// ActivitiesCarousel.jsx
import React, { useRef, useEffect, useState, useCallback } from "react";

const ActivitiesCarousel = ({ items, settings }) => {
    const containerRef = useRef(null);
    const scrollRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const [slideWidth, setSlideWidth] = useState(0);
    const [slideHeight, setSlideHeight] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [progressBarMaxWidth, setProgressBarMaxWidth] = useState('100%');
    const [currentSlideGap, setCurrentSlideGap] = useState(0);
    const [currentBorderRadius, setCurrentBorderRadius] = useState(0);
    const [currentSlidePadding, setCurrentSlidePadding] = useState(0);
    const [currentInternalGap, setCurrentInternalGap] = useState(0);
    const [currentButtonRadius, setCurrentButtonRadius] = useState(0);
    const [currentButtonFontSize, setCurrentButtonFontSize] = useState(0);
    const [currentButtonPaddingX, setCurrentButtonPaddingX] = useState(0);
    const [currentButtonPaddingY, setCurrentButtonPaddingY] = useState(0);
    const [carouselBottomGap, setCarouselBottomGap] = useState(0);
    // New state for responsive progress bar height
    const [currentProgressBarHeight, setCurrentProgressBarHeight] = useState(0);


    const BASE_SLIDE_WIDTH = settings.baseSlideWidth || 500;
    const BASE_SLIDE_HEIGHT = settings.baseSlideHeight || 250;

    const IMAGE_FLEX_BASIS_PERCENT = 40;
    const TEXT_FLEX_BASIS_PERCENT = 60;

    const IMAGE_FLEX_GROW = 0.5;
    const TEXT_FLEX_GROW = 1.5;
    const IMAGE_FLEX_SHRINK = 1;
    const TEXT_FLEX_SHRINK = 1;

    const BASE_BORDER_RADIUS = 20;
    const BASE_SLIDE_PADDING = 25;
    const BASE_BUTTON_RADIUS = 10;
    const BASE_SLIDE_GAP = 50;
    const BASE_INTERNAL_GAP = 20;

    const BASE_BUTTON_FONT_SIZE = 16;
    const BASE_BUTTON_PADDING_X = 16;
    const BASE_BUTTON_PADDING_Y = 8;

    const BASE_CAROUSEL_BOTTOM_GAP = 50; // Adjust this value as needed (e.g., 30px)
    // New base variable for progress bar height (e.g., 4px as h-1 is)
    const BASE_PROGRESS_BAR_HEIGHT = 5;


    const scroll = useCallback((dir) => {
        if (scrollRef.current) {
            const keyScrollAmount = settings.keyScrollSpeed ?? slideWidth;
            scrollRef.current.scrollBy({
                left: dir === "left" ? -keyScrollAmount : keyScrollAmount,
                behavior: "smooth",
            });
        }
    }, [slideWidth, settings.keyScrollSpeed]);

    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const windowWidth = window.innerWidth;

                let slidesToDisplay;
                let slideWidthRatio;
                let calculatedSlideWidth;
                let calculatedSlideGap;

                // Define desired slidesToDisplay based on screen size
                if (windowWidth >= 1024) { // PC views (lg breakpoint and up)
                    slidesToDisplay = 2.8;
                } else { // Mobile/Tablet views (below lg breakpoint)
                    slidesToDisplay = 1.8;
                }

                // Calculate slideWidth based on slidesToDisplay and containerWidth
                const assumedGapRatio = BASE_SLIDE_GAP / BASE_SLIDE_WIDTH;
                calculatedSlideWidth = (containerWidth) / (slidesToDisplay + (slidesToDisplay - 1) * assumedGapRatio);
                calculatedSlideGap = calculatedSlideWidth * assumedGapRatio;


                // Ensure a minimum slide width to prevent elements from becoming too small
                const MIN_ALLOWED_SLIDE_WIDTH = 250;
                if (calculatedSlideWidth < MIN_ALLOWED_SLIDE_WIDTH) {
                    calculatedSlideWidth = MIN_ALLOWED_SLIDE_WIDTH;
                    calculatedSlideGap = MIN_ALLOWED_SLIDE_WIDTH * assumedGapRatio;
                }

                // Now calculate the scale ratio based on the *final* calculated slide width
                slideWidthRatio = calculatedSlideWidth / BASE_SLIDE_WIDTH;

                // Set all other dimensions proportionally using slideWidthRatio
                const calculatedBorderRadius = BASE_BORDER_RADIUS * slideWidthRatio;
                const calculatedSlidePadding = BASE_SLIDE_PADDING * slideWidthRatio;
                const calculatedInternalGap = BASE_INTERNAL_GAP * slideWidthRatio;
                const calculatedButtonRadius = BASE_BUTTON_RADIUS * slideWidthRatio;

                // Calculate responsive button font size and padding
                const calculatedButtonFontSize = BASE_BUTTON_FONT_SIZE * slideWidthRatio;
                const calculatedButtonPaddingX = BASE_BUTTON_PADDING_X * slideWidthRatio;
                const calculatedButtonPaddingY = BASE_BUTTON_PADDING_Y * slideWidthRatio;

                // Calculate the new carousel bottom gap
                const calculatedCarouselBottomGap = BASE_CAROUSEL_BOTTOM_GAP * slideWidthRatio;

                // Calculate responsive progress bar height
                const calculatedProgressBarHeight = BASE_PROGRESS_BAR_HEIGHT * slideWidthRatio;


                setSlideWidth(calculatedSlideWidth);
                setSlideHeight(calculatedSlideWidth / (BASE_SLIDE_WIDTH / BASE_SLIDE_HEIGHT)); // Maintain aspect ratio
                setCurrentSlideGap(calculatedSlideGap);
                setCurrentBorderRadius(calculatedBorderRadius);
                setCurrentSlidePadding(calculatedSlidePadding);
                setCurrentInternalGap(calculatedInternalGap);
                setCurrentButtonRadius(calculatedButtonRadius);
                setCurrentButtonFontSize(calculatedButtonFontSize);
                setCurrentButtonPaddingX(calculatedButtonPaddingX);
                setCurrentButtonPaddingY(calculatedButtonPaddingY);
                setCarouselBottomGap(calculatedCarouselBottomGap);
                setCurrentProgressBarHeight(calculatedProgressBarHeight); // Set the new state


                setProgressBarMaxWidth('100%');
            }
        };

        const debounce = (func, delay) => {
            let timeout;
            return function executed(...args) {
                const context = this;
                const later = () => {
                    timeout = null;
                    func.apply(context, args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, delay);
            };
        };

        const debouncedUpdateSize = debounce(updateSize, 100);

        updateSize();
        window.addEventListener("resize", debouncedUpdateSize);
        return () => window.removeEventListener("resize", debouncedUpdateSize);
    }, [
        BASE_SLIDE_WIDTH,
        BASE_SLIDE_HEIGHT,
        BASE_SLIDE_GAP,
        BASE_BUTTON_FONT_SIZE,
        BASE_BUTTON_PADDING_X,
        BASE_BUTTON_PADDING_Y,
        BASE_CAROUSEL_BOTTOM_GAP,
        BASE_PROGRESS_BAR_HEIGHT, // Add new base variable to dependency array
        settings.baseSlideWidth,
        settings.baseSlideHeight
    ]);


    useEffect(() => {
        const ref = scrollRef.current;
        if (!ref) return;

        const handleScroll = () => {
            const maxScroll = ref.scrollWidth - ref.clientWidth;
            const percentage = maxScroll > 0 ? (ref.scrollLeft / maxScroll) * 100 : 0;
            setProgress(percentage);
        };

        ref.addEventListener("scroll", handleScroll);
        return () => ref.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const slider = scrollRef.current;
        if (!slider) return;

        const handleMouseDown = (e) => {
            setIsDragging(true);
            setStartX(e.pageX - slider.offsetLeft);
            setScrollLeft(slider.scrollLeft);
            slider.classList.add("select-none");
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            slider.classList.remove("select-none");
        };

        const handleMouseMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const dragSpeed = settings.dragSpeed ?? 0.85;
            const walk = (x - startX) * dragSpeed;
            slider.scrollLeft = scrollLeft - walk;
        };

        slider.addEventListener("mousedown", handleMouseDown);
        slider.addEventListener("mouseleave", handleMouseUp);
        slider.addEventListener("mouseup", handleMouseUp);
        slider.addEventListener("mousemove", handleMouseMove);

        return () => {
            slider.removeEventListener("mousedown", handleMouseDown);
            slider.removeEventListener("mouseleave", handleMouseUp);
            slider.removeEventListener("mouseup", handleMouseUp);
            slider.removeEventListener("mousemove", handleMouseMove);
        };
    }, [isDragging, startX, scrollLeft, settings.dragSpeed]);

    useEffect(() => {
        const slider = scrollRef.current;
        if (!slider || !isActive) return;

        const handleWheel = (e) => {
            e.preventDefault();
            const scrollAmount = e.deltaY || e.deltaX;
            const scrollSpeed = settings.scrollSpeed ?? 0.3;
            slider.scrollBy({ left: scrollAmount * scrollSpeed, behavior: "smooth" });
        };

        slider.addEventListener("wheel", handleWheel, { passive: false });
        return () => slider.removeEventListener("wheel", handleWheel);
    }, [isActive, settings.scrollSpeed]);

    useEffect(() => {
        if (!isActive) return;

        const handleKeyDown = (e) => {
            if (e.key === "ArrowLeft") scroll("left");
            if (e.key === "ArrowRight") scroll("right");
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isActive, scroll]);

    return (
        <section
            ref={containerRef}
            onMouseEnter={() => setIsActive(true)}
            onMouseLeave={() => setIsActive(false)}
            className="w-full relative overflow-visible bg-[#f0fdf4] py-3 outline-none"
        >
            <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
                <h2
                    className="font-bold text-gray-800 mb-5 text-center
                                text-xl sm:text-2xl md:text-3xl lg:text-4xl"
                >
                    Activities at a Glance
                </h2>

                {/* Arrows */}
                <div
                    onClick={() => scroll("left")}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 font-bold text-gray-400 hover:text-black cursor-pointer
                                text-lg sm:text-xl md:text-2xl"
                >
                    &lt;
                </div>
                <div
                    onClick={() => scroll("right")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 font-bold text-gray-400 hover:text-black cursor-pointer
                                text-lg sm:text-xl md:text-2xl"
                >
                    &gt;
                </div>

                {/* Carousel Track */}
                <div
                    ref={scrollRef}
                    className="cursor-grab active:cursor-grabbing overflow-x-auto scroll-smooth no-scrollbar"
                    style={{ scrollSnapType: "x mandatory" }}
                >
                    <div
                        className="flex w-max select-none"
                        style={{
                            gap: `${currentSlideGap}px`,
                            paddingLeft: `${currentSlideGap}px`,
                            paddingRight: `${currentSlideGap}px`,
                            transition: 'gap 0.3s ease-out, padding 0.3s ease-out',
                        }}
                    >
                        {items.map((item, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 shadow-md overflow-hidden"
                                style={{
                                    width: `${slideWidth}px`,
                                    height: `${slideHeight}px`,
                                    scrollSnapAlign: "start",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    backgroundColor: item.bgColor || "#E6F4EA",
                                    borderRadius: `${currentBorderRadius}px`,
                                    padding: `${currentSlidePadding}px`,
                                    gap: `${currentInternalGap}px`,
                                    transition: 'width 0.3s ease-out, height 0.3s ease-out, border-radius 0.3s ease-out, padding 0.3s ease-out, gap 0.3s ease-out',
                                }}
                            >
                                {/* Left Section: Image/Icon */}
                                <div
                                    className="flex items-center justify-center flex-shrink-0"
                                    style={{
                                        flexBasis: `${IMAGE_FLEX_BASIS_PERCENT}%`,
                                        flexGrow: IMAGE_FLEX_GROW,
                                        flexShrink: IMAGE_FLEX_SHRINK,
                                        height: '100%',
                                        position: 'relative',
                                        maxWidth: `${slideWidth * (IMAGE_FLEX_BASIS_PERCENT / 100) * 1.2}px`,
                                        minWidth: `${slideWidth * (IMAGE_FLEX_BASIS_PERCENT / 100) * 0.5}px`,
                                        transition: 'max-width 0.3s ease-out, min-width 0.3s ease-out',
                                    }}
                                >
                                    {item.type === "circle-icon" ? (
                                        <div
                                            className="rounded-full overflow-hidden flex items-center justify-center"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                backgroundColor: item.circleBgColor || "transparent",
                                            }}
                                        >
                                            <img
                                                src={item.image}
                                                alt={item.label || item.topRightText}
                                                className="object-contain"
                                                style={{
                                                    maxWidth: '100%',
                                                    maxHeight: '100%',
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <img
                                            src={item.image}
                                            alt={item.label || item.topRightText}
                                            className="w-full h-full object-cover"
                                            style={{
                                                borderRadius: `${currentBorderRadius * 0.75}px`,
                                                transition: 'border-radius 0.3s ease-out',
                                            }}
                                        />
                                    )}
                                </div>

                                {/* Right Section: Text Content */}
                                <div
                                    className="flex flex-col justify-center items-start overflow-hidden"
                                    style={{
                                        flexBasis: `${TEXT_FLEX_BASIS_PERCENT}%`,
                                        flexGrow: TEXT_FLEX_GROW,
                                        flexShrink: TEXT_FLEX_SHRINK,
                                        height: '100%',
                                        minWidth: 0,
                                    }}
                                >
                                    {item.topRightText && (
                                        <div
                                            className="flex items-center flex-wrap"
                                            style={{
                                                marginBottom: `${currentInternalGap * 0.25}px`,
                                                minWidth: 0,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: `${10 * (currentInternalGap / BASE_INTERNAL_GAP)}px`,
                                                    height: `${10 * (currentInternalGap / BASE_INTERNAL_GAP)}px`,
                                                    borderRadius: '50%',
                                                    backgroundColor: item.topRightDotColor || '#2563EB',
                                                    marginRight: `${5 * (currentInternalGap / BASE_INTERNAL_GAP)}px`,
                                                    flexShrink: 0,
                                                    transition: 'width 0.3s ease-out, height 0.3s ease-out, margin-right 0.3s ease-out',
                                                }}
                                            ></div>
                                            <p
                                                className="font-semibold"
                                                style={{
                                                    fontSize: `${currentButtonFontSize * 0.8}px`,
                                                    color: item.topRightTextColor || '#374151',
                                                    lineHeight: 1.2,
                                                    wordBreak: 'break-word',
                                                    flexGrow: 1,
                                                    minWidth: 0,
                                                    transition: 'font-size 0.3s ease-out',
                                                }}
                                            >
                                                {item.topRightText}
                                            </p>
                                        </div>
                                    )}

                                    {item.value && (
                                        <p
                                            className="font-bold"
                                            style={{
                                                fontSize: `${currentButtonFontSize * 1.2}px`,
                                                color: item.valueColor || "#000",
                                                lineHeight: 1.2,
                                                wordBreak: 'break-word',
                                                transition: 'font-size 0.3s ease-out',
                                            }}
                                        >
                                            {item.value}
                                        </p>
                                    )}
                                    {item.label && (
                                        <p
                                            className=""
                                            style={{
                                                fontSize: `${currentButtonFontSize * 0.9}px`,
                                                color: item.labelColor || "#666B8A",
                                                marginTop: `${currentInternalGap * 0.25}px`,
                                                lineHeight: 1.2,
                                                wordBreak: 'break-word',
                                                transition: 'font-size 0.3s ease-out',
                                            }}
                                        >
                                            {item.label}
                                        </p>
                                    )}
                                    {item.showKnowMoreButton && (
                                        <button
                                            className="bg-green-600 text-white mt-2 rounded hover:bg-green-700 transition"
                                            style={{
                                                borderRadius: `${currentButtonRadius}px`,
                                                fontWeight: 600,
                                                minWidth: `${BASE_BUTTON_RADIUS * 8}px`,
                                                fontSize: `${currentButtonFontSize}px`,
                                                padding: `${currentButtonPaddingY}px ${currentButtonPaddingX}px`,
                                                transition: 'border-radius 0.3s ease-out, min-width 0.3s ease-out, font-size 0.3s ease-out, padding 0.3s ease-out',
                                            }}
                                        >
                                            Know More
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Progress Bar Container */}
                <div
                    className="bg-gray-200 rounded mx-auto" // Removed fixed h-1 here
                    style={{
                        width: "100%",
                        maxWidth: progressBarMaxWidth,
                        marginTop: `${carouselBottomGap}px`,
                        height: `${currentProgressBarHeight}px`, // Apply responsive height
                        transition: 'max-width 0.3s ease-out, margin-top 0.3s ease-out, height 0.3s ease-out', // Add height to transition
                    }}
                >
                    {/* Progress Bar Fill */}
                    <div
                        className="bg-green-700 rounded" // Removed fixed h-1 here
                        style={{
                            width: `${progress}%`,
                            height: '100%', // Make inner div take full height of its responsive parent
                            transition: "width 0.3s ease",
                        }}
                    ></div>
                </div>
            </div>
        </section>
    );
};

export default ActivitiesCarousel;