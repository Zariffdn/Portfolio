import { render, screen } from "@testing-library/react";
import "./i18n";
import App from "./App";

// These packages resolve through package.json "exports", which Jest 27
// (react-scripts 5) cannot follow. Neither should run in a test anyway.
jest.mock("@vercel/analytics/react", () => ({ Analytics: () => null }), { virtual: true });
jest.mock("@vercel/speed-insights/react", () => ({ SpeedInsights: () => null }), { virtual: true });

test("renders the site chrome", async () => {
  render(<App />);
  expect(await screen.findByRole("navigation")).toBeInTheDocument();
  expect(screen.getByRole("main")).toBeInTheDocument();
  expect(screen.getByRole("contentinfo")).toBeInTheDocument();
});
