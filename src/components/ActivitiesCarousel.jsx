import React, { useRef, useEffect, useState } from "react";

const ActivitiesCarousel = ({ items, settings }) => {
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
        let targetSlideCount;
        if (window.innerWidth < 640) {
          targetSlideCount = 1.8;
        } else if (window.innerWidth < 768) {
          targetSlideCount = 2.3;
        } else {
          targetSlideCount = 2.8;
        }
        const newSlideWidth = containerWidth / targetSlideCount;
        setSlideWidth(newSlideWidth);
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
      const percentage = (ref.scrollLeft / maxScroll) * 100;
      setProgress(percentage);
    };

    if (ref) {
      ref.addEventListener("scroll", handleScroll);
    }
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
    <section ref={containerRef} className="w-full relative overflow-visible bg-[#f0fdf4] py-3 px-2 md:px-12">
      <h2 className="text-xs sm:text-sm md:text-base lg:text-xl font-bold text-gray-800 mb-3 text-center">
        Activities at a Glance
      </h2>

      <div
        onClick={() => scroll("left")}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 text-[10px] sm:text-xs md:text-sm font-bold text-gray-400 hover:text-black cursor-pointer select-none"
      >
        &lt;
      </div>
      <div
        onClick={() => scroll("right")}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 text-[10px] sm:text-xs md:text-sm font-bold text-gray-400 hover:text-black cursor-pointer select-none"
      >
        &gt;
      </div>

      <div
        ref={scrollRef}
        className="cursor-grab active:cursor-grabbing overflow-x-auto overflow-visible scroll-smooth no-scrollbar px-1 sm:px-3"
      >
        <div className="flex gap-2 w-max">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 flex rounded-md shadow-sm overflow-hidden select-none"
              style={{
                width: `${slideWidth}px`,
                scrollSnapAlign: "start",
                background: "linear-gradient(135deg, #e6f4ea 0%, #ffffff 100%)",
              }}
            >
              <div className="w-3/5 h-32 sm:h-36 md:h-40 lg:h-44">
                <img
                  src={item.image}
                  alt={item.label}
                  className="w-full h-full object-cover p-1 rounded-lg pointer-events-none"
                />
              </div>
              <div
                className={`w-2/5 flex flex-col items-start p-1 space-y-1 ${
                  index === 0 ? "justify-start" : "justify-center"
                }`}
              >
                <h3 className="text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg font-bold text-green-700">
                  {item.value}
                </h3>
                <p className="text-[9px] sm:text-[10px] md:text-sm lg:text-base text-green-800">
                  {item.label}
                </p>

                {index !== 0 && (
                  <button className="mt-auto text-[9px] sm:text-xs md:text-sm lg:text-base xl:text-lg font-semibold text-white py-0.5 px-2 rounded bg-green-600 hover:bg-green-700 transition whitespace-nowrap">
                    Know More
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

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