
"use client"
import React from "react";
// import Invoice1 from "../components/DwnBtn";
// import InvoicePreview from "../components/DwnBtn";
import InvoicePage from "../components/DwnBtn";


const App: React.FC = () => {
  // Example items in the invoice
  const items = [
    { name: "Apple", price: 1.99, quantity: 3 },
    { name: "Banana", price: 0.99, quantity: 5 },
    { name: "Orange", price: 1.49, quantity: 2 },
  ];

  // Calculate total from the items
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
   <InvoicePage/>
  );
};

export default App;
