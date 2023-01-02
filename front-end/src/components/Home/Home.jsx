import React from "react";
import Contact from "./Contact/Contact";

import Hero from "./Hero/Hero";
import Information from "./Information/Information";
import Levels from "./Levels/Levels";

const Home = () => {
  return (
    <>
      <Hero />
      <Information />
      <Levels />
      <Contact />
    </>
  );
};

export default Home;
