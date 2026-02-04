import { STREAM_EVENTS, STREAM_STATUSES } from "constants";
import { getFromLocalStorage } from "utils/storage";

import { BASE_URL } from "./constants";

export const streamResponse = ({ticketId, setStatus, setError, setResponse, eventSourceRef}) => {
  const URL = `${BASE_URL}/tickets/${ticketId}/response`;
  const API_KEY = getFromLocalStorage("apiKey");

  setStatus(STREAM_STATUSES.connecting);
  setError(null);
  setResponse("");

  const eventSource = new EventSource(URL, { headers: { "X-Api-Key": API_KEY } });

  eventSourceRef.current = eventSource;

  eventSource.onopen = () => setStatus(STREAM_STATUSES.streaming);

  eventSource.onmessage = (event) => {
    setStatus(STREAM_STATUSES.streaming);
    setResponse(prev => prev + event.data);
  };

  eventSource.addEventListener(STREAM_EVENTS.done, () => {
    setStatus(STREAM_STATUSES.complete);
    eventSource.close();
  });


  eventSource.addEventListener(STREAM_EVENTS.error, (event) => {
    setError(event.data || "Something went wrong!");
    setStatus(STREAM_STATUSES.error);
    eventSource.close();
  });

  eventSource.onerror = () => {
    setError("Failed to connect to AI service. Please try again.");
    setStatus(STREAM_STATUSES.error);
    eventSource.close();
  };
};
