import React, { useEffect, useRef, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import FadeIn from "../FadeIn";

const stats = [
  { value: 80, suffix: "+", label: "certifications" },
  { value: 14, suffix: "+", label: "technologies" },
  { value: 2, suffix: "", label: "appsShipped" },
  { value: 5, suffix: "+", label: "yearsCoding" },
];

function useCountUp(target, started, duration = 1600) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) {
      setCount(0);
      return undefined;
    }
    let frame;
    let start;
    const tick = (ts) => {
      if (start === undefined) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, started, duration]);

  return count;
}

function StatCard({ value, suffix, label, started, t }) {
  const count = useCountUp(value, started);
  return (
    <div className="stat-card">
      <div className="stat-value">
        {count}
        <span className="stat-suffix">{suffix}</span>
      </div>
      <div className="stat-label">{t(`stats.${label}`)}</div>
    </div>
  );
}

function StatsCounter() {
  const { t } = useTranslation();
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setStarted(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <FadeIn>
        <Row
          className="stats-row"
          style={{ justifyContent: "center", paddingTop: "20px", paddingBottom: "30px" }}
        >
          {stats.map((s) => (
            <Col xs={6} md={3} key={s.label} className="stat-col">
              <StatCard {...s} started={started} t={t} />
            </Col>
          ))}
        </Row>
      </FadeIn>
    </div>
  );
}

export default StatsCounter;
