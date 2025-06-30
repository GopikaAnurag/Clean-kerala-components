import React from "react";
import ActivitiesCarousel from "./components/ActivitiesCarousel";
import ProjectsCarousel from "./components/ProjectsCarousel";

function App() {
  const data = {
    activitiesAtGlanceSettings: {
      slideWidth: 400,          // was 240
  slideHeight: 200,
  minimumSlidesToShow: 2.8, // was 2.5 → more visible
  scrollSpeed: 500,
  dragSpeed: 0.85
    },
    activitiesAtGlance: [
      {
        label: "OTPs Issued",
        value: "278k+",
        image: "https://project251.hrstride.academy/wp-content/uploads/2025/06/ChatGPT-Image-Jun-27-2025-01_12_54-AM.png",
        color: "#005A3C",
        bgColor: "#E6F4EA",
      },
      {
        label: "Total Engagements",
        value: "38,406",
        image: "https://project251.hrstride.academy/wp-content/uploads/2025/06/ChatGPT-Image-Jun-27-2025-01_00_44-AM.png",
        color: "#006064",
        bgColor: "#E0F7FA",
      },
      {
        label: "Active Volunteers",
        value: "1200+",
        image: "https://project251.hrstride.academy/wp-content/uploads/2025/06/ChatGPT-Image-Jun-27-2025-01_12_54-AM.png",
        color: "#4A148C",
        bgColor: "#F3E5F5",
      },
      {
        label: "OTPs Issued",
        value: "278k+",
        image: "https://project251.hrstride.academy/wp-content/uploads/2025/06/ChatGPT-Image-Jun-27-2025-01_12_54-AM.png",
        color: "#005A3C",
        bgColor: "#E6F4EA",
      },
      {
        label: "Total Engagements",
        value: "38,406",
        image: "https://project251.hrstride.academy/wp-content/uploads/2025/06/ChatGPT-Image-Jun-27-2025-01_00_44-AM.png",
        color: "#006064",
        bgColor: "#E0F7FA",
      },
    ],
    ourProjectsCarouselSettings: {
      slideWidth: 300,
      slideHeight: 420,
      minimumSlidesToShow: 3.2,
      scrollSpeed: 500,
      dragSpeed: 0.9,
    },
    ourProjects: [
      {
        title: "Segregated Plastic Collection",
        image: "https://project251.hrstride.academy/wp-content/uploads/2025/06/ChatGPT-Image-Jun-27-2025-01_00_44-AM.png",
        bgColor: "#F0FFF0",
        titleColor: "#FFFFFF",
      },
      {
        title: "E-Waste Management",
        image: "https://project251.hrstride.academy/wp-content/uploads/2025/06/ChatGPT-Image-Jun-27-2025-01_10_06-AM.png",
        bgColor: "#FFF3E0",
        titleColor: "#FFFFFF",
      },
      {
        title: "Glass Waste Collection",
        image: "https://project251.hrstride.academy/wp-content/uploads/2025/06/ChatGPT-Image-Jun-27-2025-01_10_06-AM.png",
        bgColor: "#F0F8FF",
        titleColor: "#FFFFFF",
      },
      {
        title: "Organic Waste Composting",
        image: "https://project251.hrstride.academy/wp-content/uploads/2025/06/ChatGPT-Image-Jun-27-2025-01_00_44-AM.png",
        bgColor: "#FFF8E1",
        titleColor: "#FFFFFF",
      },
      {
        title: "Awareness & Education Drives",
        image: "https://project251.hrstride.academy/wp-content/uploads/2025/06/ChatGPT-Image-Jun-27-2025-01_12_54-AM.png",
        bgColor: "#F3E5F5",
        titleColor: "#FFFFFF",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white px-6 py-10 space-y-12 text-left">
  <div className="max-w-7xl mx-auto">
    <ActivitiesCarousel
      items={data.activitiesAtGlance}
      settings={data.activitiesAtGlanceSettings}
    />
    <br /> <br />
    <ProjectsCarousel
      projects={data.ourProjects}
      settings={data.ourProjectsCarouselSettings}
    />
  </div>
</div>
  );
}

export default App;
