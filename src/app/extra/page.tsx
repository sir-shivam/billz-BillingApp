"use client"

import React, { useEffect, useState } from "react";
// import { letGet, letPost } from "./Utility/Server";

export default function Home() {
  const [items, setItems] = useState([
    { description: "", comm: 0, fare: 0, quantity: 1, price: 0 , itemTotal: 0 },
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
    <div >
      {/* {loadin/>} Show loader while loading */}
      <div className="w-full sm:mx-auto sm:px-4 sm:py-8 sm:bg-gradient-to-br sm:from-white sm:via-gray-50 sm:to-gray-100 sm:bg-opacity-60 sm:backdrop-blur-md sm:rounded-lg sm:border sm:border-gray-400 sm:border-opacity-30 sm:shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Create Invoice</h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="status" className="block font-medium">
                Bill No:
              </label>
              <input
                type="number"
                id="status"
                value={billNo}
                className="w-full p-2 border rounded text-black"
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
                className="w-full p-2 border rounded text-black"
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
                className="w-full p-2 border rounded text-black"
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
                className="w-10 text-black"
                checked={fare} // Bind checked attribute to fare state
                onChange={handleFareChange} // Update state on change
              />
              <label>Commission + Fare</label>
            </div>
          </div>
          <div className="">
            <label className="font-medium flex  space-x-2   mt-2  ">
              <span className="flex w-[78%] p-2">Invoice Item </span>
              <button
              type="button"
              onClick={addItem1}
              className=" px-4 py-2 bg-blue-500 text-white rounded"
            >
              +
            </button>
              {/* <span className='w-20 p-2  '>Qty </span>
        <span className='w-24 p-2 '>Price</span> */}
            </label>
            {items.map((item, index) => (
              <div key={index} className="  flex flex-col mt-2 bg-gray-200 py-1 rounded-md ">
                {/* <div className="flex space-x-2  border items-center ">
                  <div className="">
                  <input
                    type="text"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) =>
                      updateItem1(index, "description", e.target.value)
                    }
                    onFocus={() => handleInputFocus1(index)}
                    onBlur={handleInputBlur1}
                    className=" p-2 border rounded relative"
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
                      className="w-24 p-2 border rounded text-black"
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
                      className="w-24 p-2 border rounded text-black"
                    />
                  )}
                  </div>
                  
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
                    className=" p-2 border rounded text-black"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={item.price}
                    onChange={(e) =>
                      updateItem1(index, "price", parseFloat(e.target.value))
                    }
                    className=" p-2 border rounded text-black"
                  />
                 
                  <input
                    type="number"
                    placeholder="total"
                    value={item.itemTotal}
                    readOnly
                    onChange={(e) =>
                      updateItem1(index, "price", parseFloat(e.target.value))
                    }
                    className=" p-2 border rounded text-black"
                  />
                 
                  <button
                    type="button"
                    onClick={() => removeItem1(index)}
                    className=" px-2 text-white bg-red-500 rounded h-1/3"
                  >
                    -
                  </button>
                </div> */}
                <div className="container1 flex space-x-2 border items-center">
  <div className="flex flex-col w-[50%]">
    <label htmlFor={`desc-${index}`} className="text-sm text-gray-700">
      Item
    </label>
    <input
      id={`desc-${index}`}
      type="text"
      placeholder="Description"
      value={item.description}
      onChange={(e) =>
        updateItem1(index, "description", e.target.value)
      }
      onFocus={() => handleInputFocus1(index)}
      onBlur={handleInputBlur1}
      className="py-2 pl-2 border rounded text-black"
      autoComplete="off"
    />
  </div>

  <div className="flex flex-col w-[22%]">
    <label htmlFor={`quantity-${index}`} className="text-sm text-gray-700">
      Quantity
    </label>
    <input
      id={`quantity-${index}`}
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
      className="p-2 border rounded text-black"
    />
  </div>

  <div className="flex flex-col w-[22%]">
    <label htmlFor={`price-${index}`} className="text-sm text-gray-700">
      Price
    </label>
    <input
      id={`price-${index}`}
      type="number"
      placeholder="Price"
      value={item.price}
      onChange={(e) =>
        updateItem1(index, "price", parseFloat(e.target.value))
      }
      className="p-2 border rounded text-black"
    />
  </div>
</div>

<div className="container2 flex space-x-2 items-center">
  <div className="flex flex-col max-w-[25%]">
    <label htmlFor={`commission-${index}`} className="text-sm text-gray-700">
      Commission
    </label>
    <input
      id={`commission-${index}`}
      type="number"
      placeholder="Commission"
      value={item.comm}
      onChange={(e) =>
        updateItem1(index, "comm", parseFloat(e.target.value))
      }
      className="p-2 border rounded text-black"
    />
  </div>

  <div className="flex flex-col max-w-[25%]">
    <label htmlFor={`fare-${index}`} className="text-sm text-gray-700">
      Fare
    </label>
    <input
      id={`fare-${index}`}
      type="number"
      placeholder="Fare"
      value={item.fare}
      onChange={(e) =>
        updateItem1(index, "fare", parseFloat(e.target.value))
      }
      className="p-2 border rounded text-black"
    />
  </div>

  <div className="flex flex-col max-w-[30%]">
    <label htmlFor={`itemTotal-${index}`} className="text-sm text-gray-700">
      Item Total
    </label>
    <input
      id={`itemTotal-${index}`}
      type="number"
      placeholder="Item Total"
      value={item.itemTotal}
      onChange={(e) =>
        updateItem1(index, "itemTotal", parseFloat(e.target.value))
      }
      className="p-2 border rounded text-black"
      readOnly
    />
  </div>

  <button
    type="button"
    onClick={() => removeItem1(index)}
    className="px-2 mb-[2%] text-white bg-red-500 rounded h-2/3 self-end"
  >
    -
  </button>
</div>

                  
                  {/* <hr className=" border-gray-500 mt-1 border-dashed" /> */}

              </div>
            ))}
            <button
              type="button"
              onClick={addItem1}
              className="mt-2 px-4 hidden py-2 bg-blue-500 text-white rounded"
            >
              +
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
            className="w-full p-2 border rounded text-black"
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
          className="w-full p-2 border rounded text-black"
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