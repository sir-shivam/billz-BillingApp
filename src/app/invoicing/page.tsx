  "use client"

  import React, { useEffect,FormEvent, useState, useCallback } from "react";
  import axios from "axios";
import InvoicePage from "../components/DwnBtn";
import { useRouter } from "next/navigation";
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
  interface Extra {
    description: string;
    amount: number;
  }
  interface Client {
    _id: string;
    clientName: string;
    prevBalance: number;
  }

  interface iFetch {
    _id: string;
    name: string;
    price: number
  }
  

  export default function Home() {
    
      const router = useRouter();
      const [clients, setClients] = useState<Client[]>([]);
      const [itemFetched , setItemFetched]  = useState<iFetch[]>([]);
      const [selectedItemId , setselectedItemID] = useState("");
      const [selectedClientId , setSelectedClientId] = useState("")
    const [items, setItems] = useState<Item[]>([
      { description: "", comm: 0, fare: 0, quantity: 1, price: 0 , eachItemTotal: 0 , carat:1 , perCarat:0 },
    ]);
    const [extra , setExtra] = useState<Extra[]>([]);
    const [clientName, setClientName] = useState<string>("");
    const [notes, setNotes] = useState<string>("");
    const [ invoiceId , setInvoiceId] = useState<string>("new");
    const [billNo, setBillNo] = useState<number>(1);
    const [fare, setFare] = useState<boolean>(true);
    const [paid, setPaid] = useState<number>(0); // Paid amount
    const [billTotal , setBillTotal] = useState<number>(0);
    const [invoiceDate, setInvoiceDate] = useState("");
    const [showInvoice , setShowInvoice] = useState(false);
    const [download, setDownload] = useState<boolean>(false);
    const [balance, setBalance] = useState<number>(0); // Client balance
    const getTodayDate = () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      const day = String(today.getDate()).padStart(2, "0"); // Ensure 2 digits
      setInvoiceDate(`${year}-${month}-${day}`);
    };

useEffect(() => {
  console.log(clients, "this");
}, [clients]); // This will log when the clients state updates

