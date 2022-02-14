import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { LinearProgress } from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";
import { RecoilRoot } from "recoil";

ReactDOM.render(
  <RecoilRoot>
    <ErrorBoundary fallback={<div>Error loading data</div>}>
      <Suspense fallback={<LinearProgress />}>
        <App />
      </Suspense>
    </ErrorBoundary>
  </RecoilRoot>,
  document.getElementById("root")
);
