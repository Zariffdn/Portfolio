import React from "react";
import Particles from "react-tsparticles";
import { useTheme } from "../contexts/ThemeContext";

function Particle() {
  const { theme } = useTheme();
  const particleColor = theme === "light" ? "#3a1d5c" : "#ffffff";

  return (
    <Particles
      id="tsparticles"
      key={theme}
      params={{
        particles: {
          number: {
            value: 160,
            density: {
              enable: true,
              value_area: 1500,
            },
          },
          color: {
            value: particleColor,
          },
          line_linked: {
            enable: false,
            opacity: 0.03,
          },
          move: {
            direction: "right",
            speed: 0.05,
          },
          size: {
            value: 1,
          },
          opacity: {
            anim: {
              enable: true,
              speed: 1,
              opacity_min: 0.05,
            },
          },
        },
        retina_detect: true,
      }}
    />
  );
}

export default Particle;
