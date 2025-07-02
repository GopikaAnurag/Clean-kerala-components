// src/components/ProjectsCarousel.js
import React, { useRef, useEffect, useState } from "react";

const ProjectsCarousel = ({ projects, settings }) => {
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
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
    const updateWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const slideW = containerWidth / 3.8;
        setSlideWidth(slideW);
        const scale = slideW / (settings.originalSlideWidth || 300);
        setFontScale(scale);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [settings.originalSlideWidth]);

  useEffect(() => {
    const ref = scrollRef.current;
    const handleScroll = () => {
      const maxScroll = ref.scrollWidth - ref.clientWidth;
      const percent = (ref.scrollLeft / maxScroll) * 100;
      setProgress(percent);
    };
    ref?.addEventListener("scroll", handleScroll);
    return () => ref?.removeEventListener("scroll", handleScroll);
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
      const walk = (x - startX) * 1.5;
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
  }, [isDragging, startX, scrollLeft]);

  // 🧭 Scroll by WHEEL (only when hovered)
  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider || !isActive) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const scrollAmount = e.deltaY || e.deltaX;
      slider.scrollBy({ left: scrollAmount, behavior: "smooth" });
    };

    slider.addEventListener("wheel", handleWheel, { passive: false });
    return () => slider.removeEventListener("wheel", handleWheel);
  }, [isActive]);

  // ⌨️ Scroll by Arrow Keys (only when hovered)
  useEffect(() => {
    if (!isActive) return;

    const handleKey = (e) => {
      if (e.key === "ArrowLeft") scroll("left");
      else if (e.key === "ArrowRight") scroll("right");
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isActive, slideWidth]);

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
                  scrollSnapAlign: "start",
                  backgroundColor: project.bgColor || "#f0f0f0",
                }}
              >
                <div className="aspect-[3/4] w-full">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-opacity duration-300 rounded-2xl pointer-events-none"
                    onError={(e) => {
                      e.target.style.opacity = 0.1;
                    }}
                  />
                </div>
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

        <div className="h-1 bg-gray-200 mt-3 rounded">
          <div
            className="h-1 bg-green-700 rounded"
            style={{ width: `${progress}%`, transition: "width 0.3s ease" }}
          ></div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsCarousel;