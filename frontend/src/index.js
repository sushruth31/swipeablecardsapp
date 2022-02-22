import { Suspense } from "react";
import ReactDOM from "react-dom";
import { LinearProgress } from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";
import { RecoilRoot } from "recoil";
import { App } from "./App";
import "./index.css";

const Failed = () => <div className="p-6">Could not reach the card API. Is `npm run api` running?</div>;

ReactDOM.render(
  <RecoilRoot>
    <ErrorBoundary FallbackComponent={Failed}>
      <Suspense fallback={<LinearProgress />}>
        <App />
      </Suspense>
    </ErrorBoundary>
  </RecoilRoot>,
  document.getElementById("root")
);
