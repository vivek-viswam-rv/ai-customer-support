const Description = () => (
  <div className="flex items-center justify-center mt-10 space-y-2 flex-col">
    <p className="text-gray-600">
      Describe your issue below, and our AI assistant will help resolve it.
    </p>
    <p className="text-gray-500  max-w-2xl text-sm">
      Write this like an email to Amazon Customer Support about an order issue.
      Below is a list of your past purchases:
      <br />
      <ol className="pl-5 list-decimal">
        <li>Wireless Mouse</li>
        <li>Bluetooth Headphones</li>
        <li>USB-C Charger</li>
      </ol>
    </p>
  </div>
);

export default Description;
