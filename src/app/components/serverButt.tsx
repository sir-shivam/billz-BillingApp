
"use client"
import React, { useRef } from "react";
import { toPng } from "html-to-image";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import OpenWhatsApp from "./openWhat";


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
  amount: number,
}

interface InvoicePageProps {
  invoiceDetail: {
    billNo: number;
      clientName: string;
      invoiceDate: string;
      balance: number;
      paid: number;
      items: Item[];
      extra: Extra[];
      notes: string;
      total: number;
  };
   // Define the type of the button function,
  download: boolean;
}

const InvoicePage1: React.FC<InvoicePageProps> = ({ invoiceDetail, download }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

 console.log(download, "download")

  const handleDownloadJPG = async () => {
    if (invoiceRef.current) {
      const dataUrl = await toPng(invoiceRef.current);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `invoice_${invoiceDetail.clientName}.jpg`;
      link.click();
    }
  };
  
  
  
  // import jsPDF from "jspdf";

const handleDownloadPDF = async () => {
  if (invoiceRef.current) {
    const canvas = await html2canvas(invoiceRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("invoice.pdf");
  }
};

const currentPageUrl = window.location.href; 
console.log(currentPageUrl, "page");



  return (
  <div className="absolute w-full h-full bg-slate-400 top-0 left-0 content-center z-10 ">
    <div className=" w-10 h-10 bg-blue-500 absolute right-9 top-8 flex justify-center items-center rounded-md" 
    // onClick={butFun}
    >x</div>
    <div className="text-black font-sans ">
  {/* Invoice Container */}
  <div
    ref={invoiceRef}
    className="max-w-screen-sm mx-auto bg-white border border-gray-300 p-4 rounded-md shadow-md"
  >
    {/* Business Details */}
    <div className="text-center border-b pb-4 my-4">
      <h1 className="text-2xl font-bold">Shree Balaji Fruit & Vegetables</h1>
      <p className="text-sm">S-4, Anand Nagar, Vasai (West)</p>
      <p className="text-sm">Phone: 9730419160</p>
      <p className="text-sm"></p>
    </div>

    {/* Client and Invoice Details */}
    <div className="text-sm mb-4">
      <h2 className="text-lg font-semibold">Invoice Details</h2>
      <p>
        <span className="font-bold">Client Name:</span> {invoiceDetail.clientName}
      </p>
      <p>
        <span className="font-bold">Invoice Date:</span> {invoiceDetail.invoiceDate}
      </p>
      <p>
        <span className="font-bold">Invoice Number:</span> {invoiceDetail.billNo}
      </p>
    </div>

    {/* Invoice Table */}
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border border-gray-300 px-2 py-1">Item</th>
            <th className="border border-gray-300 px-2 py-1">Carat</th>
            <th className="border border-gray-300 px-2 py-1">Kg..</th>
            <th className="border border-gray-300 px-2 py-1">Price/ Kg</th>
            <th className="border border-gray-300 px-2 py-1">Price/ Carat</th>
            <th className="border border-gray-300 px-2 py-1 ">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoiceDetail.items.map((item, index) => (
            <tr key={index} className="text-gray-700">
              <td className="border border-gray-300 px-2 py-3">
                <span className="block font-bold">{item.description}</span>
                <span className="block text-sm text-gray-500">Comm: {item.comm}</span>
                <span className="block text-sm text-gray-500">Fare: {item.fare}</span>
              </td>
              <td className="border border-gray-300 px-2 py-3 text-center">{item.carat}</td>
              <td className="border border-gray-300 px-2 py-3 text-center">{item.quantity}</td>
              <td className="border border-gray-300 px-2 py-3 text-center">{item.price}</td>
              <td className="border border-gray-300 px-2 py-3 text-center">{item.perCarat}</td>
              <td className="border border-gray-300 px-2 py-3 font-bold text-center">{item.eachItemTotal}</td>
            </tr>
          ))}
          { invoiceDetail.extra &&
            invoiceDetail.extra.map((item, index) =>(
              <tr key={index-100} >
              <td className="border border-gray-300 px-2 py-3 font-semibold pl-6  " colSpan={4}>{item.description}</td>
             
              <td className="border border-gray-300 px-2 py-3 text-center"></td>
              <td className="border border-gray-300 px-2 py-3 font-bold text-center">{item.amount}</td>
            </tr>
            ) )
          }
        </tbody>
      </table>
    </div>

    {/* Notes and Total */}
    <div className="text-sm mt-4">
    <p>
        <span className="font-bold">Previous Balance:</span> ₹{invoiceDetail.balance}
      </p>
      <p className="mb-2">
        <span className="font-bold">Notes:</span> {invoiceDetail.notes}
      </p>
      <p className="text-lg">
        <span className="font-bold">Total:</span> ₹{invoiceDetail.total + invoiceDetail.balance}
      </p>
      <p>
        <span className="font-bold">Paid:</span> ₹{invoiceDetail.paid}
      </p>
      <p className="font-bold text-lg text-orange-800">
        <span className="font-bold text-xl">Bill Balance:</span> ₹{invoiceDetail.total + invoiceDetail.balance - invoiceDetail.paid}
      </p>
      
      
    </div>
  </div>

  {/* Download Buttons */}
  <div className="flex justify-center mt-4 space-x-4">
    <button
      onClick={handleDownloadJPG}
      className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
    >
      Download as JPG
    </button>
    <button
      onClick={handleDownloadPDF}
      className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
    >
      Download as PDF
    </button>
    <div>
      <OpenWhatsApp 
        phoneNumber="919730419160" 
        message={`Hello! Here is the link to your bill: ${currentPageUrl}   hello   `}
      />
    </div>

    
  </div>
</div>
</div>


  );
};

export default InvoicePage1;
