  "use client"

  import React, { useEffect,FormEvent, useState } from "react";
  import axios from "axios";
  import { Dispatch, SetStateAction } from "react";
  import DownloadButton from "../components/Downloadbttn";
import InvoicePage from "../components/DwnBtn";
  // import { letGet, letPost } from "./Utility/Server";
  interface Item {
    description: string;
    comm: number;
    fare: number;
    quantity: number;
    price: number;
    eachItemTotal: number;
    carat: number;
    perCarat: number;
  }

  export default function Home() {
    const [items, setItems] = useState<Item[]>([
      { description: "", comm: 0, fare: 0, quantity: 1, price: 0 , eachItemTotal: 0 , carat:0 , perCarat:0 },
    ]);
    const [clientName, setClientName] = useState<string>("");
    const [notes, setNotes] = useState<string>("");
    const [suggestions, setSuggestions] = useState([]);
    const [allClients, setAllClients] = useState([]);
    const [allStocks, setAllStocks] = useState([]); // Store fetched stock names
    const [suggestions1, setSuggestions1] = useState([]);
    const [billNo, setBillNo] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [activeInputIndex, setActiveInputIndex] = useState(null);
    const [fare, setFare] = useState<boolean>(true);
    const [paid, setPaid] = useState<number>(0); // Paid amount
    const [billTotal , setBillTotal] = useState<number>(0);
    const [invoiceDate, setInvoiceDate] = useState("");
    const [showInvoice , setShowInvoice] = useState(false);
    let num = 1;
    const [balance, setBalance] = useState<number>(0); // Client balance
    let CommFare:Number ;
    let clear = false;
    const getTodayDate = () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      const day = String(today.getDate()).padStart(2, "0"); // Ensure 2 digits
      setInvoiceDate(`${year}-${month}-${day}`);
    };

    useEffect(()=>{
      getTodayDate();
    },[])

    // const [dueDate, setDueDate] = useState(getTodayDate());
    

    const handleInputChange = (e) => {
      const input = e.target.value;
      setClientName(input);
    };

    
    useEffect(() => {
      console.log(`changedd  ${num++} `)
      updateItemsAndTotal();
    }, [items]);
    
    const updateItemsAndTotal = () => {
      const updatedItems = items.map(item => {
        const perCarat = ((((item.comm || 0) + (item.fare || 0)) + ((item.price || 0)) * (item.quantity || 0)));
        const eachItemTotal = (item.carat || 0) * ((((item.comm || 0) + (item.fare || 0)) + ((item.price || 0)) * (item.quantity || 0)));
        return { ...item, eachItemTotal, perCarat };
      });
    
      const billTotal = updatedItems.reduce((total, item) => total + item.eachItemTotal, 0);
    
      // Only update if items have actually changed
      const hasChanged = JSON.stringify(items) !== JSON.stringify(updatedItems);
      if (hasChanged) {
        setItems(updatedItems);
      }
    
      setBillTotal(billTotal); // Update billTotal regardless
    };
    
    
    

  
    interface InvoiceDetails {
      billNo: number;
      clientName: string;
      invoiceDate: string;
      balance: number;
      paid: number;
      items: Item[];
      notes: string;
      total: number;
    }
    
    const invoiceDetail: InvoiceDetails = {
        billNo,
        clientName,
        invoiceDate,
        balance,
        paid,
        items,
        notes,
        total: billTotal,
      };

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
      e.preventDefault();
      
      

      const senData = async (): Promise<void> => {
        setLoading(true);
        try {
          const response = await axios.post("/api/invoices/add", invoiceDetail);
          console.log(response.data); // Log response
          alert("Invoice created successfully!");
        } catch (error: any) {
          console.error("Error creating invoice:", error.response?.data || error.message);
          alert("Failed to create invoice.");
        } finally {
          setLoading(false);
        }
      };

    senData();
    console.log("Invoice Created:", invoiceDetail);
    };


    const addItem1 = () => {
      setItems([...items, { description: "", comm: 0, fare: 0, quantity: 1, price: 0, eachItemTotal: 0, carat: 0, perCarat: 0 }]);
    };

    const removeItem1 = (index: number) => {
      setItems(items.filter((_, i) => i !== index));
    };

    const updateItem1 = (index: number, field: keyof Item, value: string | number) => {
      const updatedItems = [...items];
      updatedItems[index][field] = value;
      setItems(updatedItems);
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
    // const invoiceDetail = {
    //   billNo: "INV123",
    //   clientName: "John Doe",
    //   invoiceDate: "2024-12-26",
    //   balance: 500,
    //   paid: 1000,
    //   items: [
    //     {
    //       description: "Gold Ring",
    //       comm: 5,
    //       fare: 10,
    //       quantity: 2,
    //       price: 2000,
    //       eachItemTotal: 4000,
    //       carat: 22,
    //       perCarat: 100,
    //     },
    //     // Add more items as needed
    //   ],
    //   notes: "Thank you for your business!",
    //   total: 1500,
    // };

    const showIn = () =>{
      if(showInvoice){
        setShowInvoice(false)
      }
      else{
        setShowInvoice(true)
      }
    }

    
    

    return (
      <div >

        {/* {loadin/>} Show loader while loading */}
        <div className="w-full sm:mx-auto sm:px-4 sm:py-8 sm:bg-gradient-to-br sm:from-white sm:via-gray-50 sm:to-gray-100 sm:bg-opacity-60 sm:backdrop-blur-md sm:rounded-lg sm:border sm:border-gray-400 sm:border-opacity-30 sm:shadow-lg ">
        {showInvoice && <InvoicePage invoiceDetail={invoiceDetail} butFun={showIn}  />}

          <h1 className="text-3xl font-bold mb-6 sm:text-black">Create Invoice</h1>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="status" className="block font-medium sm:text-black">
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
                <label htmlFor="InvoiceDate" className="block font-medium sm:text-black" >
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
                  className="block font-medium relative sm:text-black"
                >
                  Client Name
                </label>
                <input
                  id="clientName"
                  type="text"
                  placeholder="Enter client name"
                  value={clientName}
                  // onFocus={handleInputFocus}
                  // onBlur={handleInputBlur}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-black"
                  autoComplete="off"
                />

                {suggestions && (
                  <ul className="border mt-1 rounded bg-white absolute z-10 max-h-56 overflow-y-auto">
                    {suggestions.map((client, index) => (
                      <li
                        key={index}
                        // onClick={() => handleSuggestionClick(client)}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                      >
                        {/* {client.name}  */}
                        {/* Render client name */}
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
                <label className="sm:text-black">Commission + Fare</label>
              </div>
            </div>
            <div className="sm:text-black">
              <label className="font-medium flex  space-x-2   mt-2  ">
                <span className="flex w-[78%] p-2">Invoice Item </span>
                <button
                type="button"
                onClick={addItem1}
                className=" px-4 py-2 sm:hidden bg-blue-500 text-white rounded"
              >
                +
              </button>
                {/* <span className='w-20 p-2  '>Qty </span>
          <span className='w-24 p-2 '>Price</span> */}
              </label>
              {items.map((item, index) => (
                <div
                key={index}
                className="container1 pb-2 flex flex-wrap sm:flex-nowrap space-x-2 bg-gray-100 items-center mb-2 rounded-md px-1"
              >
                {/* First three fields: Item, Quantity, and Price */}
                <div className="flex max-w-[36%] flex-col order-1  ">
                  <label htmlFor={`desc-${index}`} className="text-sm  text-gray-700">
                    Item <button
                  type="button"
                  onClick={() => removeItem1(index)}
                  className="px-2 mb-[1%] text-white order-7 bg-red-500 rounded h-2/3 self-end"
                >
                  -
                </button>
                  </label>
                  <input
                    id={`desc-${index}`}
                    type="text"
                    placeholder="Select Items"
                    value={item.description}
                    onChange={(e) =>
                      updateItem1(index, "description", e.target.value)
                    }
                    // onFocus={() => handleInputFocus1(index)}
                    // onBlur={handleInputBlur1}
                    className="py-2 pl-2 border rounded text-black"
                    autoComplete="off"
                  />
                </div>
                <div className="flex flex-col order-2 sm:order-4  basis-[10%] max-w-[15%] sm:max-w-[12%]">
                  <label htmlFor={`quantity-${index}`} className="text-sm text-gray-700">
                    Carat <span className="text-orange-500">{item.perCarat}</span>
                  </label>
                  <input
                    id={`quantity-${index}`}
                    type="number"
                    placeholder="Carat"
                    value={item.carat}
                    onChange={(e) =>
                      updateItem1(index, "carat", parseInt(e.target.value, 10))
                    }
                    className="p-2 border rounded text-black"
                  />
                </div>
              
                <div className="flex flex-col order-3 sm:order-4  basis-[10%] max-w-[15%] sm:max-w-[12%]">
                  <label htmlFor={`quantity-${index}`} className="text-sm text-gray-700">
                    Quantity
                  </label>
                  <input
                    id={`quantity-${index}`}
                    type="number"
                    placeholder="Quantity"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem1(index, "quantity", parseInt(e.target.value, 10))
                    }
                    className="p-2 border rounded text-black"
                  />
                </div>
                
              
                <div className="flex flex-col order-4 sm:order-5 basis-[10%] max-w-[22%] sm:max-w-[12%]">
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
              
                {/* Wrapable fields: Commission, Fare, Item Total, and Button */}
                {fare && (

                <div className="flex flex-col order-5 sm:order-2 basis-[12%] max-w-[20%] sm:max-w-[12%] ">
                  <label htmlFor={`commission-${index}`} className="text-sm  text-gray-700 ">
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
              )}

            {fare && (
              
                <div className="flex flex-col order-6 sm:order-3 basis-[22%] max-w-[25%] sm:max-w-[12%]">
                  <label htmlFor={`fare-${index}`} className="text-sm text-gray-700">
                    Fare
                  </label>
                  <input
                    id={`fare-${index}`}
                    type="number"
                    placeholder="Fare"
                    onWheel={(e) => e.currentTarget.blur()}
                    value={item.fare}
                    onChange={(e) =>
                      updateItem1(index, "fare", parseFloat(e.target.value))
                    }
                    className="p-2 border rounded text-black"
                  />
                </div>
              )}

              


              
                <div className={`flex flex-col order-6 basis-[30%] max-w-[20%] `} >
                  <label htmlFor={`itemTotal-${index}`} className="text-sm text-gray-700">
                    Item Total
                  </label>
                  <input
                    id={`itemTotal-${index}`}
                    type="number"
                    placeholder="Item Total"
                    value={item.eachItemTotal}
                    
                    className="p-2 border rounded text-black"
                    readOnly
                  />
                </div>
              
              
              </div>
          
              
              
              ))}
              <button
                type="button"
                onClick={addItem1}
                className="mt-2 px-4 hidden sm:block py-2 bg-blue-500 text-white rounded"
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
              onChange={(e) => setBalance(parseFloat(e.target.value))}
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
        </div>

          
            <div>
              <label htmlFor="notes" className="block font-medium sm:text-black">
                Notes
              </label>
              <textarea
                id="notes"
                placeholder="Enter any additional notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 border rounded text-black"
              />
            </div>

            <div className="text-right">
              <p className="text-xl font-bold sm:text-black">
                Total: ₹ {(billTotal + balance).toFixed(2)}
              </p>
              <p className="text-xl font-bold text-blue-500">
                New Balance: ₹ {(billTotal + balance - paid).toFixed(2)}
              </p>
            </div>

            <div className="flex justify-end space-x-2">
            <div
          onClick={() => { showIn()}}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Generate Invoice
          </div>
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