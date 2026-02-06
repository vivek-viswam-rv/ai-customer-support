const Description = () => (
  <div className="flex items-center justify-center mt-10 space-y-2 flex-col">
    <p className="text-gray-600">
      Describe your issue below, and the AI assistant will help you resolve it.
    </p>
    <div className="text-gray-500  max-w-2xl text-sm">
      Given below is a list of your past purchases:
      <ol className="pl-5 list-decimal mb-1">
        <li>Wireless Mouse - Delivered</li>
        <li>Bluetooth Headphones - Refunded</li>
        <li>USB-C Charger - Returned</li>
      </ol>
      <p>
        You may ask about order status, request return and refund and the
        responses will be based on the return policy and database records of these
        orders. The agent has the ability to update those records as needed.
      </p>
      <p className="mt-2">
        <b>Things to try:</b>
        <ol className="pl-5 list-disc">
          <li>Request for a refund for the Bluetooth Headphones (which was already refunded) to see how the agent handles such scenarios.</li>
          <li>Or ask about return/refund/delivery details.</li>
          <li>You can even ask the agent to help you return the USB-C Charger.</li>
        </ol>
      </p>
    </div>
  </div>
);

export default Description;
