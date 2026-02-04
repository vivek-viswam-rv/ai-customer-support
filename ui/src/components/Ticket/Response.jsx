import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { useFetchTicket } from "hooks/reactQuery/useTicketsApi";

import Problem from "./Problem";
import { STREAM_STATUSES } from "constants";
import { streamResponse } from "apis/stream";

export function Response() {
  const [response, setResponse] = useState("");
  const [status, setStatus] = useState(STREAM_STATUSES.idle);
  const [error, setError] = useState(null);
  const eventSourceRef = useRef(null);

  const stopStreaming = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      setStatus(STREAM_STATUSES.complete);
    }
  };

  const { ticketId } = useParams();
  const { isLoading, data, isSuccess } = useFetchTicket(ticketId);

  useEffect(() => {
    if (!isSuccess) return;
    streamResponse({ ticketId, setStatus, setError, setResponse, eventSourceRef });

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [isSuccess]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="flex h-screen gap-6 p-6 bg-gray-50">
      <Problem
        problemDescription={
          data?.data?.description || "Couldn't fetch problem description!"
        }
      />

      <div className="flex-1 flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">AI Response</h2>
          {status === STREAM_STATUSES.streaming && (
            <button
              onClick={stopStreaming}
              className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
            >
              Stop
            </button>
          )}
        </div>
        <div className="flex-1 overflow-auto p-6">
          {status === STREAM_STATUSES.idle && !response && (
            <p className="text-gray-400 italic">
              AI response will appear here!
            </p>
          )}

          {status === STREAM_STATUSES.connecting && (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="size-4 animate-spin" />
              <p>Connecting to AI agent...</p>
            </div>
          )}

          {status === STREAM_STATUSES.streaming && !response && (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="size-4 animate-spin" />
              <p>AI agent is thinking...</p>
            </div>
          )}

          {status === STREAM_STATUSES.streaming && response && (
            <div>
              <p className="text-gray-700 whitespace-pre-wrap">
                {response}
                <span className="inline-block w-0.5 h-3.5 bg-gray-700 animate-pulse ml-1"></span>
              </p>
            </div>
          )}

          {status === STREAM_STATUSES.complete && response && (
            <p className="text-gray-700 whitespace-pre-wrap">{response}</p>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">Error: {error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Response;
