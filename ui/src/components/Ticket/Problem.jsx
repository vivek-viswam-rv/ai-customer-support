import { useNavigate } from "react-router-dom";

import { Button } from "shadcn/button";
import { TICKETS_ROUTE } from "../routeConstants";

const Problem = ({ problemDescription, isStreaming }) => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">Your issue</h2>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <p className="text-gray-700 whitespace-pre-wrap">
          {problemDescription}
        </p>
      </div>
      <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
        <Button
          disabled={isStreaming}
          onClick={() => navigate(TICKETS_ROUTE)}
          className="w-full button-primary"
        >
          Create new ticket
        </Button>
      </div>
    </div>
  );
};

export default Problem;
