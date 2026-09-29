import { useState, useEffect, useCallback, Suspense } from "react";
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
import ScrollToTop, { usePageEntry, focusQuietly } from "./components/ScrollToTop";
import { RouteErrorBoundary } from "./components/ErrorBoundary";
import CustomCursor from "./components/CustomCursor";
import ScrollProgress from "./components/ScrollProgress";
import BackToTop from "./components/BackToTop";
import SocialSidebar from "./components/SocialSidebar";
import KonamiEgg from "./components/KonamiEgg";
import ToastContainer from "./components/ToastContainer";
import Backdrop from "./components/ui/Backdrop";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastProvider } from "./contexts/ToastContext";
import lazyPreload from "./utils/lazyPreload";
import { writeStorage } from "./utils/storage";
import { prefersReducedMotion } from "./utils/motion";
import installPrintReveal from "./utils/printReveal";
// The landing route ships in the main bundle so the hero (the LCP element)
// is not gated behind a second chunk request.
import Home from "./components/Home/Home";
import "./style.css";

// Each lazy route renders straight from its module once that has loaded
// (see utils/lazyPreload), so a warmed route never shows the fallback.
const About = lazyPreload(() => import("./components/About/About"));
const Projects = lazyPreload(() => import("./components/Projects/Projects"));
const Resume = lazyPreload(() => import("./components/Resume/ResumeNew"));
const Uses = lazyPreload(() => import("./components/Uses"));
const MyTaxCaseStudy = lazyPreload(() => import("./components/MyTaxCaseStudy"));
const BestinetCaseStudy = lazyPreload(() => import("./components/BestinetCaseStudy"));
const SilentSupportCaseStudy = lazyPreload(() => import("./components/SilentSupportCaseStudy"));
const BaglockCaseStudy = lazyPreload(() => import("./components/BaglockCaseStudy"));
const NotFound = lazyPreload(() => import("./components/NotFound"));

// Fetched while the browser is idle so the first click on a link does not
// wait on the network between exit and enter. Left out: the resume, whose
// chunk carries react-pdf and pdf.js and is fetched on intent instead (a
// pointer over a link to it, or focus resting on one), and the 404 page.
const IDLE_ROUTES = [
  About,
  Projects,
  Uses,
  MyTaxCaseStudy,
  BestinetCaseStudy,
  SilentSupportCaseStudy,
  BaglockCaseStudy,
];

function warmRoutes() {
  IDLE_ROUTES.forEach((route) => route.preload().catch(() => {}));
}

function warmResume() {
  if (conserveData()) return;
  Resume.preload().catch(() => {});
}

// Data Saver (navigator.connection.saveData), or a connection the browser
// rates as 2G or slower, turns every warm-up off.
function conserveData() {
  try {
    const { connection } = navigator;
    if (!connection) return false;
    return Boolean(connection.saveData) || /^(slow-)?2g$/.test(connection.effectiveType || "");
  } catch {
    return false;
  }
}

// The Resume links (navbar, footer) warm the resume chunk on intent. A
// pointer over a link is intent at once; focus counts only once it has
// rested for a moment, so tabbing through the nav does not fetch react-pdf
// in passing.
const RESUME_INTENT_DWELL_MS = 300;
let resumeIntentTimer;
const resumeIntent = {
  onPointerEnter: warmResume,
  onFocus() {
    window.clearTimeout(resumeIntentTimer);
    resumeIntentTimer = window.setTimeout(warmResume, RESUME_INTENT_DWELL_MS);
  },
  onBlur() {
    window.clearTimeout(resumeIntentTimer);
  },
};

// The wordmark preloader shows on the first page of a browser session only,
// and never under reduced motion (it is a motion flourish). Storage that
// cannot be read counts as seen: with no way to remember, it would otherwise
// flash on every load. Its timing lives in CSS (see Pre.jsx).
const PRELOADER_KEY = "preloader-seen";

function firstVisitOfSession() {
  if (prefersReducedMotion()) return false;
  try {
    return window.sessionStorage.getItem(PRELOADER_KEY) === null;
  } catch {
    return false;
  }
}

const EASE = [0.22, 1, 0.36, 1];

// The exit is short and eases in: the old page should get out of the way,
// since the scroll reset and focus move wait for it (usePageEntry).
const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15, ease: [0.4, 0, 1, 1] } },
};

