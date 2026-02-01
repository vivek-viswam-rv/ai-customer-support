
import NotFound from "./commons/NotFound";

import { redirect } from "react-router-dom";
import Ticket from "./Ticket";
import Login from "./Login";

export const HOME_ROUTE = "/";
export const TICKET_ROUTE = "/ticket";
export const LOGIN_ROUTE = "/login";

export const ROUTES = [
  {
    path: HOME_ROUTE,
    loader: () => redirect(TICKET_ROUTE),
  },
  {
    path: LOGIN_ROUTE,
    element: <Login />,
  },
  {
    path: TICKET_ROUTE,
    element: <Ticket />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
