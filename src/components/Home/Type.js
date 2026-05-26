import React from "react";
import Typewriter from "typewriter-effect";
import { useTranslation } from "react-i18next";

function Type() {
  const { t, i18n } = useTranslation();

  return (
    <Typewriter
      key={i18n.resolvedLanguage || i18n.language}
      options={{
        strings: [
          t("typewriter.mobile"),
          t("typewriter.flutter"),
          t("typewriter.web"),
          t("typewriter.programmer"),
        ],
        autoStart: true,
        loop: true,
        deleteSpeed: 50,
      }}
    />
  );
}

export default Type;
