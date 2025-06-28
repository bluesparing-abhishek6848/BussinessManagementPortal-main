import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./store/index.ts";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HelmetProvider } from 'react-helmet-async';
createRoot(document.getElementById("root")!).render(
  <StrictMode>
        <HelmetProvider>
    <BrowserRouter>

      <Provider store={store}>
          <App />

      </Provider>
    </BrowserRouter>
        </HelmetProvider>
    <ToastContainer position="top-right" autoClose={3000} />
  </StrictMode>
);
