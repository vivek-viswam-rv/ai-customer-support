import NotFound from "./commons/NotFound";

import { redirect } from "react-router-dom";
import Ticket from "./Ticket";
import SignIn from "./SignIn";
import Response from "./Ticket/Response";

export const HOME_ROUTE = "/";
export const TICKETS_ROUTE = "/tickets/new";
export const TICKETS_RESPONSE_ROUTE = "/tickets/:ticketId";
export const SIGNIN_ROUTE = "/signin";
export const SIGNUP_ROUTE = "/signup";

export const ROUTES = [
  {
    path: HOME_ROUTE,
    loader: () => redirect(TICKETS_ROUTE),
  },
  {
    path: SIGNIN_ROUTE,
    element: <SignIn />,
  },
  {
    path: SIGNUP_ROUTE,
    element: <SignIn />,
  },
  {
    path: TICKETS_ROUTE,
    element: <Ticket />,
  },
  {
    path: TICKETS_RESPONSE_ROUTE,
    element: <Response />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
