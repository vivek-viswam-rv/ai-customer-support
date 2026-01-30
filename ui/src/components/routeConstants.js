
import NotFound from "./commons/NotFound";
import Login from "./Login";

import { redirect } from "react-router-dom";

export const HOME_ROUTE = "/";
export const LOGIN_ROUTE = "/login";

export const ROUTES = [
  {
    path: HOME_ROUTE,
    loader: () => redirect(LOGIN_ROUTE),
  },
  {
    path: LOGIN_ROUTE,
    element: Login(),
  },
  {
    path: "*",
    element: NotFound(),
  },
];
