import React, { useRef } from "react";
import html2canvas from "html2canvas";

interface InvoiceProps {
  clientName: string;
  billNo: string;
  total: number;
}

const DownloadButton: React.FC<InvoiceProps> = ({ clientName, billNo, total }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const downloadInvoice = async () => {
    if (!invoiceRef.current) return;

    try {
      const canvas = await html2canvas(invoiceRef.current);
      const image = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = image;
      link.download = `${clientName.replace(/\s+/g, "_")}_invoice.png`;
      link.click();
    } catch (error) {
      console.error("Error capturing invoice:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 bg-gray-100 min-h-screen text-black">
      <div
        ref={invoiceRef}
        className="bg-white p-6 shadow-md rounded-md w-96 text-center border border-gray-300"
      >
        <h1 className="text-2xl font-bold mb-4 text-black">Invoice</h1>
        <p className="mb-2">
          <span className="font-semibold">Client Name:</span> {clientName}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Bill No:</span> {billNo}
        </p>
        <p className="mb-2 text-lg font-bold">
          <span>Total:</span> ${total.toFixed(2)}
        </p>
      </div>

      <button
        onClick={downloadInvoice}
        className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
      >
        Download Invoice
      </button>
    </div>
  );
};

export default DownloadButton;
