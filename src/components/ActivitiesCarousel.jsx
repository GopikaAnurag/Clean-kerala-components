import React, { useRef, useEffect, useState } from "react";

const ActivitiesCarousel = ({ items, settings }) => {
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const [slideHeight, setSlideHeight] = useState(0);
  const [fontScale, setFontScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const aspectRatio = settings.slideWidth ? settings.slideHeight / settings.slideWidth : 1;

  const scroll = (dir) => {
    if (scrollRef.current) {
      const keyScrollAmount = settings.keyScrollSpeed !== undefined ? settings.keyScrollSpeed : slideWidth;
      scrollRef.current.scrollBy({
        left: dir === "left" ? -keyScrollAmount : keyScrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current && settings) {
        const containerWidth = containerRef.current.offsetWidth;
        let targetSlides = 2.5; // PC view default

        if (window.innerWidth < 640) targetSlides = 1.5;
        else if (window.innerWidth < 768) targetSlides = 2.0;

        const newWidth = containerWidth / targetSlides;
        let scale = newWidth / (settings.slideWidth || 300);

        if (window.innerWidth >= 1024) {
          scale *= 1.6;
        }

        const MIN_FONT_SCALE = 0.7;
        if (scale < MIN_FONT_SCALE) {
          scale = MIN_FONT_SCALE;
        }

        setSlideWidth(newWidth);
        setSlideHeight(newWidth * aspectRatio);
        setFontScale(scale);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [aspectRatio, settings.slideWidth]);

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
  }, [isDragging, startX, scrollLeft, settings.dragSpeed]);

  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider || !isActive) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const scrollAmount = e.deltaY || e.deltaX;
      const scrollSpeed = settings.scrollSpeed !== undefined ? settings.scrollSpeed : 1;
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
  }, [isActive, slideWidth, settings.keyScrollSpeed]);

  return (
    <section
      ref={containerRef}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      className="w-full relative overflow-visible bg-[#f0fdf4] py-3 outline-none"
    >
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <h2
          className="font-bold text-gray-800 mb-5 text-center"
          style={{ fontSize: `${0.9 * fontScale}rem` }}
        >
          Activities at a Glance
        </h2>

        <div
          onClick={() => scroll("left")}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-sm font-bold text-gray-400 hover:text-black cursor-pointer select-none"
        >
          &lt;
        </div>
        <div
          onClick={() => scroll("right")}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-sm font-bold text-gray-400 hover:text-black cursor-pointer select-none"
        >
          &gt;
        </div>

        <div
          ref={scrollRef}
          className="cursor-grab active:cursor-grabbing overflow-x-auto scroll-smooth no-scrollbar"
          style={{ scrollSnapType: "x mandatory" }}
        >
          <div className="flex gap-4 w-max pl-8 sm:pl-10 md:pl-12 lg:pl-16 xl:pl-20 2xl:pl-24 pr-8 sm:pr-10 md:pr-12 lg:pr-16 xl:pr-20 2xl:pr-24">
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
                    <h3
                      className="text-green-700 font-bold"
                      style={{ fontSize: `${0.9 * fontScale}rem` }}
                    >
                      {item.value}
                    </h3>
                    <p
                      className="text-green-800"
                      style={{ fontSize: `${0.75 * fontScale}rem` }}
                    >
                      {item.label}
                    </p>
                  </div>
                  <button
                    className="text-white rounded bg-green-600 hover:bg-green-700 transition whitespace-nowrap"
                    style={{
                      fontSize: `${0.6 * fontScale}rem`,
                      padding: `${0.3 * fontScale}rem ${0.6 * fontScale}rem`,
                      fontWeight: 600,
                    }}
                  >
                    Know More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            width: "100%",
            maxWidth: `${Math.min(700, containerRef.current ? containerRef.current.offsetWidth * 0.8 : 700) * fontScale}px`,
            margin: "1rem auto 0",
          }}
        >
          <div className="h-1 bg-gray-200 mt-2 rounded">
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

export default ActivitiesCarousel;