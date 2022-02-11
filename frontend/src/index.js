import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { LinearProgress } from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";
import { RecoilRoot } from "recoil";

ReactDOM.render(
  <ErrorBoundary fallback={<div>Error loading data</div>}>
    <Suspense fallback={<LinearProgress />}>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </Suspense>
  </ErrorBoundary>,
  document.getElementById("root")
);
