import { createRoot } from "react-dom/client";
import "./styles.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AppRoutes from "./routes/AppRoutes.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <>
    <AppRoutes />
    <ToastContainer />
  </>
  // </StrictMode>,
);
