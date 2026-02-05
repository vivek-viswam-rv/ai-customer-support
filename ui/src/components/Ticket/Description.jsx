const Description = () => (
  <div className="flex items-center justify-center mt-10 space-y-2 flex-col">
    <p className="text-gray-600">
      Describe your issue below, and our AI assistant will help resolve it.
    </p>
    <div className="text-gray-500  max-w-2xl text-sm">
      <p>
        Write this like an email to Amazon Customer Support about an order
        issue. Below is a list of your past purchases:
        <br />
      </p>
      <ol className="pl-5 list-decimal mb-1">
        <li>Wireless Mouse - Delivered</li>
        <li>Bluetooth Headphones - Refunded</li>
        <li>USB-C Charger - Returned</li>
      </ol>
      You may ask about order status, request return and refund and the
      responses will be based on the return policy and database records of these
      orders. The agent has the ability to update those records as needed.
    </div>
  </div>
);

export default Description;
