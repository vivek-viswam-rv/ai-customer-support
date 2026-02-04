import { createRoot } from "react-dom/client";

import "./index.css";
import App from "components/App.jsx";
import { Toaster } from "shadcn/sonner.jsx";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "utils/queryClient.js";

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <Toaster position="bottom-left" />
  </QueryClientProvider>
);