const fetchClients = async () => {
  try {
    const response = await axios.get("/api/clients/find", {
      withCredentials: true, // Ensure the cookies are sent
    });
    console.log(response.data, "clients");
    const newData = response.data.business.clients;
    const ItemNew = response.data.business.stocks;
    console.log(newData, "new");
    
    setClients(newData); // Update the state
    setItemFetched(ItemNew);
  } catch (error) {
    console.error("Error fetching clients:", error);
    
  }
};


    useEffect(()=>{
      getTodayDate();
      fetchClients();
    },[])

    // const [dueDate, setDueDate] = useState(getTodayDate());
    

    
    
    
  
    // Memoize the function to prevent re-creation
    const updateItemsAndTotal = useCallback(() => {
      const updatedItems = items.map(item => {
        const perCarat = 
          ((item.comm || 0) + (item.fare || 0)) + ((item.price || 0) * (item.quantity || 0));
        const eachItemTotal = 
          (item.carat || 0) * perCarat;
        return { ...item, eachItemTotal, perCarat };
      });

      const extraTotal = extra.reduce((total, item) => total + item.amount, 0);
      console.log(extraTotal, "total extra");
      console.log(extra, "total extra");

      const billTotal = updatedItems.reduce((total, item) => total + item.eachItemTotal, 0) + extraTotal  ;
      console.log(billTotal);
  
      // Only update if items have actually changed
      const hasChanged = JSON.stringify(items) !== JSON.stringify(updatedItems);
      if (hasChanged) {
        setItems(updatedItems);
      }
  
      setBillTotal(billTotal); // Update billTotal regardless
    }, [items, extra]);
    
    useEffect(() => {
      console.log([items]);
      updateItemsAndTotal();
      
    }, [items , extra, updateItemsAndTotal]);
    
    
    

  
    interface InvoiceDetails {
      billNo: number;
      clientName: string;
      invoiceDate: string;
      selectedClientId: string;
      selectedItemId: string;
      balance: number;
      paid: number;
      items: Item[];
      extra: Extra[];
      notes: string;
      total: number;
    }
    
    const invoiceDetail: InvoiceDetails = {
        billNo,
        clientName,
        selectedClientId,
        selectedItemId,
        invoiceDate,
        balance,
        paid,
        items,
        extra, // need to add this
        notes,
        total: billTotal,
      };

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
      e.preventDefault();
    

      const sendData = async (): Promise<void> => {
        try {
          const response = await axios.post("/api/invoices/add", invoiceDetail);
          console.log(" created the invoice ", response.data); // Log response
          setDownload(true);
          setInvoiceId(response.data.invoice._id);
          console.log("finding id", response.data._id);
          showIn();
          // alert("Invoice created successfully!");
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            // For Axios errors
            console.error("Error creating invoice:", error.response?.data || error.message);
            alert("Failed to create invoice. " + (error.response?.data || error.message));
          } else if (error instanceof Error) {
            // For general errors
            console.error("Error creating invoice:", error.message);
            alert("Failed to create invoice. " + error.message);
          } else {
            console.error("Unexpected error:", error);
            alert("An unexpected error occurred.");
          }
        } finally {
          // Optional: Cleanup or final steps
        }
      };
      

    sendData();
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
      if (field === 'description' && typeof value === 'string') {
        updatedItems[index][field] = value;}
        else if(field !== 'description' && typeof value === 'number' ){
          updatedItems[index][field] = value;
        }
      setItems(updatedItems);
    };

    const addItem2 = () => {
      setExtra([...extra , { description: "", amount: 0}]);
    };
    console.log(extra , "extra");

    const removeItem2 = (index: number) => {
      setExtra(extra.filter((_, i) => i !== index));
    };

    const updateItem2 = (index: number, field: keyof Extra, value: string | number) => {
      const updatedItems = [...extra];
      if (field === 'description' && typeof value === 'string') {
        updatedItems[index][field] = value;}
        else if(field === 'amount' && typeof value === 'number' ){
        updatedItems[index][field] = value;
        }
      setExtra(updatedItems);
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

    console.log(selectedClientId , "id");
    const showIn = () =>{
      if(showInvoice){
        setInvoiceId("new");
        setDownload(false);
        setShowInvoice(false)
      }
      else{
        setShowInvoice(true)
      }
    }

    
    

    return (
      
        <div className="w-full min-h-svh border py-3 rounded-lg px-2 bg-gray-50 sm:mx-auto sm:px-4 sm:py-8 sm:bg-gradient-to-br sm:from-white sm:via-gray-50 sm:to-gray-100 sm:bg-opacity-60 sm:backdrop-blur-md sm:rounded-lg sm:border sm:border-gray-400 sm:border-opacity-30 sm:shadow-lg ">
        {showInvoice && <InvoicePage invoiceDetail={invoiceDetail} butFun={showIn} download={download} invoiceId={invoiceId}  />}
          <div className="flex justify-between" >
          <h1 className="text-3xl font-bold mb-6  text-black">Create Invoice</h1>
           <div className="h-full bg-gray-100 rounded  flex  ">  
            <button 
                onClick={() => router.push('/clients')}
                className="px-4 py-2 h-full  text-sm font-medium text-gray-700 bg-white border border-gray-400 rounded-lg hover:text-purple-800 hover:bg-green-300 transition-colors">
                  ᢥ  ➕
                </button>
                <button 
                onClick={() => router.push('/stocks/new')}
                className="px-4 py-2 h-full  text-sm font-medium text-gray-700 bg-white border border-gray-400 rounded-lg hover:text-purple-800 hover:bg-green-300 transition-colors">
                  🍒 ➕
                </button>

                <button 
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 h-full  text-sm font-medium text-gray-700 bg-white border border-gray-400 rounded-lg hover:text-purple-800 hover:bg-green-300 transition-colors">
                  DashBoard
                </button>

              </div>
          </div>
          <form className="space-y-6  " onSubmit={handleSubmit}>
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
                
                <select
                  id="clientName"
                  // placeholder="Enter client name"
                  value={clientName}
                  className="w-full p-2 border rounded text-black"
                  onChange={(e) => {
                    const clientName1 = e.target.value;
                    setClientName(clientName1);
                    const selectedClient = clients.find((client) => client.clientName === clientName1);
                    console.log(selectedClient, "select")
                    setSelectedClientId(selectedClient?._id || ""); // Set the selected client's ID
                    setBalance(selectedClient?.prevBalance || 0);
                  }}
                  >
                  <option value="" disabled>
                 -- Select a Client --
             </option>
              {clients.map((client) => (
               <option key={client._id} value={client.clientName}>
            {client.clientName}
                </option>
                  ))}
                  </select>

                
              </div>
              <div className="h-full flex items-center content-center ">
                <input
                  id="fare"
                  type="checkbox"
                  className="w-10 text-black"
                  checked={fare} // Bind checked attribute to fare state
                  onChange={handleFareChange} // Update state on change
                />
                <label className="text-black">Commission + Fare</label>
              </div>
            </div>
            <div className="sm:text-black ">
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
                  <select 
                  id="itemName"
                  value={item.description}
                  className="w-full p-2 border rounded text-black"
                  onChange={(e) => {
                    const itemName = e.target.value;
                    item.description = itemName;
                    const selectedItem = itemFetched.find((item) => item.name === itemName);
                    // console.log(selectedClient, "select")
                    setselectedItemID(selectedItem?._id || ""); // Set the selected client's ID
                    item.price = selectedItem?.price || 0
                  }}
                  >
                    <option value="" disabled>
                  - Select Item --
             </option>
              {itemFetched.map((item) => (
               <option key={item._id} value={item.name}>
            {item.name}
                </option>
                  ))}

                  </select>
                  
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

              {/* writing extra here  */}
              <div className="text-black ">
              <label className="font-medium flex  space-x-2   mt-2  ">
                <span className="flex w p-2">Something Extra ? </span>
                <button
                type="button"
                onClick={addItem2}
                className=" px-4 py-2  bg-orange-500 text-white rounded "
              >
                +
              </button>
                {/* <span className='w-20 p-2  '>Qty </span>
          <span className='w-24 p-2 '>Price</span> */}
              </label>
              {extra.map((item, index) => (
                <div
                key={index}
                className="container1 pb-2 flex flex-nowrap space-x-2 bg-gray-100 items-center mb-2 rounded-md px-1"
              >
                {/* First three fields: Item, Quantity, and Price */}
                <div className="flex  flex-col order-1 flex-1 ">
                  <label htmlFor={`desc-${index}`} className="text-sm  text-gray-700">
                    Item 
                  </label>
                  <input
                    id={`desc-${index}`}
                    type="text"
                    placeholder="Something extra"
                    value={item.description}
                    onChange={(e) =>
                      updateItem2(index, "description", e.target.value)
                    }
                    // onFocus={() => handleInputFocus1(index)}
                    // onBlur={handleInputBlur1}
                    className="py-2 pl-2 border rounded text-black"
                    autoComplete="off"
                  />
                </div>

              
                <div className={`flex flex-col order-6 basis-[30%] max-w-[30%]  `} >
                  <label htmlFor={`itemTotal-${index}`} className="text-sm text-gray-700">
                    Amount
                  </label>
                  <input
                    id={`itemTotal-${index}`}
                    type="number"
                    placeholder="Amount"
                    value={item.amount}
                    onChange={(e) =>
                      updateItem2(index, "amount", parseInt(e.target.value, 10))
                    }
                    
                    className="p-2 border rounded text-black"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeItem2(index)}
                  className="px-2 mb-[1%] text-white order-7 bg-red-500 rounded h-2/3 self-end"
                >
                  -
                </button>
              
              
              </div>
          
              
              
              ))}
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
      
    );
  }