
import NotFound from "./commons/NotFound";

import { redirect } from "react-router-dom";
import Ticket from "./Ticket";

export const HOME_ROUTE = "/";
export const TICKET_ROUTE = "/ticket";

export const ROUTES = [
  {
    path: HOME_ROUTE,
    loader: () => redirect(TICKET_ROUTE),
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
