import React, { useRef, useEffect, useState } from "react";

const ActivitiesCarousel = ({ items, settings }) => {
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);

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
        const slideW = containerWidth / 3.2;
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

  return (
    <section ref={containerRef} className="w-full relative bg-[#f0fdf4] py-6 px-4 md:px-20">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center">
        Activities at a Glance
      </h2>

      <div
        onClick={() => scroll("left")}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-sm md:text-base font-bold text-gray-400 hover:text-black cursor-pointer select-none"
      >
        &lt;
      </div>
      <div
        onClick={() => scroll("right")}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-sm md:text-base font-bold text-gray-400 hover:text-black cursor-pointer select-none"
      >
        &gt;
      </div>

      <div
        ref={scrollRef}
        className="overflow-x-auto scroll-smooth no-scrollbar px-2 sm:px-6"
        style={{ scrollSnapType: "x mandatory" }}
      >
        <div className="flex gap-4 w-max">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 flex rounded-xl shadow-md overflow-hidden"
              style={{
                width: `${slideWidth}px`,
                scrollSnapAlign: "start",
                background: "linear-gradient(135deg, #e6f4ea 0%, #ffffff 100%)",
              }}
            >
              <div className="w-3/5 h-auto">
                <img
                  src={item.image}
                  alt={item.label}
                  className="w-full h-full object-cover p-2 rounded-2xl"
                />
              </div>
              <div className="w-2/5 flex flex-col justify-center items-start p-2 space-y-1">
                <h3 className="text-sm md:text-base lg:text-lg font-bold text-green-700">
                  {item.value}
                </h3>
                <p className="text-xs md:text-sm font-medium text-green-800">
                  {item.label}
                </p>

                {index !== 0 && (
                  <button className="mt-auto text-[10px] sm:text-xs md:text-sm lg:text-base font-semibold text-white py-1 px-3 rounded-md bg-green-600 hover:bg-green-700 transition whitespace-nowrap">
                    Know More
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-1 bg-gray-200 mt-4 mx-8 rounded">
        <div
          className="h-1 bg-green-700 rounded"
          style={{ width: `${progress}%`, transition: "width 0.3s ease" }}
        ></div>
      </div>
    </section>
  );
};

export default ActivitiesCarousel;