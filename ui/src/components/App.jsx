import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { LOGIN_ROUTE, ROUTES } from "./routeConstants";
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

  if (!isLoggedIn && !pathname.includes(LOGIN_ROUTE)) {
    router.navigate(LOGIN_ROUTE);
  }

  return <RouterProvider router={router} />;
}

export default App;
