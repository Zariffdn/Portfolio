import React, { useState, useEffect, lazy, Suspense } from "react";
import Preloader from "../src/components/Pre";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import ScrollToTop from "./components/ScrollToTop";
import CustomCursor from "./components/CustomCursor";
import ScrollProgress from "./components/ScrollProgress";
import BackToTop from "./components/BackToTop";
import SocialSidebar from "./components/SocialSidebar";
import KonamiEgg from "./components/KonamiEgg";
import ToastContainer from "./components/ToastContainer";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastProvider } from "./contexts/ToastContext";
import "./style.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = lazy(() => import("./components/Home/Home"));
const About = lazy(() => import("./components/About/About"));
const Projects = lazy(() => import("./components/Projects/Projects"));
const Resume = lazy(() => import("./components/Resume/ResumeNew"));
const Uses = lazy(() => import("./components/Uses"));
const MyTaxCaseStudy = lazy(() => import("./components/MyTaxCaseStudy"));
const NotFound = lazy(() => import("./components/NotFound"));

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const pageTransition = { duration: 0.35, ease: "easeOut" };

function PageWrap({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}

function RouteFallback() {
  return <div style={{ minHeight: "60vh" }} aria-hidden="true" />;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<RouteFallback />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrap><Home /></PageWrap>} />
          <Route path="/project" element={<PageWrap><Projects /></PageWrap>} />
          <Route path="/about" element={<PageWrap><About /></PageWrap>} />
          <Route path="/resume" element={<PageWrap><Resume /></PageWrap>} />
          <Route path="/uses" element={<PageWrap><Uses /></PageWrap>} />
          <Route path="/mytax" element={<PageWrap><MyTaxCaseStudy /></PageWrap>} />
          <Route path="*" element={<PageWrap><NotFound /></PageWrap>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

function App() {
  const [load, upadateLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      upadateLoad(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <ToastProvider>
        <MotionConfig reducedMotion="user">
          <Router>
            <Preloader load={load} />
            <div className="App" id={load ? "no-scroll" : "scroll"}>
              <CustomCursor />
              <ScrollProgress />
              <Navbar />
              <ScrollToTop />
              <SocialSidebar />
              <AnimatedRoutes />
              <BackToTop />
              <Footer />
            </div>
            <ToastContainer />
            <KonamiEgg />
            <Analytics />
            <SpeedInsights />
          </Router>
        </MotionConfig>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
