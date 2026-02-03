import NotFound from "./commons/NotFound";

import { redirect } from "react-router-dom";
import Ticket from "./Ticket";
import SignIn from "./SignIn";

export const HOME_ROUTE = "/";
export const TICKET_ROUTE = "/ticket";
export const SIGNIN_ROUTE = "/signin";
export const SIGNUP_ROUTE = "/signup";

export const ROUTES = [
  {
    path: HOME_ROUTE,
    loader: () => redirect(TICKET_ROUTE),
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
    path: TICKET_ROUTE,
    element: <Ticket />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
