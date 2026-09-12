import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import globals from "globals";

export default [
  {
    ignores: ["dist/**", "build/**", "tools/**", "node_modules/**"],
  },
  js.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  reactHooks.configs.flat.recommended,
  jsxA11y.flatConfigs.recommended,
  {
    files: ["**/*.{js,jsx,mjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // The codebase has never used PropTypes (CRA's react-app config did
      // not enable this rule either); component contracts are documented in
      // comments and exercised by the app-level test.
      "react/prop-types": "off",
    },
    settings: {
      // Pinned rather than "detect": the plugin's detector calls a context
      // method that ESLint 10 no longer provides.
      react: { version: "19.2" },
    },
  },
  {
    files: ["src/**/*.test.{js,jsx}", "src/setupTests.js"],
    languageOptions: {
      globals: {
        ...globals.vitest,
      },
    },
  },
];
