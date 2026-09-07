import React, { useState, useEffect, useCallback, useRef } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiSun, FiMoon, FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import { useToast } from "../contexts/ToastContext";
import Wordmark from "./ui/Wordmark";

const LINKS = [
  { to: "/", key: "home", end: true },
  { to: "/about", key: "about" },
  { to: "/project", key: "projects" },
  { to: "/resume", key: "resume" },
];

const SOCIALS = [
  { href: "https://github.com/Zariffdn", label: "GitHub", Icon: FiGithub },
  { href: "https://www.linkedin.com/in/zariffdanial/", label: "LinkedIn", Icon: FiLinkedin },
  { href: "mailto:zariffdanial.zul@gmail.com", label: "Email", Icon: FiMail },
];

const EASE = [0.22, 1, 0.36, 1];

// While the overlay is open, Tab cycles only through the header actions
// (theme, language, burger) and the links inside the overlay.
const FOCUSABLE = "a[href], button:not([disabled])";

const isRendered = (el) => el.getClientRects().length > 0;

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  // Mirrors `open` synchronously so close() knows whether the overlay was
  // actually showing when it is called from a route-change effect.
  const openRef = useRef(false);
  const burgerRef = useRef(null);
  const actionsRef = useRef(null);
  const menuRef = useRef(null);
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const { showToast } = useToast();
  const location = useLocation();
  const currentLang = i18n.resolvedLanguage || i18n.language || "en";

  const handleThemeToggle = () => {
    toggleTheme();
    const next = theme === "dark" ? "light" : "dark";
    showToast(
      next === "light" ? t("toast.switchedToLight") : t("toast.switchedToDark"),
      { icon: next === "light" ? "☀️" : "🌙" }
    );
  };

  const handleLanguageToggle = () => {
    const next = currentLang === "ms" ? "en" : "ms";
    i18n.changeLanguage(next);
    showToast(
      next === "en"
        ? t("toast.switchedToEnglish", { lng: "en" })
        : t("toast.switchedToMalay", { lng: "ms" }),
      { icon: "🌐" }
    );
  };

  const openMenu = useCallback(() => {
    openRef.current = true;
    setOpen(true);
  }, []);

  // Every close path (Escape, link activation, the burger, route change)
  // goes through here so focus returns to the burger that opened the menu.
  // Route changes that happen while the menu is shut leave focus alone, so
  // ScrollToTop can hand it to <main> as usual.
  const close = useCallback(() => {
    const wasOpen = openRef.current;
    openRef.current = false;
    setOpen(false);
    if (wasOpen && burgerRef.current) burgerRef.current.focus();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the overlay on navigation and on Escape; lock body scroll while open.
  useEffect(() => {
    close();
  }, [location.pathname, close]);

  useEffect(() => {
    if (!open) {
      document.body.classList.remove("menu-open");
      return undefined;
    }
    document.body.classList.add("menu-open");

    // Move focus into the overlay once its entrance animation has started.
    const focusTimer = window.setTimeout(() => {
      const first = menuRef.current && menuRef.current.querySelector(".menu__link");
      if (first) first.focus();
    }, 30);

    const getFocusables = () => {
      const header = actionsRef.current
        ? Array.from(actionsRef.current.querySelectorAll(FOCUSABLE))
        : [];
      const overlay = menuRef.current
        ? Array.from(menuRef.current.querySelectorAll(FOCUSABLE))
        : [];
      return header.concat(overlay).filter(isRendered);
    };

    const onKey = (e) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const items = getFocusables();
      if (!items.length) return;
      e.preventDefault();
      const idx = items.indexOf(document.activeElement);
      const last = items.length - 1;
      const next = e.shiftKey
        ? items[idx <= 0 ? last : idx - 1]
        : items[idx === -1 || idx === last ? 0 : idx + 1];
      next.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const themeButton = (
    <button
      type="button"
      onClick={handleThemeToggle}
      className="icon-btn"
      aria-label={theme === "dark" ? t("navbar.toggleLightAria") : t("navbar.toggleDarkAria")}
    >
      {theme === "dark" ? <FiSun /> : <FiMoon />}
    </button>
  );

  const langButton = (
    <button
      type="button"
      onClick={handleLanguageToggle}
      className="icon-btn icon-btn--text"
      aria-label={t("navbar.toggleLanguageAria")}
    >
      {currentLang === "ms" ? "EN" : "BM"}
    </button>
  );

  return (
    <>
      <header className={`nav ${scrolled ? "nav--scrolled" : ""} ${open ? "nav--menu-open" : ""}`.trim()}>
        <nav className="container nav__inner" aria-label={t("navbar.menu", "Main")}>
          <Wordmark aria-label={t("navbar.wordmarkAria")} />

          <ul className="nav__links">
            {LINKS.map(({ to, key, end }) => (
              <li key={key}>
                <NavLink to={to} end={end} className="nav__link">
                  {t(`navbar.${key}`)}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="nav__actions" ref={actionsRef}>
            {themeButton}
            {langButton}
            <button
              ref={burgerRef}
              type="button"
              className={`nav__burger ${open ? "is-open" : ""}`.trim()}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t("navbar.closeMenu", "Close menu") : t("navbar.openMenu", "Open menu")}
              onClick={open ? close : openMenu}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            className="menu"
            role="dialog"
            aria-modal="true"
            aria-label={t("navbar.menu", "Main")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <motion.ul
              className="menu__list"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } }}
            >
              {LINKS.map(({ to, key, end }, i) => (
                <motion.li
                  key={key}
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
                  }}
                >
                  <NavLink to={to} end={end} className="menu__link" onClick={close}>
                    <span>{t(`navbar.${key}`)}</span>
                    <span className="menu__index">0{i + 1}</span>
                  </NavLink>
                </motion.li>
              ))}
            </motion.ul>

            <div className="menu__secondary">
              <Link to="/uses" onClick={close}>
                {t("footer.uses")}
              </Link>
              <Link to="/mytax" onClick={close}>
                MyTax
              </Link>
              <a href="https://github.com/Zariffdn/Portfolio" target="_blank" rel="noopener noreferrer">
                {t("footer.viewSource")}
              </a>
            </div>

            <div className="menu__footer">
              <div className="menu__socials">
                {SOCIALS.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    className="icon-btn"
                    aria-label={label}
                    {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <Icon />
                  </a>
                ))}
              </div>
              <span className="mono text-3 small">{t("navbar.locationLine")}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default NavBar;
