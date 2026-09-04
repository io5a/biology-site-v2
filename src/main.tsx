import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "../styles/globals.css";
import "./index.css";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";


export default function ScrollToTop() {
  const pathName = useLocation();

  // This effect runs whenever the path name changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathName]);

  return null;
}



ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
        <ScrollToTop />
        <App />
    </BrowserRouter>
  </React.StrictMode>,
);
