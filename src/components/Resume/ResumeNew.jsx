import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FiDownload } from "react-icons/fi";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "../../styles/resume.css";
import { Container, Section, SectionHeading, Button } from "../ui";
import usePageMeta from "../../hooks/usePageMeta";

// The worker ships with the installed pdfjs-dist, so it is always the same
// version as the renderer, and Vite emits it as its own hashed file.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

// The PDF lives in public/ so its address never changes between deploys:
// links shared to /Zariff-Danial-Resume.pdf keep working after every edit.
const PDF_URL = "/Zariff-Danial-Resume.pdf";
const PDF_NAME = "Zariff-Danial-Resume.pdf";

// Widest a page is allowed to render, in CSS px. Below this the page simply
// fills whatever width the container has, so it fits every viewport.
const MAX_PAGE_WIDTH = 860;

// pdf.js draws each link as an empty <a> over the page, which gives it no
// accessible name. Name it after where it goes: the address for mailto, the
// host and path otherwise.
function linkLabel(href) {
  if (!href) return "";
  if (href.startsWith("mailto:")) return href.slice(7).split("?")[0];
  try {
    const url = new URL(href, window.location.href);
    const host = url.host.replace(/^www\./, "");
    const path = url.pathname.replace(/\/$/, "");
    return host + path;
  } catch {
    return href;
  }
}

// pdf.js gives each link element the id pdfjs_internal_id_<ref>, but
// react-pdf's structure tree (the tagged reading order, rendered inside the
// canvas) points aria-owns at the bare <ref>, an id that exists nowhere.
// Point it at the link instead, which keeps the link in reading order. Until
// that link exists (the two layers render independently) the reference is
// parked in data-pdf-owns so the attribute is never left dangling.
const PDFJS_ID_PREFIX = "pdfjs_internal_id_";

function resolveOwned(id) {
  if (document.getElementById(id)) return id;
  if (document.getElementById(PDFJS_ID_PREFIX + id)) return PDFJS_ID_PREFIX + id;
  return null;
}

function repairLayers(root) {
  if (!root) return;

  root.querySelectorAll(".annotationLayer a").forEach((a) => {
    if (a.getAttribute("aria-label")) return;
    const label = linkLabel(a.getAttribute("href"));
    if (label) a.setAttribute("aria-label", label);
  });

  root.querySelectorAll("[aria-owns], [data-pdf-owns]").forEach((el) => {
    const wanted = `${el.getAttribute("aria-owns") || ""} ${el.getAttribute("data-pdf-owns") || ""}`
      .split(/\s+/)
      .filter(Boolean);
    const resolved = wanted.map(resolveOwned);
    const found = [...new Set(resolved.filter(Boolean))].join(" ");
    const pending = [...new Set(wanted.filter((id, i) => !resolved[i]))].join(" ");

    if (found) {
      if (el.getAttribute("aria-owns") !== found) el.setAttribute("aria-owns", found);
    } else if (el.hasAttribute("aria-owns")) {
      el.removeAttribute("aria-owns");
    }
    if (pending) {
      if (el.getAttribute("data-pdf-owns") !== pending) el.setAttribute("data-pdf-owns", pending);
    } else if (el.hasAttribute("data-pdf-owns")) {
      el.removeAttribute("data-pdf-owns");
    }
  });
}

function ResumeNew() {
  const { t } = useTranslation();
  const docRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(MAX_PAGE_WIDTH);
  const [numPages, setNumPages] = useState(null);
  const [loadError, setLoadError] = useState(false);

  usePageMeta({
    title: t("meta.resume"),
    description: t("meta.resumeDesc"),
  });

  useEffect(() => {
    const el = docRef.current;
    if (!el) return undefined;

    const measure = () => {
      const next = Math.floor(el.clientWidth);
      if (next > 0) setContainerWidth(next);
    };

    measure();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(measure);
      observer.observe(el);
      return () => observer.disconnect();
    }

    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const pageWidth = Math.min(containerWidth, MAX_PAGE_WIDTH);
  // Every sheet, and the placeholder before the PDF arrives, is this wide
  // and A4 tall (aspect-ratio in resume.css), so nothing moves when the
  // canvas paints.
  const sheetStyle = { width: pageWidth };

  const handleDocumentLoad = ({ numPages: total }) => {
    setNumPages(total);
    setLoadError(false);
  };

  const handleDocumentError = () => {
    setLoadError(true);
  };

  // The text, structure and link layers each render on their own schedule
  // (and again on every resize), so watch the document and repair whatever
  // arrives. repairLayers only writes when something is wrong, so its own
  // writes settle after one pass.
  useEffect(() => {
    const el = docRef.current;
    if (!el || typeof MutationObserver === "undefined") return undefined;
    const observer = new MutationObserver(() => repairLayers(el));
    observer.observe(el, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["aria-owns", "href"],
    });
    repairLayers(el);
    return () => observer.disconnect();
  }, []);

  // `download` makes the anchor save the file, so the "Download" label is
  // literally what happens; Button spreads it onto the rendered <a>.
  const downloadProps = {
    href: PDF_URL,
    download: PDF_NAME,
    target: "_blank",
    rel: "noopener noreferrer",
    icon: <FiDownload />,
    iconPosition: "start",
  };

  return (
    <Section className="resume-section">
      <Container>
        <SectionHeading
          as="h1"
          title={t("navbar.resume")}
          lead={t("resume.lastUpdated")}
          aside={
            <Button variant="primary" {...downloadProps}>
              {t("resume.download")}
            </Button>
          }
        />

        <div className="resume__doc" ref={docRef}>
          {numPages === null && !loadError && (
            <div
              className="resume__sheet resume__placeholder"
              style={sheetStyle}
              role="status"
              aria-live="polite"
            >
              <span className="mono small text-3">
                {t("resume.loading", "Loading resume")}
              </span>
            </div>
          )}

          {loadError && (
            <div
              className="resume__sheet resume__placeholder"
              style={sheetStyle}
              role="alert"
            >
              <p className="text-2 resume__placeholder-text">
                {t(
                  "resume.loadError",
                  "The resume could not be displayed here. Use the download button to open it."
                )}
              </p>
            </div>
          )}

          <Document
            file={PDF_URL}
            onLoadSuccess={handleDocumentLoad}
            onLoadError={handleDocumentError}
            onSourceError={handleDocumentError}
            externalLinkTarget="_blank"
            externalLinkRel="noopener noreferrer"
            loading=""
            error=""
            className="resume__pages"
          >
            {Array.from({ length: numPages || 0 }, (_, i) => (
              // The resume itself is English in either language.
              <div key={`page-${i + 1}`} className="resume__sheet" style={sheetStyle} lang="en">
                <Page
                  pageNumber={i + 1}
                  width={pageWidth}
                  className="resume__page"
                />
              </div>
            ))}
          </Document>
        </div>

        <div className="resume__foot">
          <Button variant="ghost" {...downloadProps}>
            {t("resume.download")}
          </Button>
        </div>
      </Container>
    </Section>
  );
}

export default ResumeNew;
