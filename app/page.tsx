import About from "./components/About";
import Contact from "./components/Contact";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Pricing from "./components/Pricing";
import Process from "./components/Process";
import Showcase from "./components/Showcase";
import TechStack from "./components/TechStack";
import ZoomThroughBackground from "./components/ZoomThroughBackground";

export default function Home() {
  return (
    <main>
      <ZoomThroughBackground
        imageSrc="/backgrounds/01_window_outside.webp"
        direction="in"
      >
        <Hero />
      </ZoomThroughBackground>

      <ZoomThroughBackground
        imageSrc="/backgrounds/02_window_inside.webp"
        direction="in"
      >
        <Process />
      </ZoomThroughBackground>

      <ZoomThroughBackground
        imageSrc="/backgrounds/03_studio_wide.webp"
        direction="in"
      >
        <Showcase />
      </ZoomThroughBackground>

      <ZoomThroughBackground
        imageSrc="/backgrounds/04_workspace_closer.webp"
        direction="in"
      >
        <Pricing />
      </ZoomThroughBackground>

      <ZoomThroughBackground
        imageSrc="/backgrounds/05_smartphone_macro.webp"
        direction="in"
      >
        <TechStack />
      </ZoomThroughBackground>

      <ZoomThroughBackground
        imageSrc="/backgrounds/06_lime_plant_macro.webp"
        direction="in"
      >
        <FAQ />
      </ZoomThroughBackground>

      <ZoomThroughBackground
        imageSrc="/backgrounds/07_screen_wireframe.webp"
        direction="in"
      >
        <Contact />
      </ZoomThroughBackground>

      <ZoomThroughBackground
        imageSrc="/backgrounds/08_berlin_skyline.webp"
        direction="out"
      >
        <About />
      </ZoomThroughBackground>

      <ZoomThroughBackground
        imageSrc="/backgrounds/01_window_outside.webp"
        direction="out"
        overlayOpacity={0.7}
      >
        <Footer />
      </ZoomThroughBackground>
    </main>
  );
}
