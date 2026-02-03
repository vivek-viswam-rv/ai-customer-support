import { QUERY_KEYS } from "@/constants/query";
import { useMutation, useQuery } from "@tanstack/react-query";
import ticketsApi from "apis/tickets";

export const useFetchTicket = id =>
  useQuery([QUERY_KEYS.TICKETS, id], {
    queryFn: () => ticketsApi.fetch(id),
  });

export const useCreateTicket = onSuccessHandler =>
  useMutation(ticketsApi.create, {
    onSuccess: onSuccessHandler,
  });
