import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { SIGNIN_ROUTE, ROUTES, SIGNUP_ROUTE } from "./routeConstants";
import { getFromLocalStorage } from "utils/storage";
import { registerIntercepts, setAuthHeaders } from "apis/axois";

const router = createBrowserRouter(ROUTES);

function App() {
  const pathname = window.location.pathname;
  const isLoggedIn = Boolean(getFromLocalStorage("apiKey"));
  const isAuthPage = pathname.includes(SIGNIN_ROUTE) || pathname.includes(SIGNUP_ROUTE);

  useEffect(() => {
    registerIntercepts();
    setAuthHeaders();
  },[]);

  if (!isLoggedIn && !isAuthPage) {
    router.navigate(SIGNIN_ROUTE);
  }

  return <RouterProvider router={router} />;
}

export default App;
