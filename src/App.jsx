import React from "react";
import ActivitiesCarousel from "./components/ActivitiesCarousel";
import ProjectsCarousel from "./components/ProjectsCarousel";
import StepByStepCarousel from "./components/StepByStepCarosel";

import {
  activitiesAtGlance,
  activitiesAtGlanceSettings,
  ourProjects,
  ourProjectsCarouselSettings,
  steps,
  carouselSettings,
} from "./data/Carouseldata";

function App() {
  return (
    <div className="min-h-screen bg-white px-6 py-10 space-y-16 text-left">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Activities at a Glance */}
        <ActivitiesCarousel
          items={activitiesAtGlance}
          settings={activitiesAtGlanceSettings}
        />

        {/* Our Projects Carousel */}
        <ProjectsCarousel
          projects={ourProjects}
          settings={ourProjectsCarouselSettings}
        />

        {/* Step-by-Step Process Carousel */}
        <StepByStepCarousel
          steps={steps}
          carouselSettings={carouselSettings}
        />
        <StepByStepCarousel
          steps={steps}
          carouselSettings={carouselSettings}
        />
      </div>
    </div>
  );
}

export default App;
