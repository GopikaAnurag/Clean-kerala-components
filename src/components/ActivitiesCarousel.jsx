import React, { useRef, useEffect, useState } from "react";

const ActivitiesCarousel = ({ items, settings }) => {
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const [slideHeight, setSlideHeight] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const aspectRatio = settings.slideHeight / settings.slideWidth;

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "left" ? -slideWidth : slideWidth,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        let targetSlides = 2.8;
        if (window.innerWidth < 640) targetSlides = 1.8;
        else if (window.innerWidth < 768) targetSlides = 2.3;

        const newWidth = containerWidth / targetSlides;
        setSlideWidth(newWidth);
        setSlideHeight(newWidth * aspectRatio);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [aspectRatio]);

  useEffect(() => {
    const ref = scrollRef.current;
    const handleScroll = () => {
      const maxScroll = ref.scrollWidth - ref.clientWidth;
      const percentage = (ref.scrollLeft / maxScroll) * 100;
      setProgress(percentage);
    };

    ref?.addEventListener("scroll", handleScroll);
    return () => ref?.removeEventListener("scroll", handleScroll);
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

  // 🔑 Arrow key scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") scroll("left");
      if (e.key === "ArrowRight") scroll("right");
    };

    const container = containerRef.current;
    if (container) {
      container.setAttribute("tabindex", "0");
      container.addEventListener("keydown", handleKeyDown);
    }

    return () => container?.removeEventListener("keydown", handleKeyDown);
  }, [slideWidth]);

  return (
    <section
      ref={containerRef}
      className="w-full relative overflow-visible bg-[#f0fdf4] py-3 px-2 md:px-12 outline-none"
    >
      <h2 className="text-xs sm:text-sm md:text-base lg:text-xl font-bold text-gray-800 mb-3 text-center">
        Activities at a Glance
      </h2>

      {/* Arrows */}
      <div
        onClick={() => scroll("left")}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 text-sm font-bold text-gray-400 hover:text-black cursor-pointer select-none"
      >
        &lt;
      </div>
      <div
        onClick={() => scroll("right")}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 text-sm font-bold text-gray-400 hover:text-black cursor-pointer select-none"
      >
        &gt;
      </div>

      {/* Scroll Area */}
      <div
        ref={scrollRef}
        className="cursor-grab active:cursor-grabbing overflow-x-auto scroll-smooth no-scrollbar px-1 sm:px-3"
        style={{ scrollSnapType: "x mandatory" }}
      >
        <div className="flex gap-2 w-max">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 flex rounded-md shadow-sm overflow-hidden select-none"
              style={{
                width: `${slideWidth}px`,
                height: `${slideHeight}px`,
                scrollSnapAlign: "start",
                backgroundColor: item.bgColor || "#E6F4EA",
                transition: "width 0.3s ease, height 0.3s ease",
              }}
            >
              <div style={{ width: "55%", height: "100%" }}>
                <img
                  src={item.image}
                  alt={item.label}
                  className="w-full h-full object-contain p-2 rounded-md"
                />
              </div>
              <div
                className="w-2/5 flex flex-col items-start p-2 space-y-1 justify-between"
                style={{ height: "100%" }}
              >
                <div>
                  <h3 className="text-green-700 font-bold text-sm sm:text-base md:text-lg">
                    {item.value}
                  </h3>
                  <p className="text-green-800 text-xs sm:text-sm md:text-base">
                    {item.label}
                  </p>
                </div>

                <button className="text-[10px] sm:text-xs md:text-sm font-semibold text-white py-1 px-2 rounded bg-green-600 hover:bg-green-700 transition whitespace-nowrap">
                  Know More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-gray-200 mt-2 mx-4 rounded">
        <div
          className="h-1 bg-green-700 rounded"
          style={{ width: `${progress}%`, transition: "width 0.3s ease" }}
        ></div>
      </div>
    </section>
  );
};

export default ActivitiesCarousel;
