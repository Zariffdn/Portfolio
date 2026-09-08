import React, { useState, useEffect, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { useTranslation } from "react-i18next";
import Preloader from "./components/Pre";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import CustomCursor from "./components/CustomCursor";
import ScrollProgress from "./components/ScrollProgress";
import BackToTop from "./components/BackToTop";
import SocialSidebar from "./components/SocialSidebar";
import KonamiEgg from "./components/KonamiEgg";
import ToastContainer from "./components/ToastContainer";
import Backdrop from "./components/ui/Backdrop";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastProvider } from "./contexts/ToastContext";
// The landing route ships in the main bundle so the hero (the LCP element)
// is not gated behind a second chunk request.
import Home from "./components/Home/Home";
import "./style.css";

const About = lazy(() => import("./components/About/About"));
const Projects = lazy(() => import("./components/Projects/Projects"));
const Resume = lazy(() => import("./components/Resume/ResumeNew"));
const Uses = lazy(() => import("./components/Uses"));
const MyTaxCaseStudy = lazy(() => import("./components/MyTaxCaseStudy"));
const BestinetCaseStudy = lazy(() => import("./components/BestinetCaseStudy"));
const NotFound = lazy(() => import("./components/NotFound"));

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const pageTransition = { duration: 0.3, ease: [0.22, 1, 0.36, 1] };

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

// Fills the viewport so nothing below it (the footer) paints above the fold
// while a route chunk loads, which would otherwise register as layout shift.
function RouteFallback() {
  return <div style={{ minHeight: "calc(100vh - var(--nav-h))" }} aria-hidden="true" />;
}

// Suspense sits outside AnimatePresence so the keyed <Routes> is its direct
// child; framer-motion 6 can only run exit animations on keyed direct children
// (and its prop for waiting is exitBeforeEnter, not mode).
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <Suspense fallback={<RouteFallback />}>
      <AnimatePresence exitBeforeEnter initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrap><Home /></PageWrap>} />
          <Route path="/project" element={<PageWrap><Projects /></PageWrap>} />
          <Route path="/about" element={<PageWrap><About /></PageWrap>} />
          <Route path="/resume" element={<PageWrap><Resume /></PageWrap>} />
          <Route path="/uses" element={<PageWrap><Uses /></PageWrap>} />
          <Route path="/mytax" element={<PageWrap><MyTaxCaseStudy /></PageWrap>} />
          <Route path="/bestinet" element={<PageWrap><BestinetCaseStudy /></PageWrap>} />
          <Route path="*" element={<PageWrap><NotFound /></PageWrap>} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

// Keeps <html lang> in step with the active locale for screen readers.
function HtmlLang() {
  const { i18n } = useTranslation();
  useEffect(() => {
    document.documentElement.lang = i18n.resolvedLanguage || i18n.language || "en";
  }, [i18n.resolvedLanguage, i18n.language]);
  return null;
}

function App() {
  const [load, setLoad] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => setLoad(false), 700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <ToastProvider>
        <MotionConfig reducedMotion="user">
          <Router>
            <HtmlLang />
            <Preloader load={load} />
            <Backdrop />
            <a href="#main" className="skip-link">
              {t("skipToContent", "Skip to content")}
            </a>
            <div className="App" id={load ? "no-scroll" : "scroll"}>
              <CustomCursor />
              <ScrollProgress />
              <Navbar />
              <ScrollToTop />
              <SocialSidebar />
              <main id="main" tabIndex={-1}>
                <AnimatedRoutes />
              </main>
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
