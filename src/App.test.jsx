import { render, screen } from "@testing-library/react";
import "./i18n";
import App from "./App";

// Neither analytics script should run in a test.
vi.mock("@vercel/analytics/react", () => ({ Analytics: () => null }));
vi.mock("@vercel/speed-insights/react", () => ({ SpeedInsights: () => null }));

test("renders the site chrome", async () => {
  render(<App />);
  expect(await screen.findByRole("navigation")).toBeInTheDocument();
  expect(screen.getByRole("main")).toBeInTheDocument();
  expect(screen.getByRole("contentinfo")).toBeInTheDocument();
});
