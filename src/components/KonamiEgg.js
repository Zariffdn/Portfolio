import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const sequence = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

function matchesKey(actual, expected) {
  if (actual === expected) return true;
  if (actual && actual.toLowerCase && actual.toLowerCase() === expected) return true;
  return false;
}

function KonamiEgg() {
  const [active, setActive] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    let position = 0;
    const onKey = (e) => {
      const expected = sequence[position];
      if (matchesKey(e.key, expected)) {
        position += 1;
        if (position === sequence.length) {
          position = 0;
          setActive(true);
          window.setTimeout(() => setActive(false), 4000);
        }
      } else {
        position = matchesKey(e.key, sequence[0]) ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!active) return null;

  return (
    <div className="konami-overlay" role="status" aria-live="polite">
      <div className="konami-card">
        <span className="konami-emoji" aria-hidden="true">🥚</span>
        <h3>{t("konami.title")}</h3>
        <p>{t("konami.subtitle")}</p>
      </div>
    </div>
  );
}

export default KonamiEgg;
