import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Process from "@/components/Process";
import WhyChooseUs from "@/components/WhyChooseUs";
import Projects from "@/components/Projects";
import Testimonials from "@/components/ui/testimonial-v2";
import Contact from "@/components/Contact";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <Hero />
      <About />
      <Services />
      <Process />
      <WhyChooseUs />
      <Projects />
      <Testimonials />
      <Contact />
    </main>
  );
}
