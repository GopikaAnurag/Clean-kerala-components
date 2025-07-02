// src/components/ProjectsCarousel.js
import React, { useRef, useEffect, useState } from "react";

const ProjectsCarousel = ({ projects, settings }) => {
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const [slideHeight, setSlideHeight] = useState(0); // Added slideHeight state
  const [fontScale, setFontScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isActive, setIsActive] = useState(false); // 👈 Hover-active control

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "left" ? -slideWidth : slideWidth,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    // Renamed to updateDimensions for clarity, as it now handles more than just width
    const updateDimensions = () => {
      if (containerRef.current && settings) {
        const containerWidth = containerRef.current.offsetWidth;

        // Use settings.slideWidth and settings.slideHeight from the provided settings
        const baseSlideWidth = settings.slideWidth || 300; // Fallback if not provided
        const baseSlideHeight = settings.slideHeight || 400; // Fallback if not provided
        const minimumSlidesToShow = settings.minimumSlidesToShow || 3.8; // Use 3.8 as current default

        const requiredWidthForIdealDisplay = baseSlideWidth * minimumSlidesToShow;

        let adjustedSlideWidth;
        let calculatedFontScale;

        if (containerWidth < requiredWidthForIdealDisplay) {
          adjustedSlideWidth = containerWidth / minimumSlidesToShow;
          calculatedFontScale = adjustedSlideWidth / baseSlideWidth;
        } else {
          adjustedSlideWidth = baseSlideWidth;
          calculatedFontScale = 1;
        }

        // Optional: Set a minimum font scale to prevent text from becoming unreadable
        const MIN_FONT_SCALE = 0.7;
        if (calculatedFontScale < MIN_FONT_SCALE) {
          calculatedFontScale = MIN_FONT_SCALE;
        }

        setSlideWidth(adjustedSlideWidth);
        // Calculate slideHeight to maintain aspect ratio based on adjustedSlideWidth
        setSlideHeight(adjustedSlideWidth * (baseSlideHeight / baseSlideWidth));
        setFontScale(calculatedFontScale);
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [settings.slideWidth, settings.slideHeight, settings.minimumSlidesToShow]); // Depend on relevant settings properties

  useEffect(() => {
    const ref = scrollRef.current;
    if (!ref) return; // Ensure ref is not null

    const handleScroll = () => {
      const maxScroll = ref.scrollWidth - ref.clientWidth;
      // Prevent division by zero if scrollable area is not large enough
      const percent = maxScroll > 0 ? (ref.scrollLeft / maxScroll) * 100 : 0;
      setProgress(percent);
    };
    ref.addEventListener("scroll", handleScroll);
    return () => ref.removeEventListener("scroll", handleScroll);
  }, []);

  // 🖱️ Mouse Drag Scroll
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
      // Use dragSpeed from settings if available, fallback to 1.5
      const dragSpeed = settings.dragSpeed !== undefined ? settings.dragSpeed : 1.5;
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
  }, [isDragging, startX, scrollLeft, settings.dragSpeed]); // Added dragSpeed dependency

  // 🧭 Scroll by WHEEL (only when hovered)
  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider || !isActive) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const scrollAmount = e.deltaY || e.deltaX;
      // Use scrollSpeed from settings if available, fallback to 1
      const scrollSpeed = settings.scrollSpeed !== undefined ? settings.scrollSpeed : 1;
      slider.scrollBy({ left: scrollAmount * scrollSpeed, behavior: "smooth" });
    };

    slider.addEventListener("wheel", handleWheel, { passive: false });
    return () => slider.removeEventListener("wheel", handleWheel);
  }, [isActive, settings.scrollSpeed]); // Added scrollSpeed dependency

  // ⌨️ Scroll by Arrow Keys (only when hovered)
  useEffect(() => {
    if (!isActive) return;

    const handleKey = (e) => {
      // Use keyScrollSpeed if available, fallback to slideWidth
      const keyScrollAmount = settings.keyScrollSpeed !== undefined ? settings.keyScrollSpeed : slideWidth;
      if (e.key === "ArrowLeft") scrollRef.current.scrollBy({ left: -keyScrollAmount, behavior: "smooth" });
      else if (e.key === "ArrowRight") scrollRef.current.scrollBy({ left: keyScrollAmount, behavior: "smooth" });
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isActive, slideWidth, settings.keyScrollSpeed]); // Added keyScrollSpeed dependency

  return (
    <section
      ref={containerRef}
      className="w-full relative bg-[#f0fdf4] py-6 overflow-visible"
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
    >
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <h2
          className="font-bold text-gray-800 mb-6 text-center"
          style={{ fontSize: `${1.0 * fontScale}rem` }}
        >
          OUR PROJECTS
        </h2>

        {/* Arrows are still positioned relative to the outer padded container */}
        <div
          onClick={() => scroll("left")}
          className="absolute left-4 md:left-4 top-1/2 -translate-y-1/2 z-10 text-gray-400 hover:text-black cursor-pointer select-none"
          style={{ fontSize: `${1.0 * fontScale}rem`, fontWeight: 700 }}
        >
          &lt;
        </div>

        <div
          onClick={() => scroll("right")}
          className="absolute right-4 md:right-4 top-1/2 -translate-y-1/2 z-10 text-gray-400 hover:text-black cursor-pointer select-none"
          style={{ fontSize: `${1.0 * fontScale}rem`, fontWeight: 700 }}
        >
          &gt;
        </div>

        <div
          ref={scrollRef}
          className="cursor-grab active:cursor-grabbing overflow-x-auto overflow-visible scroll-smooth no-scrollbar"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {/* Increased padding here */}
          <div className="flex gap-6 w-max pl-8 sm:pl-10 md:pl-12 lg:pl-16 xl:pl-20 2xl:pl-24 pr-8 sm:pr-10 md:pr-12 lg:pr-16 xl:pr-20 2xl:pr-24">
            {projects.map((project, index) => (
              <div
                key={index}
                className="relative flex-shrink-0 rounded-xl overflow-hidden shadow-md select-none"
                style={{
                  width: `${slideWidth}px`,
                  height: `${slideHeight}px`, // Apply dynamic height here
                  scrollSnapAlign: "start",
                  backgroundColor: project.bgColor || "#f0f0f0",
                }}
              >
                {/* Removed aspect-[3/4] as height is now dynamic from slideHeight */}
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-opacity duration-300 rounded-2xl pointer-events-none"
                  onError={(e) => {
                    e.target.style.opacity = 0.1;
                  }}
                />
                <div
                  className={`absolute inset-0 bg-opacity-40 flex ${
                    index % 2 === 0 ? "items-end" : "items-start"
                  } p-2 md:p-3`}
                >
                  <h3
                    className="text-white font-semibold text-center w-full"
                    style={{ fontSize: `${0.9 * fontScale}rem` }}
                  >
                    {project.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Bar - Now Responsive and Centered */}
        <div
          style={{
            width: "100%", // Takes full width of its parent (which has padding)
            // Calculate maxWidth based on the scaled slide width and number of slides displayed
            maxWidth: `${slideWidth * (settings.minimumSlidesToShow || 3.8) * 0.9}px`, // Example: 90% of the visual slide width
            margin: "1rem auto 0", // Centers the progress bar horizontally
          }}
        >
          <div className="h-1 bg-gray-200 mt-3 rounded">
            <div
              className="h-1 bg-green-700 rounded"
              style={{ width: `${progress}%`, transition: "width 0.3s ease" }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsCarousel;