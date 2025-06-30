import React, { useRef, useEffect, useState } from "react";

const ProjectsCarousel = ({ projects, settings }) => {
  const scrollRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "left" ? -settings.slideWidth : settings.slideWidth,
        behavior: "smooth",
      });
    }
  };

  // Track scroll progress
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

  return (
    <section className="w-full relative bg-[#f0fdf4] pl-20 pr-20">
      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center ">OUR PROJECTS</h2>

      {/* Arrows */}
      <div
        onClick={() => scroll("left")}
        className="absolute left-18 top-1/2 -translate-y-1/2 z-10 text-base font-bold text-gray-500 hover:text-black cursor-pointer select-none"
      >
        &lt;
      </div>
      <div
        onClick={() => scroll("right")}
        className="absolute right-18 top-1/2 -translate-y-1/2 z-10 text-base font-bold text-gray-500 hover:text-black cursor-pointer select-none"
      >
        &gt;
      </div>

      {/* Scrollable Project Cards */}
      <div
        ref={scrollRef}
        className="overflow-x-auto scroll-smooth no-scrollbar px-8 "
        style={{ scrollSnapType: "x mandatory" }}
      >
        <div className="flex gap-4 w-max">
          {projects.map((project, index) => (
            <div
              key={index}
              className="relative flex-shrink-0 rounded-xl overflow-hidden"
              style={{
                width: `${settings.slideWidth}px`,
                height: `${settings.slideHeight}px`,
                scrollSnapAlign: "start",
                backgroundColor: project.bgColor || "#f0f0f0",
              }}
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-opacity duration-300 rounded-2xl object-cover"
                style={{ display: "block" }}
                onError={(e) => {
                  e.target.style.opacity = 0.1;
                }}
              />
              <div
                className={`absolute inset-0 bg-opacity-40 flex ${index % 2 === 0 ? "items-end" : "items-start"
                  } p-3`}
              >
                <h3 className="text-white text-2xl font-semibold text-center w-full">
                  {project.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Thin Line Scroll Progress Bar */}
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
