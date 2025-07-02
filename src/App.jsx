// src/App.jsx
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
  stepByStepCarouselSettings,
} from "./data/Carouseldata";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="w-full">
        {/* Removed the <h1> heading here as requested */}

        <section className="my-12">
          <ActivitiesCarousel items={activitiesAtGlance} settings={activitiesAtGlanceSettings} />
        </section>

        <section className="my-12">
          <ProjectsCarousel projects={ourProjects} settings={ourProjectsCarouselSettings} />
        </section>

        <section className="my-12">
          <StepByStepCarousel steps={steps} carouselSettings={stepByStepCarouselSettings} title="Our Process" />
        </section>

        <section className="my-12">
          <StepByStepCarousel steps={steps} carouselSettings={stepByStepCarouselSettings} title="Our Process" />
        </section>

        {/* Add more sections or components as needed */}
      </div>
    </div>
  );
}

export default App;