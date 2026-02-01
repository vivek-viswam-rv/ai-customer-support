import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./components/App.jsx";
import { Toaster } from "shadcn/sonner.jsx";

createRoot(document.getElementById("root")).render(
  <>
    <App />
    <Toaster position="bottom-left" />
  </>
);
