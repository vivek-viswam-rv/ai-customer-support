import { Button } from "shadcn/button";

const Problem = ({ problemDescription, setShouldShowResponse }) => (
  <div className="flex-1 flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
    <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
      <h2 className="text-lg font-semibold text-gray-900">Your issue</h2>
    </div>
    <div className="flex-1 overflow-auto p-6">
      <p className="text-gray-700 whitespace-pre-wrap">{problemDescription}</p>
    </div>
    <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
      <Button
        onClick={() => setShouldShowResponse(false)}
        className="w-full button-primary"
      >
        Change your problem description
      </Button>
    </div>
  </div>
);

export default Problem;
