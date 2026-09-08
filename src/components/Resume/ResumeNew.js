import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FiDownload } from "react-icons/fi";
import { Document, Page, pdfjs } from "react-pdf";
import "../../styles/resume.css";
import { Container, Section, SectionHeading, Button } from "../ui";
import usePageMeta from "../../hooks/usePageMeta";
import pdf from "../../Assets/Zariff-Danial-Resume.pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Widest a page is allowed to render, in CSS px. Below this the page simply
// fills whatever width the container has, so it fits every viewport.
const MAX_PAGE_WIDTH = 860;

// Each rendered page carries a 1px border on both sides; the canvas has to be
// that much narrower than the container so the framed page never overflows.
const PAGE_FRAME = 2;

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
      const next = Math.floor(el.clientWidth) - PAGE_FRAME;
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

  const handleDocumentLoad = ({ numPages: total }) => {
    setNumPages(total);
    setLoadError(false);
  };

  const handleDocumentError = () => {
    setLoadError(true);
  };

  // `download` makes the anchor save the file, so the "Download" label is
  // literally what happens; Button spreads it onto the rendered <a>.
  const downloadProps = {
    href: pdf,
    download: "Zariff-Danial-Resume.pdf",
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
              className="surface resume__placeholder"
              role="status"
              aria-live="polite"
            >
              <span className="mono small text-3">
                {t("resume.loading", "Loading resume")}
              </span>
            </div>
          )}

          {loadError && (
            <div className="surface resume__placeholder" role="alert">
              <p className="text-2 resume__placeholder-text">
                {t(
                  "resume.loadError",
                  "The resume could not be displayed here. Use the download button to open it."
                )}
              </p>
            </div>
          )}

          <Document
            file={pdf}
            onLoadSuccess={handleDocumentLoad}
            onLoadError={handleDocumentError}
            onSourceError={handleDocumentError}
            loading=""
            error=""
            className="resume__pages"
          >
            {Array.from({ length: numPages || 0 }, (_, i) => (
              <Page
                key={`page-${i + 1}`}
                pageNumber={i + 1}
                width={pageWidth}
                renderAnnotationLayer={false}
                className="resume__page"
              />
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
