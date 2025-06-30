import React, { useRef, useEffect, useState } from "react";

const ActivitiesCarousel = ({ items, settings }) => {
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
    <section className="w-full relative bg-[#f0fdf4] py-6 pl-20 pr-20">
      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Activities at a Glance
      </h2>

      {/* Arrows */}
      <div
        onClick={() => scroll("left")}
        className="absolute left-18 top-1/2 -translate-y-1/2 z-10 text-s font-bold text-gray-400 hover:text-black cursor-pointer select-none"
      >
        &lt;
      </div>
      <div
        onClick={() => scroll("right")}
        className="absolute right-18 top-1/2 -translate-y-1/2 z-10 text-s font-bold text-gray-400 hover:text-black cursor-pointer select-none"
      >
        &gt;
      </div>

      {/* Scrollable Cards */}
      <div
        ref={scrollRef}
        className="overflow-x-auto scroll-smooth no-scrollbar px-8"
        style={{ scrollSnapType: "x mandatory" }}
      >
        <div className="flex gap-4 w-max">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 flex rounded-xl shadow-md overflow-hidden"
              style={{
                width: `${settings.slideWidth}px`,
                height: `${settings.slideHeight}px`,
                background: "linear-gradient(135deg, #e6f4ea 0%, #ffffff 100%)",
                scrollSnapAlign: "start",
              }}
            >
              {/* Left Image */}
              <div className="w-3/5 h-full">
                <img
                  src={item.image}
                  alt={item.label}
                  className="w-full h-full object-cover p-2 rounded-2xl"
                />
              </div>

              {/* Right Text */}
              <div className="w-2/5 flex flex-col justify-center items-start p-3 space-y-2">
                <h3 className="text-xl font-bold text-green-700">
                  {item.value}
                </h3>
                <p className="text-sm font-medium text-green-800">
                  {item.label}
                </p>

                {index !== 0 && (
                  <button className="mt-auto text-sm font-semibold text-white py-1.5 px-4 rounded-md bg-green-600 hover:bg-green-700 transition">
                    Know More
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Line */}
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
