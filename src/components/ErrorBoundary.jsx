import { Component } from "react";
import { useTranslation } from "react-i18next";
import { FiRefreshCw } from "react-icons/fi";
import { Container, Section, Button } from "./ui";
import { usePageEntry } from "./ScrollToTop";
import usePageMeta from "../hooks/usePageMeta";
import { retryFailedRoutes } from "../utils/lazyPreload";

const reload = () => window.location.reload();

// Stands in for a page that threw (or whose chunk failed to load) while the
// navbar and footer stay up. It takes the page's place, so it also takes
// over the page's scroll and focus handling and its single h1.
function RouteErrorFallback() {
  const { t } = useTranslation();
  usePageEntry();
  // Its own title, and noindex, which also drops the failed page's canonical.
  usePageMeta({
    title: t("errorBoundary.title"),
    description: t("meta.notFoundDesc"),
    noindex: true,
  });

  return (
    <Section className="route-error">
      <Container narrow>
        <span className="eyebrow">{t("errorBoundary.eyebrow")}</span>
        <h1>{t("errorBoundary.title")}</h1>
        <p className="lead">{t("errorBoundary.body")}</p>
        <div className="route-error__actions">
          <Button
            variant="primary"
            onClick={reload}
            icon={<FiRefreshCw />}
            iconPosition="start"
          >
            {t("errorBoundary.reload")}
          </Button>
          <Button to="/" variant="ghost">
            {t("errorBoundary.home")}
          </Button>
        </div>
      </Container>
    </Section>
  );
}

// Wraps the routes inside <main>. `resetKey` is the location key: any
// navigation, even to the pathname that failed, clears the error and renders
// the routes again. It resets through state rather than a React key, so a
// normal navigation does not remount the routes and cut off the page exit
// animation.
export class RouteErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false, resetKey: props.resetKey };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  // On a navigation, a route whose chunk failed earlier gets a fresh lazy
  // here, before the routes render, so the visit asks for the chunk (and a
  // reload) again instead of reading the rejected result. This runs after
  // the failed render is over, which is what lazyPreload requires, and it is
  // idempotent, so React repeating it costs nothing.
  static getDerivedStateFromProps(props, state) {
    if (props.resetKey !== state.resetKey) {
      retryFailedRoutes();
      return { failed: false, resetKey: props.resetKey };
    }
    return null;
  }

  render() {
    return this.state.failed ? <RouteErrorFallback /> : this.props.children;
  }
}

// The last line of defence around the whole app, for an error nothing else
// caught (the navbar, a context provider, the router). Everything it would
// normally lean on may be what broke, so it uses no translations, no theme
// context and no router: fixed English, plain links, and the base
// stylesheet, which main.jsx loads before the app.
export class RootErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="fatal" lang="en">
        <h1>Something went wrong</h1>
        <p>
          This page hit an error it could not recover from. Reloading usually
          fixes it.
        </p>
        <p>
          <button type="button" className="btn btn--primary" onClick={reload}>
            Reload the page
          </button>
        </p>
        <p>
          You can still{" "}
          <a href="/Zariff-Danial-Resume.pdf">download my resume (PDF)</a> or
          email me at{" "}
          <a href="mailto:zariffdanial.zul@gmail.com">
            zariffdanial.zul@gmail.com
          </a>
          .
        </p>
      </main>
    );
  }
}

export default RouteErrorBoundary;
