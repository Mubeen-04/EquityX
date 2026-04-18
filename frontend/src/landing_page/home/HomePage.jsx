import React from "react";
import Hero from "./Hero";
import Stats from "./Stats";
import Awards from "./Awards";
import Pricing from "./Pricing";
import Education from "./Education";

function HomePage() {
  return (
    <div>
      <Hero />
      <Stats />
      <Awards />
      <Pricing />
      <Education />
    </div>
  );
}

export default HomePage;
