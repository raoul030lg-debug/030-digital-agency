import About from "./components/About";
import Contact from "./components/Contact";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Pricing from "./components/Pricing";
import Process from "./components/Process";
import ScrollFrameSequence from "./components/ScrollFrameSequence";
import Showcase from "./components/Showcase";
import TechStack from "./components/TechStack";

export default function Home() {
  return (
    <main>
      <ScrollFrameSequence>
        <Hero />
        <Process />
      </ScrollFrameSequence>
      <Showcase />
      <Pricing />
      <TechStack />
      <FAQ />
      <Contact />
      <About />
      <Footer />
    </main>
  );
}
