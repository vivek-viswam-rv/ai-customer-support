import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { SIGNIN_ROUTE, ROUTES } from "./routeConstants";
import { getFromLocalStorage } from "utils/storage";
import { registerIntercepts, setAuthHeaders } from "apis/axois";

const router = createBrowserRouter(ROUTES);

function App() {
  const pathname = window.location.pathname;
  const isLoggedIn = Boolean(getFromLocalStorage("apiKey"));

  useEffect(() => {
    registerIntercepts();
    setAuthHeaders();
  },[]);

  if (!isLoggedIn && !pathname.includes(SIGNIN_ROUTE)) {
    router.navigate(SIGNIN_ROUTE);
  }

  return <RouterProvider router={router} />;
}

export default App;
