import React, { useState, useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Particle from "../Particle";
import pdf from "../../Assets/../Assets/ZARIFF DANIAL RESUME .pdf";
import { AiOutlineDownload } from "react-icons/ai";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import usePageMeta from "../../hooks/usePageMeta";
import { useTranslation } from "react-i18next";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function ResumeNew() {
  const [width, setWidth] = useState(1200);
  const [numPages, setNumPages] = useState(null);
  const { t } = useTranslation();

  usePageMeta({
    title: "Resume — Zariff Danial",
    description: "Download or view Zariff Danial's resume / CV.",
  });

  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);

  const handleDocumentLoad = ({ numPages: total }) => {
    setNumPages(total);
  };

  return (
    <div>
      <Container fluid className="resume-section">
        <Particle />
        <Row style={{ justifyContent: "center", position: "relative" }}>
          <Button
            variant="primary"
            href={pdf}
            target="_blank"
            style={{ maxWidth: "250px" }}
          >
            <AiOutlineDownload />
            &nbsp;{t("resume.download")}
          </Button>
        </Row>

        <Row className="resume">
          <Document
            file={pdf}
            onLoadSuccess={handleDocumentLoad}
            className="d-flex flex-column align-items-center"
          >
            {Array.from({ length: numPages || 0 }, (_, i) => (
              <Page
                key={`page-${i + 1}`}
                pageNumber={i + 1}
                scale={width > 786 ? 1.7 : 0.6}
                className="resume-page"
              />
            ))}
          </Document>
        </Row>

        <Row style={{ justifyContent: "center", position: "relative" }}>
          <Button
            variant="primary"
            href={pdf}
            target="_blank"
            style={{ maxWidth: "250px" }}
          >
            <AiOutlineDownload />
            &nbsp;{t("resume.download")}
          </Button>
        </Row>
      </Container>
    </div>
  );
}

export default ResumeNew;
