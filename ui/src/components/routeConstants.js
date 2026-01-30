
import NotFound from "./commons/NotFound";
import Login from "./Login";

export const LOGIN_ROUTE = "/login";

export const ROUTES = [
  {
    path: LOGIN_ROUTE,
    element: Login(),
  },
  {
    path: "*",
    element: NotFound(),
  },
];
