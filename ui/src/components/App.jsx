import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { SIGNIN_ROUTE, ROUTES, SIGNUP_ROUTE } from "./routeConstants";
import Header from "./commons/Header";
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

  return (
    <div className="flex h-svh flex-col">
      <Header />
      <main className="min-h-0 flex-1 overflow-auto">
        <RouterProvider router={router} />
      </main>
    </div>
  );
}

export default App;