function PageWrap({ children }) {
  usePageEntry();
  return (
    <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
      {children}
    </motion.div>
  );
}

// The skip link moves focus itself instead of letting the browser follow
// #main: a native fragment jump pushes a keyless history entry that React
// Router reports as a POP to the first entry of the visit, which ScrollToTop
// would read as Back to that page and restore its offset (under reduced
// motion the reader would end up there instead of at the content). No
// history entry is added, so Back still leaves the page. The href stays for
// the link's semantics. scrollIntoView follows the CSS scroll-behavior:
// smooth normally, instant under reduced motion (base.css).
function skipToMain(event) {
  const main = document.getElementById("main");
  if (!main) return;
  event.preventDefault();
  main.scrollIntoView({ block: "start" });
  focusQuietly(main);
}

// Fills the viewport so nothing below it (the footer) paints above the fold
// while a route chunk loads, which would otherwise register as layout shift.
function RouteFallback() {
  return <div style={{ minHeight: "calc(100vh - var(--nav-h))" }} aria-hidden="true" />;
}

// Suspense sits outside AnimatePresence so the keyed <Routes> is its direct
// child; AnimatePresence only runs exit animations on keyed direct children.
// The error boundary resets itself on every navigation (the location key,
// not the pathname, so a second click on a failed page's own link tries the
// page again).
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <RouteErrorBoundary resetKey={location.key}>
      <Suspense fallback={<RouteFallback />}>
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrap><Home /></PageWrap>} />
            <Route path="/project" element={<PageWrap><Projects /></PageWrap>} />
            <Route path="/about" element={<PageWrap><About /></PageWrap>} />
            <Route path="/resume" element={<PageWrap><Resume /></PageWrap>} />
            <Route path="/uses" element={<PageWrap><Uses /></PageWrap>} />
            <Route path="/mytax" element={<PageWrap><MyTaxCaseStudy /></PageWrap>} />
            <Route path="/bestinet" element={<PageWrap><BestinetCaseStudy /></PageWrap>} />
            <Route path="/silent-support" element={<PageWrap><SilentSupportCaseStudy /></PageWrap>} />
            <Route path="/baglock" element={<PageWrap><BaglockCaseStudy /></PageWrap>} />
            <Route path="*" element={<PageWrap><NotFound /></PageWrap>} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </RouteErrorBoundary>
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
  const [preloader, setPreloader] = useState(firstVisitOfSession);
  const hidePreloader = useCallback(() => setPreloader(false), []);
  // While the mobile menu covers the page, everything behind it is inert:
  // out of the Tab order and out of the accessibility tree.
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (preloader) writeStorage("sessionStorage", PRELOADER_KEY, "1");
  }, [preloader]);

  // The warm-up waits for the window's load event, so on a slow link it
  // never competes with the hero image and the fonts; from there the browser
  // picks an idle moment, or 4 s at most.
  useEffect(() => {
    if (conserveData()) return undefined;
    let idle;
    const schedule = () => {
      idle = window.requestIdleCallback
        ? window.requestIdleCallback(warmRoutes, { timeout: 4000 })
        : setTimeout(warmRoutes, 1500);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      window.removeEventListener("load", schedule);
      if (idle === undefined) return;
      if (window.requestIdleCallback) window.cancelIdleCallback(idle);
      else clearTimeout(idle);
    };
  }, []);

  useEffect(() => installPrintReveal(), []);

  return (
    <ThemeProvider>
      <ToastProvider>
        <MotionConfig reducedMotion="user">
          <Router>
            <HtmlLang />
            {preloader && <Preloader onDone={hidePreloader} />}
            <Backdrop />
            <a href="#main" className="skip-link" inert={menuOpen} onClick={skipToMain}>
              {t("skipToContent", "Skip to content")}
            </a>
            <div className="App">
              <CustomCursor />
              <ScrollProgress />
              <Navbar onMenuChange={setMenuOpen} resumeIntent={resumeIntent} />
              <ScrollToTop />
              <SocialSidebar inert={menuOpen} />
              <main id="main" tabIndex={-1} inert={menuOpen}>
                <AnimatedRoutes />
              </main>
              <BackToTop inert={menuOpen} />
              <Footer inert={menuOpen} resumeIntent={resumeIntent} />
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
