"use client"

import React, { useEffect, useState } from "react";
// import { letGet, letPost } from "./Utility/Server";

export default function Home() {
  const [items, setItems] = useState([
    { description: "", comm: 0, fare: 0, quantity: 1, price: 0 },
  ]);
  const [clientName, setClientName] = useState("");
  const [notes, setNotes] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allClients, setAllClients] = useState([]);
  const [allStocks, setAllStocks] = useState([]); // Store fetched stock names
  const [suggestions1, setSuggestions1] = useState([]);
  const [billNo, setBillNo] = useState(1);
  const [loading, setLoading] = useState(false);
  const [activeInputIndex, setActiveInputIndex] = useState(null);
  const [fare, setFare] = useState(true);
  const [paid, setPaid] = useState(0); // Paid amount
  const [balance, setBalance] = useState(0); // Client balance
  let CommFare ;
  let clear = false;
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(today.getDate()).padStart(2, "0"); // Ensure 2 digits
    return `${year}-${month}-${day}`;
  };

  // const [dueDate, setDueDate] = useState(getTodayDate());
  const [invoiceDate, setInvoiceDate] = useState(getTodayDate());
  console.log(invoiceDate);

  // Dummy backend fetch simulation
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // const response = await letGet("/clients/all");
        // const response2 = await letGet(`/stocks/date/${invoiceDate}`);
        console.log(response);

        setAllClients(response || []);
        setAllStocks(response2.fruits || [] );
        // console.log(allStocks);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [invoiceDate]);
  const handleInputChange = (e) => {
    const input = e.target.value;
    setClientName(input);

    // Filter suggestions based on input
    const filtered = allClients.filter(
      (client) => client.name.toLowerCase().startsWith(input.toLowerCase()) // Match by name
    );
    setSuggestions(filtered);
  };

  const handleSuggestionClick = (client) => {
    setClientName(client.name);
    setBalance(client.balance);
    setSuggestions([]);
    console.log(`Remaining balance: ${client.balance}`);
  };

  const handleSubmit1 = async () => {
    // If the input is a new name, add it to the database
    if (!allClients.includes(clientName)) {
      // Replace with actual API call to add a new client
      console.log("Adding new client:", clientName);
    }
  };

  // console.log(dueDate);

  // Initialize state with today's date

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, price: 0 }]);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    CommFare = items.reduce(
      (total, item) => total + (item.comm || 0) + (item.fare || 0),
      0
    );
    
    const itemsTotal = items.reduce((total, item) => total + (((item.comm || 0) + (item.fare || 0)+  (item.price || 0)) * (item.quantity|| 0)), 0);
    return itemsTotal + (balance||0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const invoice = {
      billNo,
      clientName,
      invoiceDate,
      balance,
      paid,
      items,
      notes,
      CommFare,
      total: calculateTotal(),
    };
    const senData = async () => {
      setLoading(true);
      try {
        const response = await letPost("/invoices/add" , invoice);
        console.log(response);
        alert("Invoice created successfully!");
        // console.log(allStocks);
      } catch (error) {
        alert("Failed to create invoice.");
      } finally {
        setLoading(false);
      }
    };
    senData();
    console.log("Invoice Created:", invoice);
  };

  let time = new Date();
  console.log(time);

  const addItem1 = () => {
    setItems([...items, { description: "", quantity: 1, price: 0 }]);
  };

  const removeItem1 = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem1 = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);

    // Show suggestions dynamically for 'description'
    if (field === "description" && activeInputIndex === index) {
      const filtered =
        value === ""
          ? allStocks // Show all stocks when input is empty
          : allStocks.filter((stock) =>
              stock.name.toLowerCase().startsWith(value.toLowerCase())
            );
      setSuggestions1(filtered);
    }
  };

  const handleSuggestionClick1 = (index, suggestion) => {
    const updatedItems = [...items];
    updatedItems[index].description = suggestion.name; // Update description
    updatedItems[index].price = suggestion.quantity; // Update price dynamically
    setItems(updatedItems);
    setSuggestions1([]); // Clear suggestions
  };
  const handleInputFocus1 = (index) => {
    setActiveInputIndex(index);
    setSuggestions1(allStocks); // Show all stocks initially
  };

  const handleInputBlur1 = () => {
    setTimeout(() => {
      setSuggestions1([]); // Clear suggestions
      setActiveInputIndex(null); // Reset active input index
    }, 100); // Delay to allow suggestion click
  };

  const handleInputFocus = () => {
    setSuggestions(allClients); // Show all initially
    console.log(suggestions);
    console.log(allClients);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setSuggestions([]); // Clear suggestions
    }, 100); // Delay to allow suggestion click
  };

  const handleFareChange = () => {
    setFare((prevFare) => !prevFare);
  
    setItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        comm: !fare ? item.comm : 0, // Reset or retain commission dynamically
        fare: !fare ? item.fare : 0, // Reset or retain fare dynamically
      }))
    );
  };

  
  

  return (
    <div>
      {/* {loadin/>} Show loader while loading */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Create Invoice</h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="status" className="block font-medium">
                Bill No:
              </label>
              <input
                type="number"
                id="status"
                value={billNo}
                className="w-full p-2 border rounded"
                onChange={(e) => setBillNo(parseFloat(e.target.value))}
              />
            </div>

            <div>
              <label htmlFor="InvoiceDate" className="block font-medium">
                Invoice Date
              </label>
              <input
                id="InvoiceDate"
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label
                htmlFor="clientName"
                className="block font-medium relative"
              >
                Client Name
              </label>
              <input
                id="clientName"
                type="text"
                placeholder="Enter client name"
                value={clientName}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                autoComplete="off"
              />

              {suggestions && (
                <ul className="border mt-1 rounded bg-white absolute z-10 max-h-56 overflow-y-auto">
                  {suggestions.map((client, index) => (
                    <li
                      key={index}
                      onClick={() => handleSuggestionClick(client)}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                    >
                      {client.name} {/* Render client name */}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="h-full flex items-center content-center ">
              <input
                id="fare"
                type="checkbox"
                className="w-10"
                checked={fare} // Bind checked attribute to fare state
                onChange={handleFareChange} // Update state on change
              />
              <label>Commission + Fare</label>
            </div>
          </div>
          <div className="">
            <label className="font-medium flex  space-x-2   mt-2  ">
              <span className="flex w-[78%] p-2">Invoice Item </span>
              {/* <span className='w-20 p-2  '>Qty </span>
        <span className='w-24 p-2 '>Price</span> */}
            </label>
            {items.map((item, index) => (
              <div key={index} className="flex flex-col   mt-2 ">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) =>
                      updateItem1(index, "description", e.target.value)
                    }
                    onFocus={() => handleInputFocus1(index)}
                    onBlur={handleInputBlur1}
                    className="flex-1 p-2 border rounded relative"
                    autoComplete="off"
                  />

                  {fare && (
                    <input
                      type="number"
                      placeholder="Comm"
                      value={item.comm}
                      onChange={(e) =>
                        updateItem1(index, "comm", parseFloat(e.target.value))
                      }
                      className="w-24 p-2 border rounded"
                    />
                  )}
                  {fare && (
                    <input
                      type="number"
                      placeholder="fare"
                      value={item.fare}
                      onChange={(e) =>
                        updateItem1(index, "fare", parseFloat(e.target.value))
                      }
                      className="w-24 p-2 border rounded"
                    />
                  )}

                  <input
                    type="number"
                    placeholder="Quantity"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem1(
                        index,
                        "quantity",
                        parseInt(e.target.value, 10)
                      )
                    }
                    className="w-20 p-2 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={item.price}
                    onChange={(e) =>
                      updateItem1(index, "price", parseFloat(e.target.value))
                    }
                    className="w-24 p-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem1(index)}
                    className="p-2 text-white bg-red-500 rounded"
                  >
                    Remove
                  </button>
                </div>
                {suggestions1 && (
                  <ul className="border mt-10 rounded bg-white absolute z-10 ">
                    {activeInputIndex === index && suggestions1.length > 0 && (
                      <ul className="border  rounded bg-white absolute z-10">
                        {suggestions1.map((suggestion, i) => (
                          <li
                            key={i}
                            onClick={() =>
                              handleSuggestionClick1(index, suggestion)
                            }
                            className="p-2 cursor-pointer hover:bg-gray-200"
                          >
                            {suggestion.name} (Price: {suggestion.quantity})
                          </li>
                        ))}
                      </ul>
                    )}
                  </ul>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addItem1}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Add Item
            </button>
          </div>
          <div className="flex items-center">
        <div className="mt-2 mr-4">
          <label htmlFor="balance" className= { `font-medium ${balance >=0 ? "text-green-700 " : "text-red-700"}`}  >
            Balance
          </label>
          <input
            id="balance"
            type="number"
            value={balance}
            className="w-full p-2 border rounded"
          />
        </div>
     
      <div className="mt-2">
        <label htmlFor="paid" className="font-medium text-green-600">
          Paid Amount
        </label>
        <input
          id="paid"
          type="number"
          placeholder="Enter paid amount"
          value={paid}
          onChange={(e) => setPaid(parseFloat(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>
      {/* <div className=" flex items-center content-center border ">
              <input
                id="clear"
                type="checkbox"
                className="w-10"
                checked={clear} // Bind checked attribute to fare state
                onChange={clearFunction} // Update state on change
              />
              <label>Clear Bill</label>
            </div> */}

      </div>


          <div>
            <label htmlFor="notes" className="block font-medium">
              Notes
            </label>
            <textarea
              id="notes"
              placeholder="Enter any additional notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="text-right">
            <p className="text-xl font-bold">
              Total: ₹ {calculateTotal().toFixed(2)}
            </p>
            <p className="text-xl font-bold text-blue-500">
              New Balance: ₹ {(calculateTotal() - paid).toFixed(2)}
            </p>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 border rounded bg-gray-200"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-green-500 rounded"
            >
              Create Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}