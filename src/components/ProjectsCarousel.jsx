import React, { useRef, useEffect, useState } from "react";

const ProjectsCarousel = ({ projects, settings }) => {
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    const ref = scrollRef.current;
    const handleScroll = () => {
      const maxScroll = ref.scrollWidth - ref.clientWidth;
      const percent = (ref.scrollLeft / maxScroll) * 100;
      setProgress(percent);
    };
    if (ref) ref.addEventListener("scroll", handleScroll);
    return () => {
      if (ref) ref.removeEventListener("scroll", handleScroll);
    };
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

    const handleMouseLeave = () => {
      setIsDragging(false);
      slider.classList.remove("select-none");
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
    slider.addEventListener("mouseleave", handleMouseLeave);
    slider.addEventListener("mouseup", handleMouseUp);
    slider.addEventListener("mousemove", handleMouseMove);

    return () => {
      slider.removeEventListener("mousedown", handleMouseDown);
      slider.removeEventListener("mouseleave", handleMouseLeave);
      slider.removeEventListener("mouseup", handleMouseUp);
      slider.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDragging, startX, scrollLeft]);

  return (
    <section
      ref={containerRef}
      className="w-full relative bg-[#f0fdf4] py-6 px-4 md:px-20 overflow-visible"
    >
      <h2 className="text-sm sm:text-base md:text-xl lg:text-xl font-bold text-gray-800 mb-6 text-center">
        OUR PROJECTS
      </h2>

      <div
        onClick={() => scroll("left")}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 
                   text-xs sm:text-sm md:text-base lg:text-lg 
                   font-bold text-gray-400 hover:text-black 
                   cursor-pointer select-none"
      >
        &lt;
      </div>

      <div
        onClick={() => scroll("right")}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 
                   text-xs sm:text-sm md:text-base lg:text-lg 
                   font-bold text-gray-400 hover:text-black 
                   cursor-pointer select-none"
      >
        &gt;
      </div>

      <div
        ref={scrollRef}
        className="cursor-grab active:cursor-grabbing overflow-x-auto overflow-visible scroll-smooth no-scrollbar px-1 md:px-4"
        style={{ scrollSnapType: "x mandatory" }}
      >
        <div className="flex gap-4 w-max">
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
                <h3 className="text-white text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-semibold text-center w-full">
                  {project.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-1 bg-gray-200 mt-3 mx-8 rounded">
        <div
          className="h-1 bg-green-700 rounded"
          style={{ width: `${progress}%`, transition: "width 0.3s ease" }}
        ></div>
      </div>
    </section>
  );
};

export default ProjectsCarousel;
