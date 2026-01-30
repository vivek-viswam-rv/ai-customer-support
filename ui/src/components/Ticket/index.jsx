import Description from "./Description";
import UserInput from "./UserInput";
import { useState } from "react";

function Ticket() {
  const [problemDescription, setProblemDescription] = useState("");

  return (
    <>
      {!problemDescription ? (
        <>
          <Description />
          <UserInput setProblemDescription={setProblemDescription} />
        </>
      ) : (
        <textarea
          value={problemDescription}
          readOnly
          className="w-full max-w-3xl mx-auto p-6 mt-6 rounded-lg border border-gray-300 bg-gray-100 text-gray-900 resize-none"
        />
      )}
    </>
  );
}

export default Ticket;
