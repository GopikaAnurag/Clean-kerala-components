// src/components/StepByStepCarosel.js
import { useRef, useEffect, useState } from "react";
import { FaFileAlt, FaCheckCircle } from "react-icons/fa";
// Ensure this path is correct if you have global CSS
// If you're using Tailwind's no-scrollbar plugin, you might not need this line
// import "../App.css"; // Assuming this is not needed with Tailwind classes

const StepByStepCarousel = ({ steps, carouselSettings, title }) => {
  const carouselRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragged, setDragged] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [dimensions, setDimensions] = useState({
    slideWidth: carouselSettings.slideWidth,
    slideHeight: carouselSettings.slideHeight, // Initial value from settings
    fontScale: 1,
  });

  const SCROLL_SPEED = 7;

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
          slideHeight: (adjustedWidth * carouselSettings.slideHeight) / fullSlideWidth, // CORRECTED: Use carouselSettings.slideHeight for aspect ratio
          fontScale,
        });
      } else {
        setDimensions({
          slideWidth: fullSlideWidth,
          slideHeight: carouselSettings.slideHeight, // CORRECTED: Use carouselSettings.slideHeight
          fontScale: 1,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [carouselSettings]); // Depend on carouselSettings to re-run if they change

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

  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    const onWheel = (e) => {
      if (!isActive) return;
      const scrollAmount = (e.deltaX || e.deltaY) * SCROLL_SPEED;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) e.preventDefault();
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, [isActive]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!isActive) return;
      if (e.key === "ArrowLeft") {
        carouselRef.current.scrollBy({
          left: -carouselSettings.keyScrollSpeed,
          behavior: "smooth",
        });
      } else if (e.key === "ArrowRight") {
        carouselRef.current.scrollBy({
          left: carouselSettings.keyScrollSpeed,
          behavior: "smooth",
        });
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isActive, carouselSettings]);

  useEffect(() => {
    const container = carouselRef.current;
    const updateProgress = () => {
      const scrollLeft = container.scrollLeft;
      const scrollMax = container.scrollWidth - container.clientWidth;
      const percent = scrollMax > 0 ? (scrollLeft / scrollMax) * 100 : 0;
      setScrollProgress(percent);
    };

    container.addEventListener("scroll", updateProgress);
    return () => container.removeEventListener("scroll", updateProgress);
  }, []);

  const scrollLeft = () => {
    carouselRef.current.scrollBy({
      left: -dimensions.slideWidth,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    carouselRef.current.scrollBy({
      left: dimensions.slideWidth,
      behavior: "smooth",
    });
  };

  return (
    // This outer div will now have the responsive padding
    <div
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20" // Responsive padding applied here
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
            left: "0", // Adjusted from -1rem to 0 (relative to padded parent)
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
            right: "0", // Adjusted from -1rem to 0 (relative to padded parent)
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
          className="no-scrollbar" // Make sure this class is defined in your CSS or via Tailwind plugin
          style={{
            display: "flex",
            overflowX: "auto",
            scrollBehavior: "smooth",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            gap: "1rem",
            paddingBottom: "0.5rem",
            cursor: isDragging ? "grabbing" : "grab",
            // Padding for the scrollable content
            paddingLeft: "0", // No padding here, as outer div handles it
            paddingRight: "0" // No padding here
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
                padding: `${1 * dimensions.fontScale}rem`, // Applied fontScale here
                borderRadius: "1rem",
                boxShadow: "0 0 8px rgba(0,0,0,0.08)",
                display: "flex",
                flexDirection: "row",
                gap: `${0.75 * dimensions.fontScale}rem`, // Applied fontScale here
                alignItems: "flex-start",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: `${0.5 * dimensions.fontScale}rem`, // Scaled top position
                  right: `${0.5 * dimensions.fontScale}rem`, // Scaled right position
                  display: "flex",
                  alignItems: "center",
                  gap: `${0.4 * dimensions.fontScale}rem`, // Applied fontScale here
                  background: "#eef4ff",
                  padding: `${0.35 * dimensions.fontScale}rem ${0.6 * dimensions.fontScale}rem`, // Applied fontScale here
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
                    marginBottom: `${0.4 * dimensions.fontScale}rem`, // Apply fontScale here
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: `${0.9 * dimensions.fontScale}rem`,
                    color: step.descriptionColor,
                    marginBottom: `${0.4 * dimensions.fontScale}rem`, // Apply fontScale here
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
                      <FaCheckCircle style={{ marginRight: `${0.5 * dimensions.fontScale}rem` }} /> {/* Apply fontScale here */}
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
          maxWidth: `${700 * dimensions.fontScale}px`, // Adjusted for responsiveness
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